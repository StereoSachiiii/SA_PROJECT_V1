package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for stall data sent to the frontend.
 *
 * The `reserved` field is computed from the reservations table (not stored on the entity).
 * Spatial fields (posX, posY, width, height) are used for canvas-based rendering.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StallResponse {
    private Long id;
    private String name;
    private String size;
    private String type;
    private Long priceCents;
    private Integer proximityScore;
    private String hallName;
    private String hallCategory;
    private Boolean reserved;      // computed from reservations table
    private String occupiedBy;     // publisher business name
    private String publisherCategory; // For map color-coding
    private Double posX;
    private Double posY;
    private Double width;
    private Double height;
    private java.util.Map<String, Object> pricingBreakdown;
    private String templateName;
}
