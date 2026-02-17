package com.bookfair.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {
    @NotNull(message = "User ID is required to make a reservation")
    private Long userId;
    
    @NotEmpty(message = "At least one stall must be selected for reservation")
    private List<Long> stallIds;
}
