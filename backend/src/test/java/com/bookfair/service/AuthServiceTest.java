package com.bookfair.service;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.response.AuthResponse;
import com.bookfair.entity.User;
import com.bookfair.exception.BusinessLogicException;
import com.bookfair.repository.UserRepository;
import com.bookfair.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUpSecurityContext() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        GrantedAuthority authority = () -> "ROLE_USER";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userDetails.getAuthorities()).thenReturn(Collections.singletonList(authority));

        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setBusinessName("Test Business");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(loginRequest);

        // verify interactions
        ArgumentCaptor<UsernamePasswordAuthenticationToken> tokenCaptor =
                ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
        verify(authenticationManager).authenticate(tokenCaptor.capture());
        UsernamePasswordAuthenticationToken usedToken = tokenCaptor.getValue();
        assertThat(usedToken.getPrincipal()).isEqualTo("testuser");
        assertThat(usedToken.getCredentials()).isEqualTo("password");

        verify(securityContext).setAuthentication(authentication);
        verify(jwtUtils).generateJwtToken(authentication);
        verify(userRepository).findByUsername("testuser");

        // verify response mapping
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getBusinessName()).isEqualTo("Test Business");
        assertThat(response.getRoles()).containsExactly("ROLE_USER");
    }

    @Test
    void login_ShouldThrowBusinessLogicException_WhenAuthenticationFails() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("baduser");
        loginRequest.setPassword("wrong");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        BusinessLogicException ex = assertThrows(
                BusinessLogicException.class,
                () -> authService.login(loginRequest)
        );

        assertThat(ex.getMessage()).isEqualTo("Invalid username or password");
        verify(jwtUtils, never()).generateJwtToken(any());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    void login_ShouldThrowBusinessLogicException_WhenUserNotFound() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("missing");
        loginRequest.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("missing");
        when(userDetails.getAuthorities()).thenReturn(List.of());
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        BusinessLogicException ex = assertThrows(
                BusinessLogicException.class,
                () -> authService.login(loginRequest)
        );

        assertThat(ex.getMessage()).isEqualTo("Invalid username or password");
    }
}

