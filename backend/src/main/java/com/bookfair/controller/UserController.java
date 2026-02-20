package com.bookfair.controller;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.UserResponse;
import com.bookfair.entity.User;
import com.bookfair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

/**
 * User Controller
 * 
 * Handles User management operations.
 */
@RestController
@RequestMapping("/api/v1/vendor/profile")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * GET /api/v1/vendor/profile
     * Returns the currently logged-in vendor's profile.
     */
    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(userService.getByUsername(principal.getName()));
    }

    /**
     * PATCH /api/v1/vendor/profile
     * Updates the current vendor's profile.
     */
    @PatchMapping
    public ResponseEntity<UserResponse> updateProfile(Principal principal, @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
    }

    /**
     * GET /api/v1/vendor/profile/{id}
     * Get user by ID. Protected with IDOR check.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(userService.getByIdProtected(id, principal.getName()));
    }
}
