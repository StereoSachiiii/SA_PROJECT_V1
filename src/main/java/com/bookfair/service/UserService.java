package com.bookfair.service;

import com.bookfair.dto.request.UserRequest;
import com.bookfair.entity.User;
import com.bookfair.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User createUser(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // TODO: Encode password
        user.setRole(request.getRole());
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
