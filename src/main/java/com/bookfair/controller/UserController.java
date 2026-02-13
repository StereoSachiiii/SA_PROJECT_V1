package com.bookfair.controller;

import com.bookfair.dto.request.PublisherRequest;
import com.bookfair.entity.Publisher;
import com.bookfair.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Publisher Controller
 * 
 * TODO [BACKEND DEV 1]: Add validation
 * - Use @Valid annotation
 * - Add validation annotations to DTO (@NotBlank, @Email, etc.)
 */
@RestController
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {
    
    private final PublisherService publisherService;
    
    /**
     * POST /api/publishers
     * Register a new publisher/vendor
     */
    @PostMapping
    public ResponseEntity<Publisher> register(@RequestBody PublisherRequest request) {
        return ResponseEntity.ok(publisherService.register(request));
    }
    
    /**
     * GET /api/publishers/{id}
     * Get publisher by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Publisher> getById(@PathVariable Long id) {
        return ResponseEntity.ok(publisherService.getById(id));
    }
    
    /**
     * GET /api/publishers
     * Get all publishers (for employee portal)
     */
    @GetMapping
    public ResponseEntity<List<Publisher>> getAll() {
        return ResponseEntity.ok(publisherService.getAll());
    }
}
