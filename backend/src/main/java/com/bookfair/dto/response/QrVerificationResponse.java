package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Typed DTO for QR code verification responses.
 * Replaces the ad-hoc Map<String, Object> that was used before.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrVerificationResponse {
    private boolean valid;
    private String message;
    private Long reservationId;
    private String stallName;
    private String businessName;
    private String status;
}
