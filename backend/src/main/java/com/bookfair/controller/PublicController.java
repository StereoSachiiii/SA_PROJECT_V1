package com.bookfair.controller;

import com.bookfair.dto.response.EventResponse;
import com.bookfair.dto.response.StallResponse;
import com.bookfair.dto.response.VenueResponse;
import com.bookfair.entity.Venue;
import com.bookfair.service.EventService;
import com.bookfair.service.StallService;
import com.bookfair.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class PublicController {

    private final VenueRepository venueRepository;
    private final com.bookfair.repository.HallRepository hallRepository;
    private final com.bookfair.repository.MapZoneRepository mapZoneRepository;
    private final com.bookfair.repository.MapInfluenceRepository mapInfluenceRepository;
    private final EventService eventService;
    private final StallService stallService;

    @GetMapping("/venues")
    public ResponseEntity<org.springframework.data.domain.Page<VenueResponse>> getVenues() {
        List<VenueResponse> content = venueRepository.findAll().stream()
                .map(this::mapToVenueResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new org.springframework.data.domain.PageImpl<>(content));
    }

    @GetMapping("/halls/genres")
    public ResponseEntity<List<String>> getHallGenres() {
        return ResponseEntity.ok(hallRepository.findDistinctMainCategories().stream()
                .map(Enum::name)
                .collect(Collectors.toList()));
    }

    @GetMapping("/events/active")
    public ResponseEntity<org.springframework.data.domain.Page<EventResponse>> getActiveEvents() {
        List<EventResponse> content = eventService.getActiveEvents().stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new org.springframework.data.domain.PageImpl<>(content));
    }

    @GetMapping("/events/search")
    public ResponseEntity<org.springframework.data.domain.Page<EventResponse>> searchEvents(
            @RequestParam(defaultValue = "") String q) {
        List<EventResponse> content = eventService.getActiveEvents().stream()
                .filter(e -> e.getName().toLowerCase().contains(q.toLowerCase()) || 
                            (e.getDescription() != null && e.getDescription().toLowerCase().contains(q.toLowerCase())))
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new org.springframework.data.domain.PageImpl<>(content));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(mapToEventResponse(eventService.getEventById(id)));
    }

    @GetMapping("/events/{id}/map")
    public ResponseEntity<com.bookfair.dto.response.EventMapResponse> getEventMap(@PathVariable Long id) {
        // API.md 4.3 Format: { eventId, eventName, stalls: [...], layout: { ... } }
        com.bookfair.entity.Event event = eventService.getEventById(id);
        List<StallResponse> stalls = stallService.getByEventId(id);
        
        // Aggregate Hall Metadata and Layout Constraints
        java.util.Map<Long, Map<String, Object>> hallMetadata = new java.util.HashMap<>();
        if (!stalls.isEmpty()) {
            event.getStalls().stream()
                .map(es -> es.getStallTemplate().getHall())
                .filter(java.util.Objects::nonNull)
                .distinct()
                .forEach(hall -> {
                    Map<String, Object> meta = new java.util.HashMap<>();
                    meta.put("id", hall.getId());
                    meta.put("name", hall.getName());
                    meta.put("hallName", hall.getName());
                    meta.put("capacity", hall.getCapacity());
                    meta.put("isAc", hall.getIsAirConditioned());
                    meta.put("tier", hall.getTier());
                    meta.put("floor", hall.getFloorLevel());
                    meta.put("sqFt", hall.getTotalSqFt());
                    meta.put("category", hall.getMainCategory());
                    
                    // Add constraints for the hall
                    List<com.bookfair.dto.response.PhysicalConstraintResponse> constraints = hall.getConstraints().stream()
                            .map(c -> com.bookfair.dto.response.PhysicalConstraintResponse.builder()
                                    .id(c.getId())
                                    .type(c.getType())
                                    .posX(c.getPosX())
                                    .posY(c.getPosY())
                                    .width(c.getWidth())
                                    .height(c.getHeight())
                                    .label(c.getLabel())
                                    .build()).collect(Collectors.toList());
                    meta.put("constraints", constraints);

                    hallMetadata.put(hall.getId(), meta);
                });
        }

        List<com.bookfair.dto.response.MapZoneResponse> zoneDTOs = mapZoneRepository.findByEvent_Id(id).stream()
                .map(z -> com.bookfair.dto.response.MapZoneResponse.builder()
                        .id(z.getId())
                        .hallName(z.getHallName())
                        .type(z.getType().name())
                        .posX(z.getPosX())
                        .posY(z.getPosY())
                        .width(z.getWidth())
                        .height(z.getHeight())
                        .label(z.getLabel())
                        .build())
                .collect(Collectors.toList());

        List<com.bookfair.dto.response.MapInfluenceResponse> influenceDTOs = mapInfluenceRepository.findByEvent_Id(id).stream()
                .map(i -> com.bookfair.dto.response.MapInfluenceResponse.builder()
                        .id(i.getId().toString())
                        .hallName(i.getHallName())
                        .type(i.getType().name())
                        .posX(i.getPosX())
                        .posY(i.getPosY())
                        .radius(i.getRadius())
                        .intensity(i.getIntensity())
                        .falloff(i.getFalloff())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok()
                .cacheControl(org.springframework.http.CacheControl.maxAge(5, java.util.concurrent.TimeUnit.MINUTES))
                .body(com.bookfair.dto.response.EventMapResponse.builder()
                .eventId(id)
                .eventName(event.getName())
                .stalls(stalls)
                .mapUrl(event.getMapUrl())
                .mapWidth(event.getMapWidth())
                .mapHeight(event.getMapHeight())
                .halls(new java.util.ArrayList<>(hallMetadata.values()))
                .zones(zoneDTOs)
                .influences(influenceDTOs)
                .build());
    }

    private VenueResponse mapToVenueResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .buildings(venue.getBuildings().stream().map(b -> 
                    VenueResponse.BuildingResponse.builder()
                        .id(b.getId())
                        .name(b.getName())
                        .gps(b.getGpsLocation())
                        .halls(b.getHalls().stream().map(h -> 
                            VenueResponse.HallResponse.builder()
                                .id(h.getId())
                                .name(h.getName())
                                .category(h.getMainCategory() != null ? h.getMainCategory().name() : null)
                                .build()
                        ).collect(Collectors.toList()))
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }

    private EventResponse mapToEventResponse(com.bookfair.entity.Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .location(event.getLocation())
                .venueId(event.getVenue() != null ? event.getVenue().getId() : null)
                .status(event.getStatus().name())
                .mapUrl(event.getMapUrl())
                .mapWidth(event.getMapWidth())
                .mapHeight(event.getMapHeight())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
