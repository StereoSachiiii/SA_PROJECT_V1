package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private Long venueId;
    private String venueName;
    private String status;
    private String mapUrl;
    private Double mapWidth;
    private Double mapHeight;
    private LocalDateTime createdAt;
}
