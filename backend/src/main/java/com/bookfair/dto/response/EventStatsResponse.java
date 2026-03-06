package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventStatsResponse {
    private Long eventId;
    private long totalStalls;
    private long reservedStalls;
    private long availableStalls;
    private long blockedStalls;
    private double fillRate;
    private long projectedRevenueCents;
}
