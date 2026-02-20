package com.bookfair.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BulkPriceAdjustRequest {
    @NotNull(message = "Percentage is required")
    private Double percentage;
}
