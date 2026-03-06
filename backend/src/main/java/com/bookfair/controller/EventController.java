package com.bookfair.controller;

import com.bookfair.dto.request.EventRequest;
import com.bookfair.dto.response.EventResponse;
import com.bookfair.entity.Event;
import com.bookfair.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController

@RequestMapping("/api/v1/admin/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToResponse(eventService.getEventById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .location(request.getLocation())
                .status(parseEventStatus(request.getStatus()))
                .build();
        
        return ResponseEntity.ok(mapToResponse(eventService.createEvent(event)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        Event updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> changeEventStatus(
            @PathVariable Long id,
            @RequestParam Event.EventStatus status) {
        Event updated = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.bookfair.dto.response.GenericActionResponse> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new com.bookfair.dto.response.GenericActionResponse(true, "Event deleted"));
    }

    private EventResponse mapToResponse(Event event) {
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
                .mapUrl(event.getMapUrl())
                .mapWidth(event.getMapWidth())
                .mapHeight(event.getMapHeight())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }

    private Event.EventStatus parseEventStatus(String status) {
        if (status == null || status.isBlank()) return Event.EventStatus.UPCOMING;
        try {
            return Event.EventStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Legacy value like DRAFT - default to UPCOMING
            return Event.EventStatus.UPCOMING;
        }
    }
}
