package com.bookfair.service;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.entity.User;
import com.bookfair.entity.Reservation;
import com.bookfair.entity.Reservation;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.exception.ConflictException;
import com.bookfair.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for reservation operations.
 *
 * Handles creating reservations (with max-3-per-business enforcement),
 * checking stall availability via the reservations table, generating QR codes,
 * and triggering confirmation emails.
 */
@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final com.bookfair.repository.EventStallRepository eventStallRepository;
    private final UserService userService;
    private final QrService qrService;
    private final EmailService emailService;
    private final NotificationService notificationService;
    
    @org.springframework.beans.factory.annotation.Value("${app.reservation.max-stalls:3}")
    private int maxStallsPerPublisher;
    
    /**
     * Creates one or more reservations for a user.
     * Starts in PENDING state, awaiting payment.
     */
    @Transactional
    public List<Reservation> createReservations(ReservationRequest request) {
        User user = userService.getByIdForServices(request.getUserId());
        
        // Limit check now happens inside the loop per event
        
        List<Reservation> reservations = new ArrayList<>();
        Long eventId = null;
        String eventName = "";
        
        for (Long eventStallId : request.getStallIds()) {
            com.bookfair.entity.EventStall eventStall = eventStallRepository.findById(eventStallId)
                    .orElseThrow(() -> new ResourceNotFoundException("EventStall not found: " + eventStallId));
            
            if (eventId == null) {
                eventId = eventStall.getEvent().getId();
                eventName = eventStall.getEvent().getName();
                // Check max stalls limit per event (count PENDING and PAID)
                long currentCount = reservationRepository.countByUserIdAndEventIdAndStatusActive(user.getId(), eventId);
                if (currentCount + request.getStallIds().size() > maxStallsPerPublisher) {
                    throw new BadRequestException("Cannot reserve more than " + maxStallsPerPublisher + " stalls for this event");
                }
            }
            
            if (reservationRepository.isStallReserved(eventStallId)) {
                throw new ConflictException("Stall already reserved or pending: " + eventStallId);
            }
            
            Reservation reservation = Reservation.builder()
                    .user(user)
                    .eventStall(eventStall)
                    .status(Reservation.ReservationStatus.PENDING_PAYMENT)
                    .emailSent(false)
                    .qrCode("TEMP-" + UUID.randomUUID())
                    .build();
            
            reservation = reservationRepository.save(reservation);
            reservation.setQrCode("RES-" + reservation.getId());
            reservations.add(reservationRepository.save(reservation));
        }

        // Trigger Notification
        notificationService.createNotification(
            user, 
            String.format("New booking initiated for %s. Complete payment to secure your stalls.", eventName),
            com.bookfair.entity.Notification.NotificationType.INFO
        );
        
        // Optionally send a "Payment Requested" email here
        return reservations;
    }

    /**
     * Transitions a reservation from PENDING_PAYMENT to PAID after payment success.
     * This triggers the final QR ticket email.
     */
    @Transactional
    public void confirmPayment(Long reservationId) {
        Reservation reservation = reservationRepository.findByIdWithDetails(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Can only confirm payment for PENDING_PAYMENT reservations");
        }

        reservation.setStatus(Reservation.ReservationStatus.PAID);
        reservationRepository.save(reservation);

        // Trigger Notification
        notificationService.createNotification(
            reservation.getUser(),
            String.format("Payment confirmed for %s (Stall: %s). Your entry ticket is ready!", 
                reservation.getEventStall().getEvent().getName(),
                reservation.getEventStall().getStallTemplate().getName()),
            com.bookfair.entity.Notification.NotificationType.SUCCESS
        );

        // Send final confirmation email with QR Ticket
        try {
            List<Reservation> list = new ArrayList<>();
            list.add(reservation);
            emailService.sendConfirmation(reservation.getUser().getEmail(), list);
            reservation.setEmailSent(true);
            reservationRepository.save(reservation);
        } catch (Exception e) {
            log.error("Failed to send final ticket: {}", e.getMessage());
        }
    }
    
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Reservation> getByUser(Long userId, String requesterUsername) {
        User requester = userService.getByUsernameForServices(requesterUsername);
        if (!requester.getId().equals(userId) && 
            requester.getRole() != User.Role.ADMIN && 
            requester.getRole() != User.Role.EMPLOYEE) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
        return reservationRepository.findByUserId(userId);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Reservation> getByUsername(String username) {
        User user = userService.getByUsernameForServices(username);
        return reservationRepository.findByUserId(user.getId());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Reservation getById(Long id, String username) {
        Reservation reservation = reservationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        User requester = userService.getByUsernameForServices(username);
        if (!reservation.getUser().getId().equals(requester.getId()) &&
            requester.getRole() != User.Role.ADMIN &&
            requester.getRole() != User.Role.EMPLOYEE) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
        return reservation;
    }

    public java.util.Map<String, Integer> getAvailableCount(String username, Long eventId) {
        User user = userService.getByUsernameForServices(username);
        long used = (eventId != null) 
            ? reservationRepository.countByUserIdAndEventIdAndStatusActive(user.getId(), eventId)
            : reservationRepository.countByUserIdAndStatusActive(user.getId());
            
        return java.util.Map.of(
            "limit", maxStallsPerPublisher,
            "used", (int) used,
            "remaining", (int) Math.max(0, maxStallsPerPublisher - used)
        );
    }
    
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }
    
    @Transactional
    public void cancelReservation(Long reservationId, String requesterUsername) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        User requester = userService.getByUsernameForServices(requesterUsername);

        if (!reservation.getUser().getId().equals(requester.getId()) && 
            requester.getRole() != User.Role.ADMIN && 
            requester.getRole() != User.Role.EMPLOYEE) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }

        // Only allow direct cancellation if it's PENDING_PAYMENT
        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Only pending payment reservations can be directly cancelled. Paid reservations require a refund request.");
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        // Trigger Notification if not cancelled by owner (e.g. by admin)
        if (!reservation.getUser().getId().equals(requester.getId())) {
             notificationService.createNotification(
                reservation.getUser(),
                String.format("Your reservation for %s has been cancelled by an administrator.", 
                    reservation.getEventStall().getEvent().getName()),
                com.bookfair.entity.Notification.NotificationType.WARNING
            );
        }
    }

    @Transactional
    public void requestRefund(Long reservationId, String requesterUsername, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        User requester = userService.getByUsernameForServices(requesterUsername);

        if (!reservation.getUser().getId().equals(requester.getId()) && 
            requester.getRole() != User.Role.ADMIN && 
            requester.getRole() != User.Role.EMPLOYEE) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }

        if (reservation.getStatus() != Reservation.ReservationStatus.PAID) {
            throw new BadRequestException("Only PAID reservations can be requested for a refund.");
        }

        reservation.setStatus(Reservation.ReservationStatus.PENDING_REFUND);
        reservationRepository.save(reservation);

        // Notify admins regarding the refund request
        // (In a real system, you'd probably send an email or internal admin dashboard alert)
    }
}
