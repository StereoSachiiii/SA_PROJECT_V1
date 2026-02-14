package com.bookfair.controller;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.dto.response.GenreResponse;
import com.bookfair.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Genre Controller
 * 
 * TODO [BACKEND DEV 3]: Add bulk genre creation
 * - POST /api/genres/bulk with List<GenreRequest>
 */
@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {
    
    private final GenreService genreService;
    
    /**
     * POST /api/genres
     * Add a genre to publisher's listing
     */
    @PostMapping
    public ResponseEntity<GenreResponse> addGenre(@RequestBody GenreRequest request) {
        return ResponseEntity.ok(genreService.addGenre(request));
    }
    
    /**
     * GET /api/genres/user/{userId}
     * Get all genres for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GenreResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(genreService.getByUser(userId));
    }
}
