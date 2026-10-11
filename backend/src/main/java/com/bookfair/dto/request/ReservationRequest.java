package com.bookfair.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating/updating a stall reservation.
 * Strictly adheres to OWASP guidelines — username is NEVER accepted in request body.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {

    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Reservation date is required")
    @FutureOrPresent(message = "Reservation date must be today or in the future")
    private LocalDate reservationDate;

    @NotNull(message = "Stall type is required")
    private StallType stallType;

    @NotNull(message = "Stall size is required")
    private StallSize stallSize;

    @NotNull(message = "Stall count is required")
    @Min(value = 1, message = "Stall count must be at least 1")
    private Integer stallCount;

    @NotBlank(message = "Business category is required")
    private String businessCategory;

    @Size(max = 500, message = "Special comments cannot exceed 500 characters")
    private String specialComments;

    private List<Long> stallIds;

    private Long eventId;

    /** Sanitizes special comments to strip HTML/script tags. */
    public void setSpecialComments(String comments) {
        if (comments != null) {
            this.specialComments = comments.replaceAll("<[^>]*>", "").trim();
        } else {
            this.specialComments = null;
        }
    }

    public enum StallType {
        STANDARD,
        PREMIUM,
        CORNER
    }

    public enum StallSize {
        SMALL,
        MEDIUM,
        LARGE
    }
}
