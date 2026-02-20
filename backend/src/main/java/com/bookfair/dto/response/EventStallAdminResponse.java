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
    private String geometry;
    private String pricingVersion;
}
