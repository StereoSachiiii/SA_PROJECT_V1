package com.bookfair.controller;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.UserResponse;
import com.bookfair.entity.User;
import com.bookfair.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * User Controller
 * 
 * Handles User management operations.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {
    
    private final UserService userService;
    
    /**
     * POST /api/users
     * Create a new user (admin/vendor)
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.createUserAndReturnResponse(request));
    }
    
    /**
     * GET /api/users/{id}
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable @Min(1) Long id, Principal principal) {
        return ResponseEntity.ok(userService.getByIdProtected(id, principal.getName()));
    }
    
    /**
     * GET /api/users
     * Get all users (for admin portal)
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll(Principal principal) {
        User requester = userService.getByUsernameForServices(principal.getName());
        if (requester.getRole() != User.Role.ADMIN) {
            throw new com.bookfair.exception.BusinessLogicException("Access denied: Only ADMIN can view all users.");
        }
        return ResponseEntity.ok(userService.getAll());
    }
}
