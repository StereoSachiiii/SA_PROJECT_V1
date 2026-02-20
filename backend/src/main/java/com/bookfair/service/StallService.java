package com.bookfair.service;

import com.bookfair.entity.Reservation;
import com.bookfair.repository.ReservationRepository;
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
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    
    // Seeding logic moved to DataSeeder.java
    
    public List<com.bookfair.dto.response.StallResponse> getByEventId(Long eventId) {
        List<com.bookfair.entity.EventStall> stalls = eventStallRepository.findByEvent_Id(eventId);
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap(eventId);
        return stalls.stream().map(s -> mapToResponse(s, activeReservationMap)).collect(Collectors.toList());
    }

    public List<com.bookfair.dto.response.StallResponse> getAll(String sizeStr, Boolean available) {
        List<com.bookfair.entity.EventStall> stalls = eventStallRepository.findAll();
        // Filtering could be added here if needed for V4
        
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return stalls.stream().map(s -> mapToResponse(s, activeReservationMap)).collect(Collectors.toList());
    }

    public List<com.bookfair.dto.response.StallResponse> getAvailable() {
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return eventStallRepository.findAll().stream()
                .filter(s -> !activeReservationMap.containsKey(s.getId()))
                .map(s -> mapToResponse(s, activeReservationMap)).collect(Collectors.toList());
    }

    public com.bookfair.dto.response.StallResponse getById(Long id) {
        com.bookfair.entity.EventStall stall = eventStallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventStall not found"));
        Map<Long, Reservation> activeReservationMap = buildActiveReservationMap();
        return mapToResponse(stall, activeReservationMap);
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

    private com.bookfair.dto.response.StallResponse mapToResponse(com.bookfair.entity.EventStall eventStall, Map<Long, Reservation> activeReservationMap) {
        com.bookfair.dto.response.StallResponse response = new com.bookfair.dto.response.StallResponse();
        response.setId(eventStall.getId());
        
        com.bookfair.entity.StallTemplate template = eventStall.getStallTemplate();
        if (template != null) {
            response.setName(template.getName());
            if (template.getHall() != null) {
                response.setHallName(template.getHall().getName());
                response.setHallCategory(template.getHall().getMainCategory() != null ? 
                                         template.getHall().getMainCategory().name() : null);
            }
            response.setSize(template.getSize().name());
            response.setType(template.getType().name());
            response.setProximityScore(template.getDefaultProximityScore());
            // Prioritize EventStall geometry (custom for event) then template
            response.setGeometry(eventStall.getGeometry() != null ? 
                                 eventStall.getGeometry() : 
                                 template.getGeometry());
        }
        
        response.setPriceCents(eventStall.getFinalPriceCents());
        
        // V6: Spatial Scoring Algorithm (Narrative Value)
        java.util.Map<String, Object> breakdown = new java.util.HashMap<>();
        breakdown.put("Base Rate", eventStall.getBaseRateCents());
        
        int calculatedScore = 0;
        java.util.List<java.util.Map<String, Object>> drivers = new java.util.ArrayList<>();

        try {
            if (eventStall.getStallTemplate().getHall() != null) {
                String hallLayout = eventStall.getStallTemplate().getHall().getStaticLayout();
                if (hallLayout != null && !hallLayout.trim().isEmpty() && !hallLayout.equals("{}")) {
                    com.fasterxml.jackson.databind.JsonNode hallNode = objectMapper.readTree(hallLayout);
                    com.fasterxml.jackson.databind.JsonNode influences = hallNode.get("influences");
                    
                    double hallWidth = hallNode.has("width") ? hallNode.get("width").asDouble() : 1000.0;
                    double hallHeight = hallNode.has("height") ? hallNode.get("height").asDouble() : 800.0;
                    
                    String geometryStr = eventStall.getGeometry();
                    if (geometryStr == null || geometryStr.trim().isEmpty()) {
                        geometryStr = eventStall.getStallTemplate().getGeometry();
                    }

                    if (geometryStr != null && !geometryStr.trim().isEmpty()) {
                        com.fasterxml.jackson.databind.JsonNode stallGeom = objectMapper.readTree(geometryStr);
                        if (stallGeom.has("x") && stallGeom.has("y")) {
                            double stallX = stallGeom.get("x").asDouble() + (stallGeom.has("w") ? stallGeom.get("w").asDouble() / 2 : 0);
                            double stallY = stallGeom.get("y").asDouble() + (stallGeom.has("h") ? stallGeom.get("h").asDouble() / 2 : 0);

                            if (influences != null && influences.isArray()) {
                                for (com.fasterxml.jackson.databind.JsonNode influence : influences) {
                                    double infX = influence.get("x").asDouble();
                                    double infY = influence.get("y").asDouble();
                                    double radius = influence.get("radius").asDouble();
                                    int intensity = influence.get("intensity").asInt();
                                    String typeStr = influence.get("type").asText();
                                    String falloffStr = influence.get("falloff").asText();

                                    double normStallX = (stallX / 100.0) * hallWidth;
                                    double normStallY = (stallY / 100.0) * hallHeight;

                                    double dist = Math.sqrt(Math.pow(normStallX - infX, 2) + Math.pow(normStallY - infY, 2));

                                    if (dist < radius) {
                                        double factor = 1.0 - (dist / radius);
                                        if ("EXPONENTIAL".equals(falloffStr)) factor = Math.pow(factor, 2);
                                        
                                        int contribution = (int) (intensity * factor);
                                        if (contribution > 0) {
                                            calculatedScore += contribution;
                                            java.util.Map<String, Object> driver = new java.util.HashMap<>();
                                            driver.put("label", typeStr + " Proximity");
                                            driver.put("value", "+" + contribution);
                                            drivers.add(driver);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Spatial scoring failed: " + e.getMessage());
            calculatedScore = eventStall.getStallTemplate().getDefaultProximityScore() * DEFAULT_PROXIMITY_MULTIPLIER;
        }

        // Apply Edge distance penalty (simplified)
        String geomStr = eventStall.getGeometry() != null ? eventStall.getGeometry() : eventStall.getStallTemplate().getGeometry();
        if (geomStr != null && (geomStr.contains("\"x\": 0") || geomStr.contains("\"x\": 0.0") ||
            geomStr.contains("\"y\": 0") || geomStr.contains("\"y\": 0.0"))) {
            calculatedScore -= EDGE_DISTANCE_PENALTY;
            java.util.Map<String, Object> penalty = new java.util.HashMap<>();
            penalty.put("label", "Edge Distance");
            penalty.put("value", "-" + EDGE_DISTANCE_PENALTY);
            drivers.add(penalty);
        }

        calculatedScore = Math.min(MAX_SCORE, Math.max(MIN_SCORE, calculatedScore));
        
        breakdown.put("Visibility Score", calculatedScore + "/100");
        breakdown.put("Value Drivers", drivers);
        
        response.setPricingBreakdown(breakdown);
        response.setProximityScore(calculatedScore / SCORE_SCALE_DIVISOR); // Scale 0-100 to 1-5

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
