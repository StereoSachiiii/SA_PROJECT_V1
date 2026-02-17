package com.bookfair.controller;

import com.bookfair.dto.request.GenreRequest;
import com.bookfair.dto.response.GenreResponse;
import com.bookfair.service.GenreService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
@Validated
public class GenreController {
    
    private final GenreService genreService;
    
    /**
     * POST /api/genres
     * Add a genre to publisher's listing
     */
    @PostMapping
    public ResponseEntity<GenreResponse> addGenre(@Valid @RequestBody GenreRequest request, Principal principal) {
        return ResponseEntity.ok(genreService.addGenre(request, principal.getName()));
    }
    
    /**
     * GET /api/genres/user/{userId}
     * Get all genres for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GenreResponse>> getByUser(@PathVariable Long userId, Principal principal) {
        return ResponseEntity.ok(genreService.getByUser(userId, principal.getName()));
    }
}
