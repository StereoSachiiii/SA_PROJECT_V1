package com.bookfair.service;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.UserResponse;
import com.bookfair.entity.User;
import com.bookfair.exception.BusinessLogicException;
import com.bookfair.exception.ResourceNotFoundException;
import com.bookfair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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
            throw new BusinessLogicException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessLogicException("Error: Email is already in use!");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Securely encode password
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.VENDOR);
        user.setBusinessName(request.getBusinessName());
        user.setContactNumber(request.getContactNumber());
        user.setAddress(request.getAddress());
        
        return userRepository.save(user);
    }
    
    public User getByIdForServices(Long id) {

        if (id == null) {
            throw new BusinessLogicException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public UserResponse getById(Long id) {
        
        if (id == null) {
            throw new BusinessLogicException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .map(this::mapToUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
    
    public UserResponse getByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::mapToUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with UserName: " + username));
    }
    
    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToUserResponse).toList();
    }

    public User getByUsernameForServices(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with UserName: " + username));
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            user.getBusinessName(),
            user.getContactNumber(),
            user.getAddress()
        );
    }
}
