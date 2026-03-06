package com.bookfair.controller;

import com.bookfair.entity.Hall;
import com.bookfair.entity.HallTier;
import com.bookfair.entity.NoiseLevel;
import com.bookfair.mapper.AdminMapper;
import com.bookfair.service.AdminHallService;
import com.bookfair.service.AdminVenueService;
import com.bookfair.repository.VenueRepository;
import com.bookfair.repository.BuildingRepository;
import com.bookfair.repository.HallRepository;
import com.bookfair.dto.request.HallRequest;
import com.bookfair.dto.request.HallStatusRequest;
import com.bookfair.dto.response.*;
import com.bookfair.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVenueController {

    private final AdminHallService adminHallService;
    private final AdminVenueService adminVenueService;
    private final AdminMapper adminMapper;

    @GetMapping("/venues")
    public ResponseEntity<List<VenueAdminResponse>> getAllVenues() {
        return ResponseEntity.ok(adminVenueService.getAllVenues());
    }

    @GetMapping("/venues/{id}/buildings")
    public ResponseEntity<List<BuildingAdminResponse>> getBuildingsByVenue(@PathVariable Long id) {
        return ResponseEntity.ok(adminVenueService.getBuildingsByVenue(id));
    }

    @GetMapping("/buildings/{id}/halls")
    public ResponseEntity<List<HallResponse>> getHallsByBuilding(@PathVariable Long id) {
        return ResponseEntity.ok(adminVenueService.getHallsByBuilding(id));
    }

    @GetMapping("/halls")
    public ResponseEntity<List<HallResponse>> getAllHalls() {
        return ResponseEntity.ok(adminHallService.getAllHalls());
    }

    @PostMapping("/halls")
    public ResponseEntity<HallResponse> createHall(@jakarta.validation.Valid @RequestBody HallRequest request) {
        Hall hall = adminMapper.mapToHallEntity(request);
        return ResponseEntity.ok(adminMapper.mapToHallResponse(adminHallService.createHall(hall)));
    }

    @PutMapping("/halls/{id}")
    public ResponseEntity<HallResponse> updateHall(@PathVariable Long id, @jakarta.validation.Valid @RequestBody HallRequest request) {
        Hall hall = adminMapper.mapToHallEntity(request);
        return ResponseEntity.ok(adminMapper.mapToHallResponse(adminHallService.updateHall(id, hall)));
    }

    @PatchMapping("/halls/{id}/status")
    public ResponseEntity<HallResponse> changeHallStatus(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody HallStatusRequest request) {
        return ResponseEntity.ok(adminMapper.mapToHallResponse(adminHallService.changeStatus(id, request.getStatus())));
    }

    @DeleteMapping("/halls/{id}")
    public ResponseEntity<GenericActionResponse> archiveHall(@PathVariable Long id) {
        adminHallService.archiveHall(id);
        return ResponseEntity.ok(new GenericActionResponse(true, "Hall archived"));
    }

    @DeleteMapping("/halls/{id}/destroy")
    public ResponseEntity<GenericActionResponse> deleteHall(@PathVariable Long id) {
        adminHallService.deleteHall(id);
        return ResponseEntity.ok(new GenericActionResponse(true, "Hall deleted"));
    }
}
