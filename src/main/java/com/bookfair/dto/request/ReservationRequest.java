package com.bookfair.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {
    private Long userId;
    private List<Long> stallIds;
}
