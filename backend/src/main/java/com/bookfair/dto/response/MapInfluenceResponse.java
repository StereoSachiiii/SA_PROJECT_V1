package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MapInfluenceResponse {
    private String id;
    private String hallName;
    private String type;
    private Double posX;
    private Double posY;
    private Double radius;
    private Integer intensity;
    private String falloff;
}
