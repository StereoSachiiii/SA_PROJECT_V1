package com.bookfair.dto;

import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {
    private Long publisherId;
    private List<Long> stallIds;
}
