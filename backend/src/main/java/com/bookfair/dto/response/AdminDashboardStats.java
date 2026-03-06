package com.bookfair.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    @JsonProperty("totalReservations")
    private long totalReservations;
    
    @JsonProperty("totalRevenueLkr")
    private long totalRevenueLkr;
    
    @JsonProperty("activeVendors")
    private double activeVendors;
    
    @JsonProperty("fillRate")
    private double fillRate;
}
