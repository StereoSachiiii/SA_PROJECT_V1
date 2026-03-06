package com.bookfair.service;

import com.bookfair.constant.ScoringConstants;
import com.bookfair.entity.EventStall;
import com.bookfair.entity.StallCategory;
import com.bookfair.entity.StallSize;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingEngineService {

    private final ObjectMapper objectMapper;

    /**
     * Calculates and updates the pricing fields of an EventStall based on its geometry
     * and the event's layout configuration (influences).
     */
    public EventStall calculateEventStallPricing(EventStall stall, String eventLayoutConfig) {
        if (stall == null) return null;

        // Baseline setup
        long baseRateCents = stall.getBaseRateCents() != null ? stall.getBaseRateCents() : 500000L;
        double multiplier = 1.0;
        long proximityBonusCents = 0L;

        // Proximity calculation based on layoutConfig
        if (eventLayoutConfig != null && !eventLayoutConfig.trim().isEmpty() && stall.getGeometry() != null) {
            try {
                JsonNode layoutNode = objectMapper.readTree(eventLayoutConfig);
                JsonNode geometryNode = objectMapper.readTree(stall.getGeometry());

                JsonNode influences = layoutNode.path("influences");
                if (influences.isArray() && influences.size() > 0) {
                    // Extract stall center point in percentage (0-100)
                    double stallX = geometryNode.path("x").asDouble(0) + (geometryNode.path("w").asDouble(0) / 2.0);
                    double stallY = geometryNode.path("y").asDouble(0) + (geometryNode.path("h").asDouble(0) / 2.0);

                    // Extract layout dimensions to normalize influences to percentage
                    double layoutW = layoutNode.path("width").asDouble(1000);
                    double layoutH = layoutNode.path("height").asDouble(600);

                    double maxInfluenceMultiplier = 0.0;

                    for (JsonNode inf : influences) {
                        String type = inf.path("type").asText("");
                        // High Traffic = ENTRANCE, TRAFFIC, FACILITY
                        if (!"ENTRANCE".equalsIgnoreCase(type) && !"TRAFFIC".equalsIgnoreCase(type) && !"FACILITY".equalsIgnoreCase(type) && !"STAGE".equalsIgnoreCase(type)) {
                            continue;
                        }

                        // Parse influence location and radius in pixels and convert to percentage
                        double infX = (inf.path("x").asDouble(0) / layoutW) * 100.0;
                        double infY = (inf.path("y").asDouble(0) / layoutH) * 100.0;
                        double infR = (inf.path("radius").asDouble(0) / layoutW) * 100.0;
                        double intensity = inf.path("intensity").asDouble(0); // 0-100
                        String falloff = inf.path("falloff").asText("linear");

                        // Calculate Euclidean distance in percentage
                        double distance = Math.sqrt(Math.pow(stallX - infX, 2) + Math.pow(stallY - infY, 2));

                        if (distance <= infR && infR > 0) {
                            // Hit inside the radius. Calculate proximity score.
                            double hitFactor = 0.0;
                            if ("exponential".equalsIgnoreCase(falloff)) {
                                hitFactor = Math.pow(1.0 - (distance / infR), 2);
                            } else {
                                hitFactor = 1.0 - (distance / infR);
                            }
                            
                            // Scale intensity (0-100) and hitFactor (0-1) to an added multiplier max 1.0 (for 100% intensity and center hit)
                            double score = (intensity / 100.0) * hitFactor;
                            
                            if (score > maxInfluenceMultiplier) {
                                maxInfluenceMultiplier = score;
                            }
                        }
                    }

                    // Add up to 1.0 to the multiplier (so max 2.0x base price) based on proximity
                    multiplier += maxInfluenceMultiplier;
                }
            } catch (JsonProcessingException e) {
                log.warn("Failed to parse layout configuration or geometry for pricing calculation: {}", e.getMessage());
            }
        }

        // Base rate multiplier based on size and category (only applied IF it hasn't somehow already been baked into the manual baseRateCents)
        if (stall.getStallTemplate() != null) {
            multiplier += getSizeMultiplier(stall.getStallTemplate().getSize());
            multiplier += getCategoryMultiplier(stall.getStallTemplate().getCategory());
        }

        // Ensure multiplier doesn't drop below 0.1 (e.g. for small non-profit far away)
        multiplier = Math.max(0.1, multiplier);

        // Calculate final price
        // Final Price = (Base Rate * Multiplier) + Flat Bonus
        long finalPriceCents = (long) (baseRateCents * multiplier) + proximityBonusCents;

        stall.setMultiplier(multiplier);
        stall.setProximityBonusCents(proximityBonusCents);
        stall.setFinalPriceCents(finalPriceCents);
        stall.setPricingVersion("DYNAMIC_V1");
        
        return stall;
    }

    private double getSizeMultiplier(StallSize size) {
        if (size == null) return 0.0;
        switch (size) {
            case LARGE: return 0.50; // +50%
            case MEDIUM: return 0.0; // Base
            case SMALL: return -0.20; // -20%
            default: return 0.0;
        }
    }

    private double getCategoryMultiplier(StallCategory category) {
        if (category == null) return 0.0;
        switch (category) {
            case SPONSOR: return 1.0; // +100%
            case FOOD: return 0.25;    // +25%
            case RETAIL: return 0.0;   // Base
            case ANCHOR: return -0.10; // Volume discount
            default: return 0.0;
        }
    }

    /**
     * Stateless price calculation from raw DTO inputs (no entity needed).
     * The frontend sends the stall's geometry, size, category, and the
     * current set of influences directly from the designer canvas.
     */
    public java.util.Map<String, Object> calculateFromRequest(com.bookfair.dto.request.PriceCalculateRequest req) {
        // 0. Derive size from actual geometry area — single source of truth
        StallSize derivedSize = deriveSizeFromGeometry(req.getGeometry());
        long baseRateCents = getBaseRateForSize(derivedSize);

        log.info("===== PRICE CALCULATION REQUEST =====");
        log.info("  Geometry: {}", req.getGeometry());
        log.info("  Derived size: {} (base={}), Category: {}", derivedSize, baseRateCents, req.getCategory());
        log.info("  Influences count: {}", req.getInfluences() != null ? req.getInfluences().size() : 0);

        double multiplier = 1.0;

        // 1. Proximity multiplier from influences
        double maxInfluenceMultiplier = 0.0;
        java.util.List<java.util.Map<String, Object>> drivers = new java.util.ArrayList<>();

        // Add size as a driver for transparency
        {
            java.util.Map<String, Object> sizeDriver = new java.util.HashMap<>();
            sizeDriver.put("label", "Size → " + derivedSize);
            sizeDriver.put("value", "LKR " + String.format("%,.0f", baseRateCents / 100.0) + " base");
            drivers.add(sizeDriver);
        }

        if (req.getGeometry() != null && req.getInfluences() != null && !req.getInfluences().isEmpty()) {
            try {
                com.fasterxml.jackson.databind.JsonNode geometryNode = objectMapper.readTree(req.getGeometry());
                double stallX = geometryNode.path("x").asDouble(0) + (geometryNode.path("w").asDouble(0) / 2.0);
                double stallY = geometryNode.path("y").asDouble(0) + (geometryNode.path("h").asDouble(0) / 2.0);
                log.info("  Stall center: ({}, {})", String.format("%.2f", stallX), String.format("%.2f", stallY));

                for (com.bookfair.dto.request.PriceCalculateRequest.InfluenceDto inf : req.getInfluences()) {
                    String type = inf.getType();
                    log.info("  Checking influence: type={}, pos=({}, {}), radius={}, intensity={}", 
                             type, String.format("%.2f", inf.getX()), String.format("%.2f", inf.getY()), 
                             String.format("%.2f", inf.getRadius()), inf.getIntensity());

                    if (!"ENTRANCE".equalsIgnoreCase(type) && !"TRAFFIC".equalsIgnoreCase(type)
                            && !"FACILITY".equalsIgnoreCase(type) && !"STAGE".equalsIgnoreCase(type)) {
                        log.info("    -> SKIPPED (type not eligible)");
                        continue;
                    }

                    double infX = inf.getX();
                    double infY = inf.getY();
                    double infR = inf.getRadius();
                    double intensity = inf.getIntensity();
                    String falloff = inf.getFalloff();

                    double distance = Math.sqrt(Math.pow(stallX - infX, 2) + Math.pow(stallY - infY, 2));
                    log.info("    -> distance={}, radius={}, inside={}", 
                             String.format("%.2f", distance), String.format("%.2f", infR), distance <= infR);

                    if (distance <= infR && infR > 0) {
                        double hitFactor = "exponential".equalsIgnoreCase(falloff)
                                ? Math.pow(1.0 - (distance / infR), 2)
                                : 1.0 - (distance / infR);
                        double score = (intensity / 100.0) * hitFactor;
                        log.info("    -> HIT! hitFactor={}, score={}", 
                                 String.format("%.4f", hitFactor), String.format("%.4f", score));
                        if (score > maxInfluenceMultiplier) {
                            maxInfluenceMultiplier = score;
                        }
                        if (score > 0) {
                            java.util.Map<String, Object> driver = new java.util.HashMap<>();
                            driver.put("label", type + " Proximity");
                            driver.put("value", String.format("+%.0f%%", score * 100));
                            drivers.add(driver);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to parse geometry for pricing: {}", e.getMessage());
            }
        }

        multiplier += maxInfluenceMultiplier;

        // 2. Category multiplier
        double catM = getCategoryMultiplier(req.getCategory());
        multiplier += catM;
        if (catM != 0) {
            java.util.Map<String, Object> d = new java.util.HashMap<>();
            d.put("label", "Category (" + req.getCategory() + ")");
            d.put("value", String.format("%+.0f%%", catM * 100));
            drivers.add(d);
        }

        multiplier = Math.max(0.1, multiplier);
        long finalPriceCents = (long) (baseRateCents * multiplier);

        log.info("===== RESULT: base={} * multiplier={} = final={} (LKR {}) =====", 
                 baseRateCents, String.format("%.2f", multiplier), finalPriceCents, 
                 String.format("%.2f", finalPriceCents / 100.0));

        java.util.Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("finalPriceCents", finalPriceCents);
        result.put("multiplier", Math.round(multiplier * 100.0) / 100.0);
        result.put("baseRateCents", baseRateCents);
        result.put("derivedSize", derivedSize.name());
        result.put("drivers", drivers);
        return result;
    }

    /**
     * Derives the stall size category from its actual drawn geometry.
     * Area = w * h (both in canvas percentage 0-100).
     * Thresholds: < 30 = SMALL, 30-100 = MEDIUM, >= 100 = LARGE
     */
    private StallSize deriveSizeFromGeometry(String geometryJson) {
        if (geometryJson == null || geometryJson.trim().isEmpty()) return StallSize.MEDIUM;
        try {
            com.fasterxml.jackson.databind.JsonNode g = objectMapper.readTree(geometryJson);
            double w = g.path("w").asDouble(0);
            double h = g.path("h").asDouble(0);
            double area = w * h; // percentage-squared units
            log.info("  Geometry area: {}% x {}% = {} sq%", String.format("%.1f", w), String.format("%.1f", h), String.format("%.1f", area));
            if (area < 30) return StallSize.SMALL;
            if (area < 100) return StallSize.MEDIUM;
            return StallSize.LARGE;
        } catch (Exception e) {
            log.warn("Could not parse geometry for size derivation: {}", e.getMessage());
            return StallSize.MEDIUM;
        }
    }

    /** Centralized base rate lookup — single source of truth */
    private long getBaseRateForSize(com.bookfair.entity.StallSize size) {
        if (size == null) return com.bookfair.constant.PricingConstants.STALL_MEDIUM_PRICE;
        switch (size) {
            case SMALL:  return com.bookfair.constant.PricingConstants.STALL_SMALL_PRICE;
            case MEDIUM: return com.bookfair.constant.PricingConstants.STALL_MEDIUM_PRICE;
            case LARGE:  return com.bookfair.constant.PricingConstants.STALL_LARGE_PRICE;
            default:     return com.bookfair.constant.PricingConstants.STALL_MEDIUM_PRICE;
        }
    }
}
