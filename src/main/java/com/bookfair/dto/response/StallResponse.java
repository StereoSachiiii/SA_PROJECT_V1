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
<<<<<<< HEAD
    private Integer priceCents;
    private Integer width;
    private Integer height;
    private Integer positionX;
    private Integer positionY;
    private Integer colSpan;
    private Integer rowSpan;
    private Boolean reserved;      // computed from reservations table, not stored
    private String occupiedBy;     // publisher business name, null if available
=======
    private Integer positionX;
    private Integer positionY;
    private Boolean reserved; 
>>>>>>> origin/backend-feature-nihadh
}
