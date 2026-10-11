package com.bookfair.service;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.entity.User;
import com.bookfair.entity.Reservation;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.exception.ConflictException;
import com.bookfair.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for secure stall reservation operations.
 * Enforces OWASP guidelines:
 * - Username is strictly extracted from JWT authentication principal.
 * - Access control checks ensure users only access/modify their own records unless authorized as ORGANIZER.
 */
@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final com.bookfair.repository.EventStallRepository eventStallRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @org.springframework.beans.factory.annotation.Value("${app.reservation.max-stalls:3}")
    private int maxStallsPerPublisher;

    /**
     * Enforces ABAC ownership check: throws AccessDeniedException if authenticated user
     * does not own the reservation and is not an ORGANIZER/ADMIN/EMPLOYEE.
     */
    private void verifyOwnershipOrOrganizer(Reservation reservation, String requesterUsername) {
        User requester = userService.getByUsernameForServices(requesterUsername);
        boolean isOwner = reservation.getUser() != null && reservation.getUser().getUsername().equals(requesterUsername);
        boolean isOrganizer = requester.getRole() == User.Role.ADMIN || requester.getRole() == User.Role.EMPLOYEE;

        if (!isOwner && !isOrganizer) {
            throw new AccessDeniedException("Access Denied: You do not have permission to access or modify this reservation");
        }
    }

    /**
     * Creates one or more reservations for a user.
     * Username is extracted strictly from the JWT authentication principal.
     */
    @Transactional
    public List<Reservation> createReservations(ReservationRequest request, String username) {
        User user = userService.getByUsernameForServices(username);

        List<Reservation> reservations = new ArrayList<>();
        Long eventId = request.getEventId();
        String eventName = request.getEventName();

        List<Long> stallIds = request.getStallIds();
        if (stallIds != null && !stallIds.isEmpty()) {
            for (Long eventStallId : stallIds) {
                com.bookfair.entity.EventStall eventStall = eventStallRepository.findById(eventStallId)
                        .orElseThrow(() -> new ResourceNotFoundException("EventStall not found: " + eventStallId));

                if (eventId == null) {
                    eventId = eventStall.getEvent().getId();
                }

                if (reservationRepository.isStallReserved(eventStallId)) {
                    throw new ConflictException("Stall already reserved or pending: " + eventStallId);
                }

                String sanitizedComments = request.getSpecialComments() != null
                        ? org.springframework.web.util.HtmlUtils.htmlEscape(request.getSpecialComments().trim())
                        : null;

                Reservation reservation = Reservation.builder()
                        .user(user)
                        .eventStall(eventStall)
                        .eventName(request.getEventName())
                        .reservationDate(request.getReservationDate())
                        .stallType(request.getStallType() != null ? request.getStallType().name() : null)
                        .stallSize(request.getStallSize() != null ? request.getStallSize().name() : null)
                        .stallCount(request.getStallCount())
                        .businessCategory(request.getBusinessCategory())
                        .specialComments(sanitizedComments)
                        .status(Reservation.ReservationStatus.PENDING_PAYMENT)
                        .emailSent(false)
                        .qrCode("TEMP-" + UUID.randomUUID())
                        .build();

                reservation = reservationRepository.save(reservation);
                reservation.setQrCode("RES-" + reservation.getId());
                reservations.add(reservationRepository.save(reservation));
            }
        } else {
            // Generic reservation creation without specific eventStall IDs
            Reservation reservation = Reservation.builder()
                    .user(user)
                    .eventName(request.getEventName())
                    .reservationDate(request.getReservationDate())
                    .stallType(request.getStallType() != null ? request.getStallType().name() : null)
                    .stallSize(request.getStallSize() != null ? request.getStallSize().name() : null)
                    .stallCount(request.getStallCount())
                    .businessCategory(request.getBusinessCategory())
                    .specialComments(request.getSpecialComments())
                    .status(Reservation.ReservationStatus.PENDING_PAYMENT)
                    .emailSent(false)
                    .qrCode("TEMP-" + UUID.randomUUID())
                    .build();

            reservation = reservationRepository.save(reservation);
            reservation.setQrCode("RES-" + reservation.getId());
            reservations.add(reservationRepository.save(reservation));
        }

        notificationService.createNotification(
                user,
                String.format("New booking initiated for %s. Complete payment to secure your stalls.", eventName),
                com.bookfair.entity.Notification.NotificationType.INFO
        );

        return reservations;
    }

    /**
     * Transitions a reservation from PENDING_PAYMENT to PAID after payment success.
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

        notificationService.createNotification(
                reservation.getUser(),
                String.format("Payment confirmed for %s. Your entry ticket is ready!", reservation.getEventName()),
                com.bookfair.entity.Notification.NotificationType.SUCCESS
        );

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

    @Transactional(readOnly = true)
    public List<Reservation> getByUser(Long userId, String requesterUsername) {
        User requester = userService.getByUsernameForServices(requesterUsername);
        if (!requester.getId().equals(userId) &&
            requester.getRole() != User.Role.ADMIN &&
            requester.getRole() != User.Role.EMPLOYEE) {
            throw new AccessDeniedException("Access denied");
        }
        return reservationRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getByUsername(String username) {
        return reservationRepository.findByUserUsername(username);
    }

    @Transactional(readOnly = true)
    public Reservation getById(Long id, String username) {
        Reservation reservation = reservationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));

        verifyOwnershipOrOrganizer(reservation, username);
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

    @Transactional(readOnly = true)
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Transactional
    public void cancelReservation(Long reservationId, String requesterUsername) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        verifyOwnershipOrOrganizer(reservation, requesterUsername);

        if (reservation.getStatus() != Reservation.ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Only pending payment reservations can be directly cancelled. Paid reservations require a refund request.");
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void requestRefund(Long reservationId, String requesterUsername, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        verifyOwnershipOrOrganizer(reservation, requesterUsername);

        if (reservation.getStatus() != Reservation.ReservationStatus.PAID) {
            throw new BadRequestException("Only PAID reservations can be requested for a refund.");
        }

        reservation.setStatus(Reservation.ReservationStatus.PENDING_REFUND);
        reservationRepository.save(reservation);
    }
}
