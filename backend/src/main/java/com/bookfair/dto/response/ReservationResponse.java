package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for reservation data sent to the frontend.
 *
 * Uses nested UserSummary and StallSummary so the frontend can access
 * res.user.businessName and res.stall.name directly — matching the
 * TypeScript Reservation type.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String qrCode;
    private String status;
    private Boolean emailSent;
    private LocalDateTime createdAt;
    private UserSummary user;
    private StallSummary stall;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String username;
        private String email;
        private String businessName;
        private String contactNumber;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StallSummary {
        private Long id;
        private String name;
        private String size;
        private Boolean reserved;
        private Integer positionX;
        private Integer positionY;
    }
}
