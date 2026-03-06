package com.bookfair.service;

import com.bookfair.dto.response.StallUpdateMessage;
import com.bookfair.features.reservation.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service to broadcast real-time updates to connected clients via WebSocket.
 */
@Service
@RequiredArgsConstructor
public class RealTimeUpdateService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcasts a stall availability update to all subscribed clients.
     */
    public void broadcastStallUpdate(Long stallId, boolean reserved, String occupiedBy, String publisherCategory) {
        StallUpdateMessage message = StallUpdateMessage.builder()
                .stallId(stallId)
                .reserved(reserved)
                .occupiedBy(occupiedBy)
                .publisherCategory(publisherCategory)
                .build();
        
        messagingTemplate.convertAndSend("/topic/stalls", message);
    }

    /**
     * Helper to broadcast update from a Reservation entity.
     */
    public void broadcastFromReservation(Reservation reservation) {
        boolean isReserved = reservation.getStatus() == Reservation.ReservationStatus.PAID || 
                             reservation.getStatus() == Reservation.ReservationStatus.PENDING_PAYMENT;
        
        String occupiedBy = isReserved ? reservation.getUser().getBusinessName() : null;
        String category = (isReserved && reservation.getUser().getCategories() != null && !reservation.getUser().getCategories().isEmpty())
                ? reservation.getUser().getCategories().iterator().next().name() : null;
                
        broadcastStallUpdate(reservation.getEventStall().getId(), isReserved, occupiedBy, category);
    }
}
