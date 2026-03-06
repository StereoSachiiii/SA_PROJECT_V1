package com.bookfair.dto.request;

import lombok.Data;

@Data
public class ForceCheckInRequest {
    private Long reservationId;
    private String reason;
    private String adminOverrideCode;
}
