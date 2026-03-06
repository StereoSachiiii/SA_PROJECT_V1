package com.bookfair.controller;

import com.bookfair.service.*;
import com.bookfair.dto.response.AdminDashboardStats; // Specific import for AdminDashboardStats
import com.bookfair.dto.response.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminSystemController {

    private final AdminService adminService;
    private final UserService userService;
    private final AuditLogService auditLogService;
    private final EventService eventService;
    private final PricingService pricingService;
    private final ObjectMapper objectMapper;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        AdminDashboardStats stats = adminService.getDashboardStats();
        try {
            log.info("API RESPONSE /admin/dashboard/stats: {}", objectMapper.writeValueAsString(stats));
        } catch (Exception e) {
            log.error("Serialization error", e);
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<PageResponse<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long actorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditLogService.getAuditLogs(entityType, actorId, page, size));
    }

    @GetMapping("/events/{id}/stats")
    public ResponseEntity<EventStatsResponse> getEventStats(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventStats(id));
    }

    @PostMapping("/events/{id}/recalculate-prices")
    public ResponseEntity<GenericActionResponse> recalculatePrices(@PathVariable Long id) {
        pricingService.recalculateEventPrices(id);
        return ResponseEntity.ok(GenericActionResponse.builder()
                .success(true)
                .message("Prices recalculated for event " + id)
                .build());
    }
}
