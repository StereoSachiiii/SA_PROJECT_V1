package com.bookfair.controller;

import com.bookfair.entity.StallCategory;
import com.bookfair.entity.StallSize;
import com.bookfair.mapper.AdminMapper;
import com.bookfair.service.AdminStallService;
import com.bookfair.service.PricingService;
import com.bookfair.dto.request.BulkPriceAdjustRequest;
import com.bookfair.dto.request.StallTemplateUpdateRequest;
import com.bookfair.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStallController {

    private final AdminStallService adminStallService;
    private final PricingService pricingService;
    private final AdminMapper adminMapper;

    @GetMapping("/halls/{id}/stalls")
    public ResponseEntity<List<StallTemplateResponse>> getStallsByHall(@PathVariable Long id) {
        return ResponseEntity.ok(adminStallService.getStallsByHall(id).stream()
                .map(adminMapper::mapToStallTemplateResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/halls/{id}/stalls/bulk")
    public ResponseEntity<List<StallTemplateResponse>> bulkGenerateStalls(
            @PathVariable Long id,
            @RequestParam int count,
            @RequestParam StallSize size,
            @RequestParam StallCategory category,
            @RequestParam Long basePriceCents) {
        return ResponseEntity.ok(adminStallService.bulkGenerateStalls(id, count, size, category, basePriceCents).stream()
                .map(adminMapper::mapToStallTemplateResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/halls/{id}/price-adjust")
    public ResponseEntity<GenericActionResponse> bulkPriceAdjust(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody BulkPriceAdjustRequest request) {
        adminStallService.applyBulkPriceIncrease(id, request.getPercentage());
        return ResponseEntity.ok(GenericActionResponse.builder()
                .success(true)
                .message("Prices adjusted by " + request.getPercentage() + "%")
                .build());
    }

    @PatchMapping("/halls/{hallId}/stalls/{stallId}/block")
    public ResponseEntity<StallTemplateResponse> setStallBlocked(
            @PathVariable Long hallId,
            @PathVariable Long stallId,
            @RequestBody Map<String, Boolean> payload) {
        boolean blocked = payload.getOrDefault("blocked", false);
        return ResponseEntity.ok(adminMapper.mapToStallTemplateResponse(adminStallService.setStallAvailability(stallId, !blocked)));
    }

    @PutMapping("/halls/{hallId}/stalls/{stallId}")
    public ResponseEntity<StallTemplateResponse> updateStall(
            @PathVariable Long hallId,
            @PathVariable Long stallId,
            @jakarta.validation.Valid @RequestBody StallTemplateUpdateRequest request) {
        return ResponseEntity.ok(adminMapper.mapToStallTemplateResponse(adminStallService.updateStallTemplate(hallId, stallId, request)));
    }

    @GetMapping("/halls/{id}/stalls/export")
    public ResponseEntity<byte[]> exportStallsCsv(@PathVariable Long id) {
        byte[] csv = adminStallService.exportStallsCsv(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"stalls-hall-" + id + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @PutMapping("/stalls/{id}/price")
    public ResponseEntity<StallPriceResponse> updateStallPrice(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(pricingService.updateStallPrice(id, request));
    }
}
