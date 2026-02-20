package com.bookfair.controller;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.AuthResponse;
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
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@jakarta.validation.Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    /**
     * Register a new user, then auto-login and return the same AuthResponse as /login.
     * This gives the frontend the JWT token + userId immediately after registration.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@jakarta.validation.Valid @RequestBody UserRequest signUpRequest) {
        userService.createUser(signUpRequest);
        // Auto-login: authenticate with the credentials just registered
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(signUpRequest.getUsername());
        loginRequest.setPassword(signUpRequest.getPassword());
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.ForgotPasswordRequest request) {
        authService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.ResetPasswordRequest request) {
        authService.completePasswordReset(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<com.bookfair.entity.User> getCurrentUser(java.security.Principal principal) {
        return ResponseEntity.ok(userService.getByUsernameForServices(principal.getName()));
    }
}


