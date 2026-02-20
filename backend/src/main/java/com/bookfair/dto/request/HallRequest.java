package com.bookfair.dto.request;

import com.bookfair.entity.HallStatus;
import com.bookfair.entity.PublisherCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HallRequest {
    @NotBlank(message = "Hall name is required")
    private String name;

    // Building ID is optional for updates, required for creation (validated in service)
    private Long buildingId;

    @Min(value = 1, message = "Total SqFt must be positive")
    private Integer totalSqFt;

    @Min(value = 1, message = "Capacity must be positive")
    private Integer capacity;

    private String tier;
    private Integer floorLevel;
    private HallStatus status;
    private PublisherCategory mainCategory;

    // Metadata
    private Double ceilingHeight;
    private Boolean isIndoor;
    private Boolean isAirConditioned;
    private Integer expectedFootfall;
    private String noiseLevel;
    private String nearbyFacilities;
    private Double distanceFromEntrance;
    private Double distanceFromParking;
    private Boolean isGroundFloor;
    
    // Layout JSON
    private String staticLayout;
}
