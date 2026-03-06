package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentConfirmationResponse {
    private boolean success;
    private Long reservationId;
}
