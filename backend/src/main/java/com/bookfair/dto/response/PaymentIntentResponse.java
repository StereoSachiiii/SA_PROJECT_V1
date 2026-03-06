package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentIntentResponse {
    private String clientSecret;
}
