package com.bookfair.dto.request;

import lombok.Data;

@Data
public class EventStallUpdateRequest {
    private Long id; // EventStall ID
    private String name; // Template Name
    private String hallName; // Hall Name (to link to hall)
    private Double posX;
    private Double posY;
    private Double width;
    private Double height;
    private Long finalPriceCents; // Optional override
}
