
package com.bookfair.dto.request;

import com.bookfair.entity.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.bookfair.entity.User.Role;

import java.time.LocalDateTime;

@Data
public class CheckInRequest {
    @NotBlank(message = "Event name is required")
    private Long reservationId;

//Later use an Enum for check-in reasons, but for now just a string
    @NotNull(message = "Check-in reason is required")
    private String CHECKED_IN;

    @NotNull(message = "Start date is required")
    private Role vendor ;

    @NotNull(message = "End date is required")
    private LocalDateTime timestamp;

}
