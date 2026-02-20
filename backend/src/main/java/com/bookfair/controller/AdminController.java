package com.bookfair.controller;

import com.bookfair.entity.*;
import com.bookfair.service.*;
import com.bookfair.dto.response.AdminDashboardStats;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminHallService adminHallService;
    private final AdminStallService adminStallService;
    private final com.bookfair.service.UserService userService;
    private final com.bookfair.repository.VenueRepository venueRepository;
    private final com.bookfair.repository.BuildingRepository buildingRepository;
    private final com.bookfair.repository.HallRepository hallRepository;

    // ─── VENUE & BUILDING MANAGEMENT ─────────────────────────────

    @GetMapping("/venues")
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueRepository.findAll());
    }

    @GetMapping("/venues/{id}/buildings")
    public ResponseEntity<List<Building>> getBuildingsByVenue(@PathVariable Long id) {
        return ResponseEntity.ok(buildingRepository.findByVenue_Id(id));
    }

    @GetMapping("/buildings/{id}/halls")
    public ResponseEntity<List<com.bookfair.dto.response.HallResponse>> getHallsByBuilding(@PathVariable Long id) {
        return ResponseEntity.ok(hallRepository.findByBuilding_Id(id).stream()
                .map(this::mapToHallResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    // ─── HALL MANAGEMENT ────────────────────────────────────────

    @GetMapping("/halls")
    public ResponseEntity<List<com.bookfair.dto.response.HallResponse>> getAllHalls() {
        return ResponseEntity.ok(adminHallService.getAllHalls().stream()
                .map(this::mapToHallResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping("/halls")
    public ResponseEntity<com.bookfair.dto.response.HallResponse> createHall(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.HallRequest request) {
        Hall hall = mapToHallEntity(request);
        return ResponseEntity.ok(mapToHallResponse(adminHallService.createHall(hall)));
    }

    @PutMapping("/halls/{id}")
    public ResponseEntity<com.bookfair.dto.response.HallResponse> updateHall(@PathVariable Long id, @jakarta.validation.Valid @RequestBody com.bookfair.dto.request.HallRequest request) {
        Hall hall = mapToHallEntity(request);
        return ResponseEntity.ok(mapToHallResponse(adminHallService.updateHall(id, hall)));
    }

    /** Change hall status — PUBLISHED, DRAFT, ARCHIVED */
    @PatchMapping("/halls/{id}/status")
    public ResponseEntity<com.bookfair.dto.response.HallResponse> changeHallStatus(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.bookfair.dto.request.HallStatusRequest request) {
        return ResponseEntity.ok(mapToHallResponse(adminHallService.changeStatus(id, request.getStatus())));
    }

    /** Archive (soft-delete) a hall */
    @DeleteMapping("/halls/{id}")
    public ResponseEntity<Void> archiveHall(@PathVariable Long id) {
        adminHallService.archiveHall(id);
        return ResponseEntity.noContent().build();
    }

    /** Hard-delete a DRAFT hall */
    @DeleteMapping("/halls/{id}/destroy")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        adminHallService.deleteHall(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/halls/{id}/static-layout")
    public ResponseEntity<Map<String, Object>> updateHallLayout(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        adminService.updateHallLayout(id, payload.get("staticLayout"));
        return ResponseEntity.ok(Map.of("updated", true));
    }

    // ─── STALL INVENTORY ────────────────────────────────────────

    @GetMapping("/halls/{id}/stalls")
    public ResponseEntity<List<com.bookfair.dto.response.StallTemplateResponse>> getStallsByHall(@PathVariable Long id) {
        return ResponseEntity.ok(adminStallService.getStallsByHall(id).stream()
                .map(this::mapToStallTemplateResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping("/halls/{id}/stalls/bulk")
    public ResponseEntity<List<com.bookfair.dto.response.StallTemplateResponse>> bulkGenerateStalls(
            @PathVariable Long id,
            @RequestParam int count,
            @RequestParam StallSize size,
            @RequestParam StallCategory category,
            @RequestParam Long basePriceCents) {
        return ResponseEntity.ok(adminStallService.bulkGenerateStalls(id, count, size, category, basePriceCents).stream()
                .map(this::mapToStallTemplateResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    /** Adjust all stall prices in a hall by a percentage */
    @PostMapping("/halls/{id}/price-adjust")
    public ResponseEntity<Map<String, Object>> bulkPriceAdjust(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.bookfair.dto.request.BulkPriceAdjustRequest request) {
        adminStallService.applyBulkPriceIncrease(id, request.getPercentage());
        return ResponseEntity.ok(Map.of("adjusted", true, "percentage", request.getPercentage()));
    }

    /** Block / unblock a single stall template */
    @PatchMapping("/halls/{hallId}/stalls/{stallId}/block")
    public ResponseEntity<com.bookfair.dto.response.StallTemplateResponse> setStallBlocked(
            @PathVariable Long hallId,
            @PathVariable Long stallId,
            @RequestBody java.util.Map<String, Boolean> payload) {
        boolean blocked = payload.getOrDefault("blocked", false);
        return ResponseEntity.ok(mapToStallTemplateResponse(adminStallService.setStallAvailability(stallId, !blocked)));
    }

    @PutMapping("/halls/{hallId}/stalls/{stallId}")
    public ResponseEntity<com.bookfair.dto.response.StallTemplateResponse> updateStallTemplate(
            @PathVariable Long hallId,
            @PathVariable Long stallId,
            @jakarta.validation.Valid @RequestBody com.bookfair.dto.request.StallTemplateUpdateRequest req) {
        return ResponseEntity.ok(mapToStallTemplateResponse(adminService.updateStallTemplate(hallId, stallId, req)));
    }

    /** Export stall inventory as CSV */
    @GetMapping("/halls/{id}/stalls/export")
    public ResponseEntity<byte[]> exportStallsCsv(@PathVariable Long id) {
        byte[] csv = adminStallService.exportStallsCsv(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"stalls-hall-" + id + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    // ─── EVENT / MAP MANAGEMENT ──────────────────────────────────

    @PostMapping("/events/{id}/map")
    public ResponseEntity<Map<String, String>> uploadMap(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String url = adminService.uploadVenueMap(id, file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/events/{id}/stalls")
    public ResponseEntity<List<com.bookfair.dto.response.EventStallAdminResponse>> saveLayout(
            @PathVariable Long id,
            @RequestBody List<com.bookfair.dto.request.EventStallUpdateRequest> stalls) {
        return ResponseEntity.ok(adminService.saveEventLayout(id, stalls).stream()
                .map(this::mapToEventStallAdminResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/events/{id}/stalls")
    public ResponseEntity<List<com.bookfair.dto.response.EventStallAdminResponse>> getEventStalls(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getEventStalls(id).stream()
                .map(this::mapToEventStallAdminResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/events/{id}/stats")
    public ResponseEntity<Map<String, Object>> getEventStats(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getEventStats(id));
    }

    // ─── RESERVATION MANAGEMENT ──────────────────────────────────

    @GetMapping("/reservations")
    public ResponseEntity<List<com.bookfair.dto.response.ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(adminService.getAllReservations().stream()
                .map(ReservationController::mapToResponse)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/reservations/{id}")
    public ResponseEntity<com.bookfair.dto.response.ReservationResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(ReservationController.mapToResponse(adminService.getReservationById(id)));
    }

    /** Confirm payment for a PENDING_PAYMENT reservation (admin override) */
    @PostMapping("/reservations/{id}/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(@PathVariable Long id) {
        adminService.adminConfirmPayment(id);
        return ResponseEntity.ok(Map.of("confirmed", true, "reservationId", id));
    }

    /** Cancel any reservation (admin override) */
    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Admin cancelled") String reason) {
        adminService.adminCancelReservation(id, reason);
        return ResponseEntity.ok(Map.of("cancelled", true, "reservationId", id));
    }

    /** Export all reservations as CSV */
    @GetMapping("/reservations/export")
    public ResponseEntity<byte[]> exportReservationsCsv() {
        byte[] csv = adminService.exportReservationsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reservations.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    // ─── PRICING ─────────────────────────────────────────────────

    @PatchMapping("/stalls/{stallId}/price")
    public ResponseEntity<Map<String, Object>> updateStallPrice(
            @PathVariable Long stallId,
            @jakarta.validation.Valid @RequestBody com.bookfair.dto.request.StallPriceUpdateRequest request) {
        // Adapt DTO to Map for service (temporary, Service should eventually be updated too)
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("baseRateCents", request.getBaseRateCents());
        map.put("multiplier", request.getMultiplier());
        return ResponseEntity.ok(adminService.updateStallPrice(stallId, map));
    }

    // ─── PAYMENTS / REFUNDS ──────────────────────────────────────

    @PostMapping("/payments/refund")
    public ResponseEntity<Map<String, Object>> refundReservation(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.RefundRequest request) {
        return ResponseEntity.ok(adminService.refundReservation(request.getReservationId(), request.getReason()));
    }

    // ─── DASHBOARD ────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ─── USER MANAGEMENT ──────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<com.bookfair.dto.response.UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<com.bookfair.dto.response.UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // ─── AUDIT LOGS ───────────────────────────────────────────────

    @GetMapping("/audit/logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long actorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAuditLogs(entityType, actorId, page, size));
    }

    // ─── MAPPERS ──────────────────────────────────────────────────

    private com.bookfair.dto.response.HallResponse mapToHallResponse(Hall hall) {
        return com.bookfair.dto.response.HallResponse.builder()
                .id(hall.getId())
                .name(hall.getName())
                .venueName(hall.getBuilding() != null && hall.getBuilding().getVenue() != null 
                        ? hall.getBuilding().getVenue().getName() : "")
                .totalSqFt(hall.getTotalSqFt() != null ? hall.getTotalSqFt().intValue() : 0)
                .capacity(hall.getCapacity())
                .tier(hall.getTier() != null ? hall.getTier().name() : null)
                .floorLevel(hall.getFloorLevel())
                .status(hall.getStatus())
                .mainCategory(hall.getMainCategory())
                .ceilingHeight(hall.getCeilingHeight())
                .isIndoor(hall.getIsIndoor())
                .isAirConditioned(hall.getIsAirConditioned())
                .expectedFootfall(hall.getExpectedFootfall())
                .noiseLevel(hall.getNoiseLevel() != null ? hall.getNoiseLevel().name() : null)
                .nearbyFacilities(hall.getNearbyFacilities())
                .distanceFromEntrance(hall.getDistanceFromEntrance())
                .distanceFromParking(hall.getDistanceFromParking())
                .isGroundFloor(hall.getIsGroundFloor())
                .build();
    }

    private Hall mapToHallEntity(com.bookfair.dto.request.HallRequest req) {
        Hall hall = new Hall();
        hall.setName(req.getName());
        
        if (req.getBuildingId() != null) {
            hall.setBuilding(buildingRepository.findById(req.getBuildingId())
                    .orElseThrow(() -> new com.bookfair.exception.ResourceNotFoundException("Building not found ID: " + req.getBuildingId())));
        }
        
        hall.setTotalSqFt(req.getTotalSqFt() != null ? req.getTotalSqFt().doubleValue() : null);
        hall.setCapacity(req.getCapacity());
        if (req.getStatus() != null) hall.setStatus(req.getStatus());
        if (req.getMainCategory() != null) hall.setMainCategory(req.getMainCategory());
        
        hall.setCeilingHeight(req.getCeilingHeight());
        hall.setIsIndoor(req.getIsIndoor());
        hall.setIsAirConditioned(req.getIsAirConditioned());
        hall.setExpectedFootfall(req.getExpectedFootfall());
        hall.setNearbyFacilities(req.getNearbyFacilities());
        hall.setDistanceFromEntrance(req.getDistanceFromEntrance());
        hall.setDistanceFromParking(req.getDistanceFromParking());
        hall.setIsGroundFloor(req.getIsGroundFloor());
        if (req.getStaticLayout() != null) hall.setStaticLayout(req.getStaticLayout());
        
        return hall;
    }

    private com.bookfair.dto.response.StallTemplateResponse mapToStallTemplateResponse(StallTemplate st) {
        return com.bookfair.dto.response.StallTemplateResponse.builder()
                .id(st.getId())
                .name(st.getName())
                .hallName(st.getHall() != null ? st.getHall().getName() : "")
                .size(st.getSize())
                .type(st.getType())
                .category(st.getCategory())
                .basePriceCents(st.getBasePriceCents())
                .sqFt(st.getSqFt())
                .isAvailable(st.getIsAvailable())
                .defaultProximityScore(st.getDefaultProximityScore())
                .geometry(st.getGeometry())
                .imageUrl(st.getImageUrl())
                .build();
    }

    private com.bookfair.dto.response.EventStallAdminResponse mapToEventStallAdminResponse(EventStall es) {
        return com.bookfair.dto.response.EventStallAdminResponse.builder()
                .id(es.getId())
                .stallName(es.getStallTemplate() != null ? es.getStallTemplate().getName() : "")
                .status(es.getStatus() != null ? es.getStatus().name() : "")
                .baseRateCents(es.getBaseRateCents())
                .finalPriceCents(es.getFinalPriceCents())
                .geometry(es.getGeometry())
                .pricingVersion(es.getPricingVersion())
                .build();
    }
}
