package com.bookfair.dto.request;

import com.bookfair.entity.StallCategory;
import com.bookfair.entity.StallSize;
import com.bookfair.entity.StallType;
import lombok.Data;

@Data
public class StallTemplateUpdateRequest {
    private String name;
    private StallSize size;
    private StallType type;
    private StallCategory category;
    private Long basePriceCents;
    private Double sqFt;
    private Boolean isAvailable;
    private Integer defaultProximityScore;
    private String geometry;
    private String imageUrl;
}
