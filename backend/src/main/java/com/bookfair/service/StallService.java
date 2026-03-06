package com.bookfair.service;

import com.bookfair.features.reservation.Reservation;
import com.bookfair.features.reservation.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.bookfair.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import static com.bookfair.constant.ScoringConstants.*;

/**
 * Service layer for stall operations — querying, filtering, and initialization.
 *
 * Stall availability is derived from the reservations table (no redundant boolean).
 * On first startup, seeds 20 sample stalls if none exist in the database.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StallService {
    
    private final ReservationRepository reservationRepository;
    private final com.bookfair.repository.EventStallRepository eventStallRepository;
    private final com.bookfair.repository.MapInfluenceRepository mapInfluenceRepository;
    private final PricingService pricingService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    
    // Seeding logic moved to DataSeeder.java
    
    public List<com.bookfair.dto.response.StallResponse> getByEventId(Long eventId) {
        List<com.bookfair.entity.EventStall> stalls = eventStallRepository.findByEvent_Id(eventId);
        List<com.bookfair.entity.MapInfluence> influences = mapInfluenceRepository.findByEvent_Id(eventId);
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap(eventId);
        return stalls.stream().map(s -> mapToResponse(s, activeReservationMap, influences)).collect(Collectors.toList());
    }

    public List<com.bookfair.dto.response.StallResponse> getAll(String sizeStr, Boolean available) {
        List<com.bookfair.entity.EventStall> stalls = eventStallRepository.findAll();
        // Filtering could be added here if needed for V4
        
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return stalls.stream().map(s -> mapToResponse(s, activeReservationMap, java.util.Collections.emptyList())).collect(Collectors.toList());
    }

    public List<com.bookfair.dto.response.StallResponse> getAvailable() {
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return eventStallRepository.findAll().stream()
                .filter(s -> !activeReservationMap.containsKey(s.getId()))
                .map(s -> mapToResponse(s, activeReservationMap, java.util.Collections.emptyList())).collect(Collectors.toList());
    }

    public com.bookfair.dto.response.StallResponse getById(Long id) {
        com.bookfair.entity.EventStall stall = eventStallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventStall not found"));
        List<com.bookfair.entity.MapInfluence> influences = stall.getEvent() != null ? 
                                                            mapInfluenceRepository.findByEvent_Id(stall.getEvent().getId()) : 
                                                            java.util.Collections.emptyList();
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return mapToResponse(stall, activeReservationMap, influences);
    }

    /**
     * Build a map of stallId -> active (PENDING or PAID) Reservation for a specific event.
     */
    private Map<Long, Reservation> buildActiveReservationMap(Long eventId) {
        return ((List<Reservation>) reservationRepository.findActiveByEventId(eventId)).stream()
                .collect(Collectors.toMap(
                        (Reservation r) -> r.getEventStall().getId(),
                        (Reservation r) -> r,
                        (existing, replacement) -> existing
                ));
    }

    /**
     * Build a map of stallId -> active (PENDING or PAID) Reservation for all events.
     */
    private Map<Long, Reservation> buildActiveReservationMap() {
        return ((List<Reservation>) reservationRepository.findAll()).stream()
                .filter((Reservation r) -> r.getStatus() == Reservation.ReservationStatus.PAID || 
                             r.getStatus() == Reservation.ReservationStatus.PENDING_PAYMENT)
                .collect(Collectors.toMap(
                        (Reservation r) -> r.getEventStall().getId(),
                        (Reservation r) -> r,
                        (existing, replacement) -> existing
                ));
    }

    private com.bookfair.dto.response.StallResponse mapToResponse(com.bookfair.entity.EventStall eventStall, Map<Long, Reservation> activeReservationMap, List<com.bookfair.entity.MapInfluence> influences) {
        com.bookfair.dto.response.StallResponse response = new com.bookfair.dto.response.StallResponse();
        response.setId(eventStall.getId());
        
        com.bookfair.entity.StallTemplate template = eventStall.getStallTemplate();
        if (template != null) {
            response.setName(template.getName());
            response.setTemplateName(template.getName());
            if (template.getHall() != null) {
                response.setHallName(template.getHall().getName());
                response.setHallCategory(template.getHall().getMainCategory() != null ? 
                                         template.getHall().getMainCategory().name() : null);
            }
            response.setSize(template.getSize().name());
            response.setType(template.getType().name());
            response.setProximityScore(template.getDefaultProximityScore());
            
            // Map structured coordinates
            response.setPosX(eventStall.getPosX() != null ? eventStall.getPosX() : template.getPosX());
            response.setPosY(eventStall.getPosY() != null ? eventStall.getPosY() : template.getPosY());
            response.setWidth(eventStall.getWidth() != null ? eventStall.getWidth() : template.getWidth());
            response.setHeight(eventStall.getHeight() != null ? eventStall.getHeight() : template.getHeight());
        }
        
        response.setPriceCents(eventStall.getFinalPriceCents());
        
        java.util.Map<String, Object> breakdown = new java.util.HashMap<>();
        int calculatedScore = 0;
        
        try {
            if (eventStall.getEvent() != null) {
                breakdown = pricingService.calculatePriceBreakdown(eventStall, influences);
                calculatedScore = ((Number) breakdown.getOrDefault("calculatedScore", 0)).intValue();
            }
        } catch (Exception e) {
            log.error("Spatial scoring fallback failed: " + e.getMessage());
        }
        
        response.setPricingBreakdown(breakdown);
        response.setProximityScore(calculatedScore / SCORE_SCALE_DIVISOR);

        Reservation reservation = activeReservationMap.get(eventStall.getId());
        boolean isTemplateBlocked = (template != null && Boolean.FALSE.equals(template.getIsAvailable()));
        boolean isStallBlocked = (eventStall.getStatus() == com.bookfair.entity.EventStallStatus.BLOCKED);
        
        response.setReserved(reservation != null || isTemplateBlocked || isStallBlocked);
        response.setOccupiedBy(reservation != null ? reservation.getUser().getBusinessName() : (isTemplateBlocked || isStallBlocked ? "BLOCKED" : null));
        response.setPublisherCategory(reservation != null && reservation.getUser().getCategories() != null && !reservation.getUser().getCategories().isEmpty() ? 
                                       reservation.getUser().getCategories().iterator().next().name() : null);
        
        return response;
    }
}
