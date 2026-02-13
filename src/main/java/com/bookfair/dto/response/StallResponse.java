package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StallResponse {
    private Long id;
    private String name;
    private String size;
    private Integer priceCents;
    private Double widthMeters;
    private Double heightMeters;
    private Integer positionX;
    private Integer positionY;
    private Boolean reserved;
    private String occupiedBy;  // publisher business name, null if available
}
