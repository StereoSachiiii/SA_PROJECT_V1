package com.bookfair.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RefundRequest {
    @NotNull(message = "Reservation ID is required")
    private Long reservationId;
    
    @NotBlank(message = "Reason is required")
    private String reason;
}
