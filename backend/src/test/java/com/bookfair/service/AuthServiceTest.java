package com.bookfair.service;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.response.AuthResponse;
import com.bookfair.entity.User;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.UserRepository;
import com.bookfair.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService — Login & Password Reset")
class AuthServiceTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository userRepository;
    @Mock private UserService userService;
    @Mock private JwtUtils jwtUtils;

    @InjectMocks private AuthService authService;

    private User testUser;
    private LoginRequest validLogin;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("vendor1");
        testUser.setEmail("vendor@test.com");
        testUser.setPassword("$2a$10$encodedpassword");
        testUser.setRole(User.Role.VENDOR);
        testUser.setBusinessName("Test Publisher");

        validLogin = new LoginRequest("vendor1", "password123");
    }

    // ─── Login ──────────────────────────────────────────────────

    @Test
    @DisplayName("Login with valid credentials returns JWT token + user profile")
    void login_validCredentials_returnsAuthResponse() {
        // Mock Spring Security authentication
        Authentication auth = mock(Authentication.class);
        org.springframework.security.core.userdetails.UserDetails principal =
            org.springframework.security.core.userdetails.User.builder()
                .username("vendor1").password("x").roles("VENDOR").build();
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(jwtUtils.generateJwtToken(auth)).thenReturn("jwt-token-123");
        when(userRepository.findByUsername("vendor1")).thenReturn(Optional.of(testUser));
        when(userService.mapToUserResponse(testUser)).thenReturn(
            new com.bookfair.dto.response.UserResponse(
                1L, "vendor1", "vendor@test.com", "VENDOR",
                "Test Publisher", null, null, java.util.Collections.emptyList(), null, null
            )
        );

        AuthResponse response = authService.login(validLogin);

        assertNotNull(response);
        assertEquals("jwt-token-123", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("vendor1", response.getUser().getUsername());
        assertEquals("VENDOR", response.getUser().getRole());
    }

    @Test
    @DisplayName("Login with bad password throws BadCredentialsException")
    void login_badPassword_throwsBadCredentials() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class,
                () -> authService.login(new LoginRequest("vendor1", "wrongpwd")));
    }

    @Test
    @DisplayName("Login with non-existent user throws exception when looking up profile")
    void login_nonExistentUser_throwsNotFound() {
        Authentication auth = mock(Authentication.class);
        org.springframework.security.core.userdetails.UserDetails principal =
            org.springframework.security.core.userdetails.User.builder()
                .username("ghost").password("x").roles("VENDOR").build();
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(auth)).thenReturn("token");
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> authService.login(new LoginRequest("ghost", "password")));
    }

    // ─── Verify correct interactions ─────────────────────────────

    @Test
    @DisplayName("Login invokes AuthenticationManager exactly once")
    void login_callsAuthManagerOnce() {
        Authentication auth = mock(Authentication.class);
        org.springframework.security.core.userdetails.UserDetails principal =
            org.springframework.security.core.userdetails.User.builder()
                .username("vendor1").password("x").roles("VENDOR").build();
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(auth)).thenReturn("token");
        when(userRepository.findByUsername("vendor1")).thenReturn(Optional.of(testUser));
        when(userService.mapToUserResponse(testUser)).thenReturn(
            new com.bookfair.dto.response.UserResponse(
                1L, "vendor1", "vendor@test.com", "VENDOR",
                "Test Publisher", null, null, java.util.Collections.emptyList(), null, null
            )
        );

        authService.login(validLogin);

        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtUtils, times(1)).generateJwtToken(auth);
    }
}
