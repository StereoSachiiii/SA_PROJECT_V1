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
    private LocalDateTime createdAt;

    private Long publisherId;
    private String businessName;

    private Long stallId;
    private String stallName;
    private String stallSize;

    // @Data
    // @NoArgsConstructor
    // @AllArgsConstructor
    // public static class ReservedStallInfo {
    //     private Long stallId;
    //     private String stallName; 
    //     private String stallSize;
    // }
}
