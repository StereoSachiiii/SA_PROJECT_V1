package com.bookfair.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Collection;

@Data
@Builder
public class EventMapResponse {
    private Long eventId;
    private String eventName;
    private List<StallResponse> stalls;
    private String mapUrl;
    private Double mapWidth;
    private Double mapHeight;
    private Object layout;
    private Collection<Object> halls;
    private List<MapZoneResponse> zones;
    private List<MapInfluenceResponse> influences;
}
