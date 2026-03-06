package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventStallAdminResponse {
    private Long id;
    private String stallName;
    private String status;
    private Long baseRateCents;
    private Long finalPriceCents;
    private Double posX;
    private Double posY;
    private Double width;
    private Double height;
    private String pricingVersion;
}
