package com.bookfair.service;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.entity.User;
import com.bookfair.entity.Reservation;
import com.bookfair.entity.Stall;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.repository.StallRepository;
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
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final StallRepository stallRepository;
    private final UserService userService;
    private final QrService qrService;
    private final EmailService emailService;
    
    private static final int MAX_STALLS_PER_PUBLISHER = 3;
    
    /**
     * Creates one or more reservations for a user.
     *
     * Enforces:
     * - Max 3 stalls per user (only counts CONFIRMED reservations)
     * - Stall must not already have a CONFIRMED reservation
     *
     * After creation, sends a confirmation email and updates emailSent flag.
     */
    @Transactional
    public List<Reservation> createReservations(ReservationRequest request) {
        User user = userService.getById(request.getUserId());
        
        // Check max stalls limit (only count CONFIRMED reservations)
        long currentCount = reservationRepository.countByUserIdAndStatusConfirmed(user.getId());
        if (currentCount + request.getStallIds().size() > MAX_STALLS_PER_PUBLISHER) {
            throw new RuntimeException("Cannot reserve more than " + MAX_STALLS_PER_PUBLISHER + " stalls");
        }
        
        List<Reservation> reservations = new ArrayList<>();
        
        for (Long stallId : request.getStallIds()) {
            Stall stall = stallRepository.findById(stallId)
                    .orElseThrow(() -> new RuntimeException("Stall not found: " + stallId));
            
            // Check if stall is already reserved (via reservations table, not a boolean)
            if (reservationRepository.isStallReserved(stallId)) {
                throw new RuntimeException("Stall already reserved: " + stall.getName());
            }
            
            // Create reservation
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setStall(stall);
            reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            reservation.setEmailSent(false);
            // Temporary QR — will be updated with proper ID after save
            reservation.setQrCode("TEMP-" + UUID.randomUUID().toString());
            
            // Save first to get ID
            reservation = reservationRepository.save(reservation);
            
            // Update QR Code with reservation ID for a cleaner format
            reservation.setQrCode("RES-" + reservation.getId());
            reservations.add(reservationRepository.save(reservation));
        }
        
        // Send confirmation email and update tracking flag
        try {
            emailService.sendConfirmation(user.getEmail(), reservations);
            for (Reservation r : reservations) {
                r.setEmailSent(true);
                reservationRepository.save(r);
            }
        } catch (Exception e) {
            // Log but don't fail the reservation if email fails
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
        
        return reservations;
    }
    
    public List<Reservation> getByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }
    
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }
}
