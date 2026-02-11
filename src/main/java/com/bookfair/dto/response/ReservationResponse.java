package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String qrCode;
    private String status;
    private LocalDateTime createdAt;

    // Flattened publisher info
    private Long publisherId;
    private String businessName;

    // Flattened stall info
    private Long stallId;
    private String stallName;
    private String stallSize;
    private Integer priceCents;
}
