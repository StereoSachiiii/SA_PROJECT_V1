package com.bookfair.dto.response;

import com.bookfair.entity.PhysicalConstraintType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PhysicalConstraintResponse {
    private Long id;
    private PhysicalConstraintType type;
    private Double posX;
    private Double posY;
    private Double width;
    private Double height;
    private String label;
}
