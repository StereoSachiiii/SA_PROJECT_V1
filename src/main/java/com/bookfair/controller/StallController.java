package com.bookfair.controller;

import com.bookfair.entity.Stall;
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
     * Get all stalls (for map display)
     */
    @GetMapping
    public ResponseEntity<List<Stall>> getAll() {
        return ResponseEntity.ok(stallService.getAll());
    }
    
    /**
     * GET /api/stalls/available
     * Get only available stalls
     */
    @GetMapping("/available")
    public ResponseEntity<List<Stall>> getAvailable() {
        return ResponseEntity.ok(stallService.getAvailable());
    }
    
    /**
     * GET /api/stalls/{id}
     * Get stall by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Stall> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stallService.getById(id));
    }
}
