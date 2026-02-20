package com.bookfair.dto.response;

import com.bookfair.entity.StallCategory;
import com.bookfair.entity.StallSize;
import com.bookfair.entity.StallType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StallTemplateResponse {
    private Long id;
    private String name;
    private String hallName;
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
