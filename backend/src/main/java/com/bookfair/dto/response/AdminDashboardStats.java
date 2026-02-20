package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStats {
    private long totalReservations;
    private long totalRevenueLkr;
    private double  activeVendors;
    private double fillRate;
}
