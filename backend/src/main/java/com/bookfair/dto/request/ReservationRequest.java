package com.bookfair.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "At least one stall must be selected")
    private List<Long> stallIds;

    private Long eventId;
}
