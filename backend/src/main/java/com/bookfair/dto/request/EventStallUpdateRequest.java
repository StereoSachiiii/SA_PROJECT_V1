package com.bookfair.dto.request;

import lombok.Data;

@Data
public class EventStallUpdateRequest {
    private Long id; // EventStall ID
    private String name; // Template Name
    private String hallName; // Hall Name (to link to hall)
    private String geometry; // Updated geometry JSON
    private Long finalPriceCents; // Optional override
}
