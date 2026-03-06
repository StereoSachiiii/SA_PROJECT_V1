package com.bookfair.service;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.UserResponse;
import com.bookfair.entity.User;
import com.bookfair.exception.ConflictException;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService — Registration & Profile")
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private UserService userService;

    private UserRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new UserRequest();
        validRequest.setUsername("newvendor");
        validRequest.setEmail("new@publisher.com");
        validRequest.setPassword("securepassword");
    }

    // ─── Registration ────────────────────────────────────────────

    @Test
    @DisplayName("createUser with valid data creates a VENDOR by default")
    void createUser_validData_createsVendor() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(42L);
            return u;
        });

        User created = userService.createUser(validRequest);

        assertNotNull(created);
        assertEquals("newvendor", created.getUsername());
        assertEquals(User.Role.VENDOR, created.getRole());
        assertEquals("$2a$encoded", created.getPassword());
        verify(passwordEncoder).encode("securepassword");
    }

    @Test
    @DisplayName("createUser with duplicate username throws ConflictException")
    void createUser_duplicateUsername_throwsConflict() {
        when(userRepository.existsByUsername("newvendor")).thenReturn(true);

        assertThrows(ConflictException.class,
                () -> userService.createUser(validRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("createUser with duplicate email throws ConflictException")
    void createUser_duplicateEmail_throwsConflict() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("new@publisher.com")).thenReturn(true);

        assertThrows(ConflictException.class,
                () -> userService.createUser(validRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("createUser encodes password before saving")
    void createUser_encodesPassword() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("securepassword")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User created = userService.createUser(validRequest);

        assertEquals("$2a$hashed", created.getPassword());
        verify(passwordEncoder).encode("securepassword");
    }

    // ─── Profile Retrieval ───────────────────────────────────────

    @Test
    @DisplayName("getById returns UserResponse for existing user")
    void getById_existing_returnsResponse() {
        User user = new User();
        user.setId(1L);
        user.setUsername("admin");
        user.setEmail("admin@test.com");
        user.setRole(User.Role.ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getById(1L);

        assertNotNull(response);
        assertEquals("admin", response.getUsername());
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    @DisplayName("getById with non-existent ID throws ResourceNotFoundException")
    void getById_nonExistent_throwsNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.getById(999L));
    }

    @Test
    @DisplayName("getById with null ID throws IllegalArgumentException")
    void getById_nullId_throwsIllegalArg() {
        assertThrows(IllegalArgumentException.class,
                () -> userService.getById(null));
    }

    @Test
    @DisplayName("getByUsername returns correct user")
    void getByUsername_returns_correctUser() {
        User user = new User();
        user.setId(5L);
        user.setUsername("employee1");
        user.setEmail("emp@test.com");
        user.setRole(User.Role.EMPLOYEE);
        when(userRepository.findByUsername("employee1")).thenReturn(Optional.of(user));

        UserResponse response = userService.getByUsername("employee1");

        assertEquals("employee1", response.getUsername());
        assertEquals("EMPLOYEE", response.getRole());
    }
}
