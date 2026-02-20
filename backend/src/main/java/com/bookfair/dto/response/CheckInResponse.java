package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CheckInResponse {
    private Long reservationId;
    private String status;
    private String vendor;
    private LocalDateTime timestamp;
}
