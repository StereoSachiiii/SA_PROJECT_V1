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

@Service
@RequiredArgsConstructor
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final StallRepository stallRepository;
    private final UserService userService;
    private final QrService qrService;
    private final EmailService emailService;
    
    private static final int MAX_STALLS_PER_PUBLISHER = 3;
    
    @Transactional
    public List<Reservation> createReservations(ReservationRequest request) {
        User user = userService.getById(request.getUserId());
        
        // Check max stalls limit
        long currentCount = reservationRepository.countByUserId(user.getId());
        if (currentCount + request.getStallIds().size() > MAX_STALLS_PER_PUBLISHER) {
            throw new RuntimeException("Cannot reserve more than " + MAX_STALLS_PER_PUBLISHER + " stalls");
        }
        
        List<Reservation> reservations = new ArrayList<>();
        
        for (Long stallId : request.getStallIds()) {
            Stall stall = stallRepository.findById(stallId)
                    .orElseThrow(() -> new RuntimeException("Stall not found: " + stallId));
            
            if (stall.getReserved()) {
                throw new RuntimeException("Stall already reserved: " + stall.getName());
            }
            
            // Mark stall as reserved
            stall.setReserved(true);
            stallRepository.save(stall);
            
            // Create reservation
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setStall(stall);
            // Save first to get ID
            reservation = reservationRepository.save(reservation);
            
            // Update QR Code with ID
            reservation.setQrCode("RES-" + reservation.getId());
            reservations.add(reservationRepository.save(reservation));
        }
        
        // Send confirmation email
        emailService.sendConfirmation(user.getEmail(), reservations);
        
        return reservations;
    }
    
    public List<Reservation> getByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }
    
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }
}
