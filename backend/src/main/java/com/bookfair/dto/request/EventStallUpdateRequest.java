package com.bookfair.dto.request;

import lombok.Data;

@Data
public class EventStallUpdateRequest {
    private Long id; // EventStall ID
    private String geometry; // Updated geometry JSON
    private Long finalPriceCents; // Optional override
}
