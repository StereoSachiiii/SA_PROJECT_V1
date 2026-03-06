package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StallPriceResponse {
    private Long stallId;
    private Long finalPriceCents;
}
