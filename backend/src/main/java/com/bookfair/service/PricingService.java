package com.bookfair.service;

import com.bookfair.entity.EventStall;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.EventStallRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.bookfair.constant.ScoringConstants.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingService {

    private final EventStallRepository eventStallRepository;
    private final com.bookfair.repository.MapInfluenceRepository mapInfluenceRepository;
    private final ObjectMapper objectMapper;

    /**
     * Recalculates prices for all stalls in an event based on the current layout.
     */
    @Transactional
    public void recalculateEventPrices(Long eventId) {
        log.info("Recalculating prices for event ID: {}", eventId);
        List<EventStall> stalls = eventStallRepository.findByEvent_Id(eventId);
        if (stalls.isEmpty()) return;

        List<com.bookfair.entity.MapInfluence> influences = mapInfluenceRepository.findByEvent_Id(eventId);
        
        for (EventStall stall : stalls) {
            calculateAndApplyPrice(stall, influences);
        }
        eventStallRepository.saveAll(stalls);
    }

    /**
     * Calculates the price for a single stall and updates its fields.
     */
    public Map<String, Object> calculatePriceBreakdown(EventStall stall, List<com.bookfair.entity.MapInfluence> influences) {
        long baseRateCents = stall.getBaseRateCents();
        int defaultProximityScore = stall.getStallTemplate().getDefaultProximityScore();
        double multiplier = stall.getMultiplier();

        return calculatePriceBreakdown(stall, baseRateCents, defaultProximityScore, multiplier, influences);
    }


    /**
     * Calculates the price for a single stall without requiring a persisted entity.
     */
    public Map<String, Object> calculatePriceInteractive(Long eventId, String geometryJson, Long baseRateCents, Integer defaultProximityScore) {
        EventStall dummyStall = new EventStall();
        try {
            if (geometryJson != null && !geometryJson.isEmpty()) {
                JsonNode geom = objectMapper.readTree(geometryJson);
                dummyStall.setPosX(geom.path("x").asDouble());
                dummyStall.setPosY(geom.path("y").asDouble());
                dummyStall.setWidth(geom.path("w").asDouble());
                dummyStall.setHeight(geom.path("h").asDouble());
            }
        } catch (Exception e) {
            log.warn("Invalid geometry JSON: {}", geometryJson);
        }

        List<com.bookfair.entity.MapInfluence> influences = mapInfluenceRepository.findByEvent_Id(eventId);
        long rate = baseRateCents != null ? baseRateCents : 0L;
        int prox = defaultProximityScore != null ? defaultProximityScore : 1;
        
        return calculatePriceBreakdown(dummyStall, rate, prox, 1.0, influences);
    }

    public Map<String, Object> calculatePriceBreakdown(EventStall stall, long baseRateCents, int defaultProximityScore, double multiplier, List<com.bookfair.entity.MapInfluence> influences) {
        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("Base Rate", baseRateCents);

        int calculatedScore = defaultProximityScore * DEFAULT_PROXIMITY_MULTIPLIER;
        List<Map<String, Object>> drivers = new ArrayList<>();

        try {
            // These were used for coordinate normalization from pixels. 
            // In the new system, everything is already 0-100 percentage based.
            // We use 1000x1000 as the reference "normalized" pixel space if needed, 
            // but since both are percentages, they cancel out.
            
            Double sX = stall.getPosX() != null ? stall.getPosX() : stall.getStallTemplate().getPosX();
            Double sY = stall.getPosY() != null ? stall.getPosY() : stall.getStallTemplate().getPosY();
            Double sW = stall.getWidth() != null ? stall.getWidth() : stall.getStallTemplate().getWidth();
            Double sH = stall.getHeight() != null ? stall.getHeight() : stall.getStallTemplate().getHeight();

            if (sX != null && sY != null) {
                double stallCenterX = sX + (sW != null ? sW / 2 : 0);
                double stallCenterY = sY + (sH != null ? sH / 2 : 0);

                if (influences != null && !influences.isEmpty()) {
                    for (com.bookfair.entity.MapInfluence influence : influences) {
                        double infX = influence.getPosX();
                        double infY = influence.getPosY();
                        double radius = influence.getRadius();
                        int intensity = influence.getIntensity();
                        String typeStr = influence.getType().name();
                        String falloffStr = influence.getFalloff();

                        // Distance in 0-100 unit space
                        double dist = Math.sqrt(Math.pow(stallCenterX - infX, 2) + Math.pow(stallCenterY - infY, 2));

                        if (dist < radius) {
                            double factor = 1.0 - (dist / radius);
                            if ("EXPONENTIAL".equals(falloffStr)) factor = Math.pow(factor, 2);
                            
                            int contribution = (int) (intensity * factor);
                            if (contribution > 0) {
                                calculatedScore += contribution;
                                Map<String, Object> driver = new HashMap<>();
                                driver.put("label", typeStr + " Proximity");
                                driver.put("value", "+" + contribution);
                                drivers.add(driver);
                            }
                        }
                    }
                }
            }
            
            // Apply Edge Distance Penalty (stalls near any edge of the layout)
            if (sX != null && sY != null && sW != null && sH != null &&
                (sX <= 2 || sY <= 2 || sX + sW >= 98 || sY + sH >= 98)) {
                calculatedScore -= EDGE_DISTANCE_PENALTY;
                Map<String, Object> penalty = new HashMap<>();
                penalty.put("label", "Edge Distance");
                penalty.put("value", "-" + EDGE_DISTANCE_PENALTY);
                drivers.add(penalty);
            }

        } catch (Exception e) {
            log.error("Price calculation failed: {}", e.getMessage());
        }

        calculatedScore = Math.min(MAX_SCORE, Math.max(MIN_SCORE, calculatedScore));
        
        breakdown.put("Visibility Score", calculatedScore + "/100");
        breakdown.put("Value Drivers", drivers);
        breakdown.put("calculatedScore", calculatedScore);

        // Size-based pricing: scale relative to a reference stall area (8% × 8% = 64 sq%)
        double sizeFactor = 1.0;
        Double sW_final = stall.getWidth() != null ? stall.getWidth() : (stall.getStallTemplate() != null ? stall.getStallTemplate().getWidth() : null);
        Double sH_final = stall.getHeight() != null ? stall.getHeight() : (stall.getStallTemplate() != null ? stall.getStallTemplate().getHeight() : null);
        if (sW_final != null && sH_final != null && sW_final > 0 && sH_final > 0) {
            double area = sW_final * sH_final;
            double referenceArea = 64.0; // 8% × 8% standard stall
            sizeFactor = Math.max(0.5, Math.min(2.5, area / referenceArea)); // clamp 0.5x - 2.5x
            breakdown.put("Size Factor", String.format("%.2fx (area=%.1f sq%%)", sizeFactor, area));
        }

        double scoreFactor = 1.0 + (calculatedScore - 50) / 100.0;
        long finalPriceCents = (long) (baseRateCents * scoreFactor * sizeFactor * multiplier);
        breakdown.put("Final Price", finalPriceCents);

        return breakdown;
    }

    private void calculateAndApplyPrice(EventStall stall, List<com.bookfair.entity.MapInfluence> influences) {
        Map<String, Object> breakdown = calculatePriceBreakdown(stall, influences);
        int score = (int) breakdown.get("calculatedScore");
        long finalPrice = (long) breakdown.get("Final Price");
        
        long proximityBonus = finalPrice - stall.getBaseRateCents();
        
        stall.setProximityBonusCents(proximityBonus);
        stall.setFinalPriceCents(finalPrice);
        stall.setPricingVersion("AUTO_V2_NORM_" + score);
    }

    @Transactional
    public com.bookfair.dto.response.StallPriceResponse updateStallPrice(Long stallId, Map<String, Object> request) {
        EventStall stall = eventStallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("EventStall not found: " + stallId));

        if (request.containsKey("baseRateCents")) {
            long base = Long.parseLong(request.get("baseRateCents").toString());
            double multiplier = request.containsKey("multiplier")
                    ? Double.parseDouble(request.get("multiplier").toString())
                    : 1.0;
            if (base < 0) throw new com.bookfair.exception.BadRequestException("Price cannot be negative");
            stall.setFinalPriceCents((long) (base * multiplier));
            stall.setPricingVersion("MANUAL_PRICE_UPDATE");
        }
        eventStallRepository.save(stall);

        return com.bookfair.dto.response.StallPriceResponse.builder()
                .stallId(stallId)
                .finalPriceCents(stall.getFinalPriceCents())
                .build();
    }
}
