package com.bookfair.controller;

import com.bookfair.entity.EventStall;
import com.bookfair.mapper.AdminMapper;
import com.bookfair.service.DigitalLayoutService;
import com.bookfair.service.EventService;
import com.bookfair.service.PricingService;
import com.bookfair.dto.request.CalculatePriceRequest;
import com.bookfair.dto.request.EventStallUpdateRequest;
import com.bookfair.dto.request.PhysicalConstraintRequest;
import com.bookfair.dto.response.EventStallAdminResponse;
import com.bookfair.dto.response.MapInfluenceResponse;
import com.bookfair.dto.response.MapZoneResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDesignerController {

    private final DigitalLayoutService digitalLayoutService;
    private final EventService eventService;
    private final PricingService pricingService;
    private final AdminMapper adminMapper;

    @PutMapping("/halls/{id}/layout")
    public ResponseEntity<Void> updateHallLayout(@PathVariable Long id, @RequestBody List<PhysicalConstraintRequest> constraints) {
        digitalLayoutService.updateHallLayout(id, constraints);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/events/{id}/map")
    public ResponseEntity<String> uploadMap(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(digitalLayoutService.uploadVenueMap(id, file));
    }

    @PostMapping("/events/{id}/layout")
    public ResponseEntity<List<EventStallAdminResponse>> saveLayout(@PathVariable Long id, @RequestBody List<EventStallUpdateRequest> stalls) {
        return ResponseEntity.ok(digitalLayoutService.saveEventLayout(id, stalls).stream()
                .map(adminMapper::mapToEventStallAdminResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/events/{id}/zones")
    public ResponseEntity<Void> saveZones(@PathVariable Long id, @RequestBody List<MapZoneResponse> zones) {
        digitalLayoutService.saveMapZones(id, zones);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/events/{id}/influences")
    public ResponseEntity<Void> saveInfluences(@PathVariable Long id, @RequestBody List<MapInfluenceResponse> influences) {
        digitalLayoutService.saveMapInfluences(id, influences);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/{id}/stalls")
    public ResponseEntity<List<EventStallAdminResponse>> getEventStalls(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventStalls(id).stream()
                .map(adminMapper::mapToEventStallAdminResponse).collect(Collectors.toList()));
    }

    @PostMapping("/events/{id}/calculate-price-interactive")
    public ResponseEntity<Map<String, Object>> calculatePriceInteractive(
            @PathVariable Long id,
            @RequestBody CalculatePriceRequest request) {
        Map<String, Object> breakdown = pricingService.calculatePriceInteractive(
                id,
                request.getGeometry(),
                request.getBaseRateCents(),
                request.getDefaultProximityScore()
        );
        return ResponseEntity.ok(breakdown);
    }
}
