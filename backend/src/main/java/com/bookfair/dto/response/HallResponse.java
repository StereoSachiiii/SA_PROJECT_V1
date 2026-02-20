package com.bookfair.dto.response;

import com.bookfair.entity.HallStatus;
import com.bookfair.entity.PublisherCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HallResponse {
    private Long id;
    private String name;
    private String venueName;
    private Integer totalSqFt;
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
    
    // Layout DO NOT INCLUDE JSON IN LIST VIEW USUALLY, BUT FOR ADMIN TABLE IT MIGHT BE OKAY. 
    // IGNORING LAYOUT STRING FOR NOW TO KEEP IT LIGHT.
}
