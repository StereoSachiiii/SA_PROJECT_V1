package com.bookfair.service;

import com.bookfair.entity.Event;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final com.bookfair.repository.EventStallRepository eventStallRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getActiveEvents() {
        log.info(">>> Fetching active events (OPEN, UPCOMING)...");
        List<Event> results = eventRepository.findAllByStatusIn(java.util.List.of(Event.EventStatus.OPEN, Event.EventStatus.UPCOMING));
        log.info(">>> Found " + results.size() + " active events.");
        return results;
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(Long id, com.bookfair.dto.request.EventRequest request) {
        Event event = getEventById(id);
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setImageUrl(request.getImageUrl());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setLocation(request.getLocation());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                event.setStatus(Event.EventStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Unknown status string (e.g. DRAFT) — keep current status
            }
        }
        if (request.getMapUrl() != null) event.setMapUrl(request.getMapUrl());
        if (request.getMapWidth() != null) event.setMapWidth(request.getMapWidth());
        if (request.getMapHeight() != null) event.setMapHeight(request.getMapHeight());
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEventStatus(Long id, Event.EventStatus status) {
        Event event = getEventById(id);
        Event.EventStatus currentStatus = event.getStatus();

        // Enforcement: Cannot move to a status that breaks logical sequence
        // UPCOMING -> OPEN -> CLOSED -> COMPLETED/ARCHIVED
        if (currentStatus == Event.EventStatus.COMPLETED || currentStatus == Event.EventStatus.CANCELLED || currentStatus == Event.EventStatus.ARCHIVED) {
            throw new IllegalStateException("Cannot change status of a finished, cancelled, or archived event.");
        }

        if (status == Event.EventStatus.OPEN) {
            // Simplified rule: Only one event at a given location/venue can be OPEN for bookings.
            // This prevents overlapping booking periods for the same physical space.
            List<Event> currentOpen = eventRepository.findAllByStatus(Event.EventStatus.OPEN);
            for (Event e : currentOpen) {
                if (!e.getId().equals(id) && e.getLocation().equalsIgnoreCase(event.getLocation())) {
                    e.setStatus(Event.EventStatus.CLOSED);
                    eventRepository.save(e);
                }
            }
        }
        
        event.setStatus(status);
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<com.bookfair.entity.EventStall> getEventStalls(Long eventId) {
        return eventStallRepository.findByEvent_Id(eventId);
    }

    @Transactional(readOnly = true)
    public com.bookfair.dto.response.EventStatsResponse getEventStats(Long eventId) {
        List<com.bookfair.entity.EventStall> stalls = eventStallRepository.findByEvent_Id(eventId);
        long total    = stalls.size();
        long reserved = stalls.stream().filter(s -> s.getStatus() == com.bookfair.entity.EventStallStatus.RESERVED).count();
        long available = stalls.stream().filter(s -> s.getStatus() == com.bookfair.entity.EventStallStatus.AVAILABLE).count();
        long blocked  = stalls.stream().filter(s -> s.getStatus() == com.bookfair.entity.EventStallStatus.BLOCKED).count();
        long revenueReserved = stalls.stream()
                .filter(s -> s.getStatus() == com.bookfair.entity.EventStallStatus.RESERVED)
                .mapToLong(s -> s.getFinalPriceCents() != null ? s.getFinalPriceCents() : 0).sum();

        return com.bookfair.dto.response.EventStatsResponse.builder()
            .eventId(eventId)
            .totalStalls(total)
            .reservedStalls(reserved)
            .availableStalls(available)
            .blockedStalls(blocked)
            .fillRate(total > 0 ? (double) reserved / total * 100.0 : 0.0)
            .projectedRevenueCents(revenueReserved)
            .build();
    }
}
