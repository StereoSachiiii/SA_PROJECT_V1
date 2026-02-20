package com.bookfair.service;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.UserResponse;
import com.bookfair.entity.User;
import com.bookfair.repository.UserRepository;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.exception.ConflictException;
import com.bookfair.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**

 * Service for User management operations.
 * Handles user creation (registration), retrieval, and updates.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Create a new user (Registration).
     * Enforces unique username/email usage and encodes passwords.
     */
    public User createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Error: Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Securely encode password
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.VENDOR);
        user.setBusinessName(request.getBusinessName());
        user.setContactNumber(request.getContactNumber());
        user.setAddress(request.getAddress());
        if (request.getCategories() != null) {
            user.setCategories(request.getCategories());
        }
        
        return userRepository.save(user);
    }

    /**
     * Create a user and return a safe DTO (no password hash exposed).
     */
    public UserResponse createUserAndReturnResponse(UserRequest request) {
        return mapToUserResponse(createUser(request));
    }
    
    public User getByIdForServices(Long id) {

        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .map(this::mapToUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /**
     * Get user by ID with authorization check (IDOR Protection).
     * Only allow if requester is the user themselves or an ADMIN.
     */
    public UserResponse getByIdProtected(Long id, String requesterUsername) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        User requester = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Requester not found"));

        if (!targetUser.getId().equals(requester.getId()) && requester.getRole() != User.Role.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: You can only view your own profile.");
        }

        return mapToUserResponse(targetUser);
    }
    
    public UserResponse getByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::mapToUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }


    public User getByUsernameForServices(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @org.springframework.transaction.annotation.Transactional
    public UserResponse updateProfile(String username, UserRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.getBusinessName() != null) user.setBusinessName(request.getBusinessName());
        if (request.getBusinessDescription() != null) user.setBusinessDescription(request.getBusinessDescription());
        if (request.getLogoUrl() != null) user.setLogoUrl(request.getLogoUrl());
        if (request.getContactNumber() != null) user.setContactNumber(request.getContactNumber());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCategories() != null) user.setCategories(request.getCategories());
        
        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            user.getBusinessName(),
            user.getBusinessDescription(),
            user.getLogoUrl(),
            (user.getCategories() != null) ? user.getCategories().stream().map(Enum::name).collect(java.util.stream.Collectors.toList()) : java.util.Collections.emptyList(),
            user.getContactNumber(),
            user.getAddress(),
            user.getReservedStallsCount()
        );
    }
}
