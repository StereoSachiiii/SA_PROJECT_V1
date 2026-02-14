package com.bookfair.service;

import com.bookfair.dto.request.LoginRequest;
<<<<<<< HEAD
import com.bookfair.dto.response.JwtResponse;
=======
import com.bookfair.dto.request.RegisterRequest;
import com.bookfair.dto.response.AuthResponse;
>>>>>>> origin/backend-feature-nihadh
import com.bookfair.entity.User;
import com.bookfair.repository.UserRepository;
import com.bookfair.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Authentication operations (Login/Logout).
 * User registration is handled by UserService to separate concerns.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

<<<<<<< HEAD
    /**
     * Authenticates a user and generates a JWT.
     */
    public JwtResponse login(LoginRequest loginRequest) {
=======
    public AuthResponse login(LoginRequest loginRequest) {
>>>>>>> origin/backend-feature-nihadh
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        return new AuthResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBusinessName(),
                roles); 
    }
<<<<<<< HEAD
=======

    public void register(RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole() != null ? signUpRequest.getRole() : User.Role.VENDOR);
        user.setBusinessName(signUpRequest.getBusinessName());
        user.setContactNumber(signUpRequest.getContactNumber());
        user.setAddress(signUpRequest.getAddress());

        userRepository.save(user);
    }
>>>>>>> origin/backend-feature-nihadh
}
