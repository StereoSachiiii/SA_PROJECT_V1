package com.bookfair.service;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.entity.User;
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
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
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
    
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public List<User> getAll() {
        return userRepository.findAll();
    }
}
