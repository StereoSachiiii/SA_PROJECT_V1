package com.bookfair.controller;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.JwtResponse;
import com.bookfair.service.AuthService;
import com.bookfair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for public authentication endpoints.
 * Handles Login (via AuthService) and Registration (via UserService).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    /**
     * Register a new user.
     * Delegates to UserService to ensure proper validation and password encoding.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest signUpRequest) {
        userService.createUser(signUpRequest);
        return ResponseEntity.ok("User registered successfully!");
    }
}
