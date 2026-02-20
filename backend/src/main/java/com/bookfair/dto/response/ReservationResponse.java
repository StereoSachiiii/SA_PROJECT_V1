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
    private java.util.List<String> stalls; // Keeping for backward compatibility
    private StallSummary stallDetails; // New enriched stall object
    private Long totalPriceCents;
    private Long ttlSeconds;
    private LocalDateTime expiresAt;
    private EventSummary event;

    public Long getReservationId() {
        return id;
    }

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
        private java.util.List<String> categories;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StallSummary {
        private Long id;
        private String name;
        private String size;
        private Long finalPriceCents;
        private Long baseRateCents;
        private Double multiplier;
        private String hallName;
        private String hallTier;
        private Integer floorLevel;
        private String buildingName;
        private Boolean reserved;
        private String geometry;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventSummary {
        private Long id;
        private String name;
        private String venueName;
    }
}
