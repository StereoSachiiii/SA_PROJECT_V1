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
    private final EventService eventService;
    private final StallService stallService;

    @GetMapping("/venues")
    public ResponseEntity<org.springframework.data.domain.Page<VenueResponse>> getVenues() {
        List<VenueResponse> content = venueRepository.findAll().stream()
                .map(this::mapToVenueResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new org.springframework.data.domain.PageImpl<>(content));
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
    public ResponseEntity<Object> getEventMap(@PathVariable Long id) {
        // API.md 4.3 Format: { eventId, eventName, stalls: [...], layout: { ... } }
        com.bookfair.entity.Event event = eventService.getEventById(id);
        List<StallResponse> stalls = stallService.getByEventId(id);
        
        Object layout = new java.util.HashMap<>();
        if (!stalls.isEmpty()) {
            var firstStallMatch = event.getStalls().stream().findFirst();
            if (firstStallMatch.isPresent() && firstStallMatch.get().getStallTemplate() != null) {
                com.bookfair.entity.Hall hall = firstStallMatch.get().getStallTemplate().getHall();
                if (hall != null && hall.getStaticLayout() != null) {
                    try {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        layout = mapper.readTree(hall.getStaticLayout());
                    } catch (Exception e) {
                        log.error("Mapping layout failed: {}", e.getMessage());
                    }
                }
            }
        }

        // Aggregate Hall Metadata
        java.util.Map<Long, Map<String, Object>> hallMetadata = new java.util.HashMap<>();
        if (!stalls.isEmpty()) {
            event.getStalls().stream()
                .map(es -> es.getStallTemplate().getHall())
                .filter(java.util.Objects::nonNull)
                .distinct()
                .forEach(hall -> {
                    Map<String, Object> meta = new java.util.HashMap<>();
                    meta.put("id", hall.getId());
                    meta.put("name", hall.getName()); // Keep this as the key for frontend lookup if using name
                    meta.put("hallName", hall.getName());
                    meta.put("capacity", hall.getCapacity());
                    meta.put("isAc", hall.getIsAirConditioned());
                    meta.put("tier", hall.getTier());
                    meta.put("floor", hall.getFloorLevel());
                    meta.put("sqFt", hall.getTotalSqFt());
                    meta.put("category", hall.getMainCategory());
                    meta.put("mainCategory", hall.getMainCategory()); // sending both just in case
                    hallMetadata.put(hall.getId(), meta);
                });
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("eventId", id);
        response.put("eventName", event.getName());
        response.put("stalls", stalls);
        response.put("layout", layout);
        response.put("halls", hallMetadata.values()); // Return list of hall objects
        response.put("zones", event.getLayoutConfig());
        
        return ResponseEntity.ok(response);
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
                        .gps(b.getGpsCoordinates())
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
                .venueName(event.getVenue() != null ? event.getVenue().getName() : null)
                .status(event.getStatus().name())
                .layoutConfig(event.getLayoutConfig())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
