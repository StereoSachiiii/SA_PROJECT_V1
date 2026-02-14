package com.bookfair.controller;

import com.bookfair.dto.response.StallResponse;
import com.bookfair.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Stall Controller
 * 
 * TODO [BACKEND DEV 1]: Add endpoint for filtering by size
 * - GET /api/stalls?size=SMALL
 */
@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {
    
    private final StallService stallService;
    
    /**
     * GET /api/stalls
     * Get all stalls with optional filtering
     */
    @GetMapping
    public ResponseEntity<List<StallResponse>> getAll(
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Boolean available) {
        return ResponseEntity.ok(stallService.getAll(size, available));
    }
    
    /**
     * GET /api/stalls/available
     * Get only available stalls
     */
    @GetMapping("/available")
    public ResponseEntity<List<StallResponse>> getAvailable() {
        return ResponseEntity.ok(stallService.getAvailable());
    }
    
    /**
     * GET /api/stalls/{id}
     * Get stall by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<StallResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stallService.getById(id));
    }
}
