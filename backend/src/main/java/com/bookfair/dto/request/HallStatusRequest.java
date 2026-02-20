package com.bookfair.dto.request;

import com.bookfair.entity.HallStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HallStatusRequest {
    @NotNull(message = "Status is required")
    private HallStatus status;
}
