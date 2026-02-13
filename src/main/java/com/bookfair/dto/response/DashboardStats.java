package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private long totalStalls;
    private long reservedStalls;
    private long availableStalls;
    private long totalUsers;
    private long totalReservations;
}
