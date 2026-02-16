package com.bookfair.service;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.response.AuthResponse;
import com.bookfair.entity.User;
import com.bookfair.exception.BusinessLogicException;
import com.bookfair.exception.ResourceNotFoundException;
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

    public AuthResponse login(LoginRequest loginRequest) {
        try {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBusinessName(),
                roles); 
        } catch (Exception e) {
            throw new BusinessLogicException("Invalid username or password");
        }
    }

}
