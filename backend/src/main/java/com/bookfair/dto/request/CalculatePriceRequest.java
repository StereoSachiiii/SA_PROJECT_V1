package com.bookfair.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculatePriceRequest {
    private String geometry;
    private Long baseRateCents;
    private Integer defaultProximityScore;
    private Double mapWidth;
    private Double mapHeight;
}
