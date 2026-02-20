package com.bookfair.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StallPriceUpdateRequest {
    @NotNull(message = "Base rate is required")
    private Long baseRateCents;
    
    private Double multiplier = 1.0;
}
