package com.bookfair.dto.request;

import com.bookfair.entity.StallCategory;
import com.bookfair.entity.StallSize;
import lombok.Data;

import java.util.List;

@Data
public class PriceCalculateRequest {
    private String geometry;        // JSON: {"x":10,"y":20,"w":5,"h":5}
    private StallSize size;
    private StallCategory category;
    private Long baseRateCents;     // Admin-entered base price

    private List<InfluenceDto> influences;

    @Data
    public static class InfluenceDto {
        private String type;        // ENTRANCE, TRAFFIC, FACILITY, STAGE, NOISE
        private double x;           // percentage 0-100
        private double y;           // percentage 0-100
        private double radius;      // percentage 0-100
        private double intensity;   // 0-100
        private String falloff;     // linear or exponential
    }
}
