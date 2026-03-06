package com.bookfair.dto.request;

import com.bookfair.entity.PhysicalConstraintType;
import lombok.Data;

@Data
public class PhysicalConstraintRequest {
    private Long id;
    private PhysicalConstraintType type;
    private Double posX;
    private Double posY;
    private Double width;
    private Double height;
    private String label;
}
