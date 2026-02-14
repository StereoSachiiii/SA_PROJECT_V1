package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor 
@Builder
public class DashboardStats {
    private long totalStalls;
    private long reservedStalls;
    private long availableStalls;
    private long totalUsers;
    private long totalReservations;
}
