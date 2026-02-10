package com.bookfair.service;

import com.bookfair.dto.request.ReservationRequest;
import com.bookfair.entity.Publisher;
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
    private final PublisherService publisherService;
    private final QrService qrService;
    private final EmailService emailService;
    
    private static final int MAX_STALLS_PER_PUBLISHER = 3;
    
    @Transactional
    public List<Reservation> createReservations(ReservationRequest request) {
        Publisher publisher = publisherService.getById(request.getPublisherId());
        
        // Check max stalls limit
        long currentCount = reservationRepository.countByPublisherId(publisher.getId());
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
            reservation.setPublisher(publisher);
            reservation.setStall(stall);
            reservation.setQrCode(UUID.randomUUID().toString());
            reservations.add(reservationRepository.save(reservation));
        }
        
        // Send confirmation email
        emailService.sendConfirmation(publisher.getEmail(), reservations);
        
        return reservations;
    }
    
    public List<Reservation> getByPublisher(Long publisherId) {
        return reservationRepository.findByPublisherId(publisherId);
    }
    
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }
}
