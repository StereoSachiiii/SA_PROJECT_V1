package com.bookfair.dto.response;

import com.bookfair.entity.Event;
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
    private String layoutConfig;
    private LocalDateTime createdAt;
}
