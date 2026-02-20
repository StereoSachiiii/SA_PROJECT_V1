package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for stall data sent to the frontend.
 *
 * The `reserved` field is computed from the reservations table (not stored on the entity).
 * Grid fields (positionX, positionY, colSpan, rowSpan) are used for CSS Grid rendering.
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
    private Integer width;
    private Integer height;
    private Integer positionX;
    private Integer positionY;
    private Integer colSpan;
    private Integer rowSpan;
    private Boolean reserved;      // computed from reservations table
    private String occupiedBy;     // publisher business name
    private String publisherCategory; // For map color-coding
    private String geometry; // JSON: {x, y, w, h}
    private java.util.Map<String, Object> pricingBreakdown;

    public String getTemplateName() {
        return name;
    }
    
    private String templateName; // Added for explicit matching
}
