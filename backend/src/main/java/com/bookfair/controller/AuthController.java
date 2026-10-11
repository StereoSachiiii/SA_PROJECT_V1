package com.bookfair.controller;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.request.UserRequest;
import com.bookfair.dto.response.AuthResponse;
import com.bookfair.dto.response.UserProfileResponse;
import com.bookfair.entity.User;
import com.bookfair.service.AuthService;
import com.bookfair.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for public authentication and profile endpoints.
 * GET /api/profile extracts user profile directly from OIDC ID token claims.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/v1/auth/login")
    public ResponseEntity<AuthResponse> authenticateUser(@jakarta.validation.Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/v1/auth/register")
    public ResponseEntity<AuthResponse> registerUser(@jakarta.validation.Valid @RequestBody UserRequest signUpRequest) {
        userService.createUser(signUpRequest);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(signUpRequest.getUsername());
        loginRequest.setPassword(signUpRequest.getPassword());
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/v1/auth/forgot-password")
    public ResponseEntity<Void> forgotPassword(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.ForgotPasswordRequest request) {
        authService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/v1/auth/reset-password")
    public ResponseEntity<Void> resetPassword(@jakarta.validation.Valid @RequestBody com.bookfair.dto.request.ResetPasswordRequest request) {
        authService.completePasswordReset(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/v1/auth/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userService.getByUsernameForServices(principal.getName()));
    }

    /**
     * GET /api/profile
     * Reads user details directly from the authenticated OIDC token / claims
     * (@AuthenticationPrincipal Jwt jwt or @AuthenticationPrincipal OidcUser oidcUser)
     * instead of fetching user records from a local database table.
     */
    @GetMapping({"/profile", "/v1/vendor/profile"})
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal Jwt jwt,
            @AuthenticationPrincipal OidcUser oidcUser) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (jwt == null && oidcUser == null && (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal()))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> claims = Collections.emptyMap();
        if (oidcUser != null) {
            claims = oidcUser.getClaims();
        } else if (jwt != null) {
            claims = jwt.getClaims();
        }

        // 1. Username: Map from username, preferred_username, or sub claim
        String username = null;
        if (claims.containsKey("username")) {
            username = String.valueOf(claims.get("username"));
        } else if (claims.containsKey("preferred_username")) {
            username = String.valueOf(claims.get("preferred_username"));
        } else if (jwt != null) {
            username = jwt.getSubject();
        } else if (oidcUser != null) {
            username = oidcUser.getSubject();
        } else if (auth != null) {
            username = auth.getName();
        }

        // 2. Name: Map from name, given_name, or formatted first/last name claims
        String name = null;
        if (claims.containsKey("name") && claims.get("name") != null) {
            name = String.valueOf(claims.get("name"));
        } else {
            String givenName = claims.get("given_name") != null ? String.valueOf(claims.get("given_name")) : null;
            String familyName = claims.get("family_name") != null ? String.valueOf(claims.get("family_name")) : null;
            if (givenName != null || familyName != null) {
                name = ((givenName != null ? givenName : "") + " " + (familyName != null ? familyName : "")).trim();
            }
        }
        if (name == null || name.isBlank()) {
            name = username;
        }

        // 3. Email: Map from email claim
        String email = claims.get("email") != null ? String.valueOf(claims.get("email")) : null;

        // 4. Contact Number: Map from phone_number, phone, or contact_number claim
        String contactNumber = null;
        if (claims.containsKey("phone_number") && claims.get("phone_number") != null) {
            contactNumber = String.valueOf(claims.get("phone_number"));
        } else if (claims.containsKey("phone") && claims.get("phone") != null) {
            contactNumber = String.valueOf(claims.get("phone"));
        } else if (claims.containsKey("contact_number") && claims.get("contact_number") != null) {
            contactNumber = String.valueOf(claims.get("contact_number"));
        }

        // 5. Organization: Map from custom claim org_name / organization (or fallback to DB/user metadata)
        String organization = null;
        if (claims.containsKey("org_name") && claims.get("org_name") != null) {
            organization = String.valueOf(claims.get("org_name"));
        } else if (claims.containsKey("organization") && claims.get("organization") != null) {
            organization = String.valueOf(claims.get("organization"));
        } else if (claims.containsKey("org") && claims.get("org") != null) {
            organization = String.valueOf(claims.get("org"));
        }

        // Fallback organization to local DB businessName if claim not present in token
        if (organization == null && username != null) {
            try {
                User dbUser = userService.getByUsernameForServices(username);
                if (dbUser != null) {
                    organization = dbUser.getBusinessName();
                    if (email == null) email = dbUser.getEmail();
                    if (contactNumber == null) contactNumber = dbUser.getContactNumber();
                }
            } catch (Exception ignored) {}
        }

        // 6. Roles: Map from user roles or groups claim or authorities
        List<String> rolesList = new ArrayList<>();
        if (claims.containsKey("roles") && claims.get("roles") instanceof List) {
            rolesList = ((List<?>) claims.get("roles")).stream().map(Object::toString).collect(Collectors.toList());
        } else if (claims.containsKey("groups") && claims.get("groups") instanceof List) {
            rolesList = ((List<?>) claims.get("groups")).stream().map(Object::toString).collect(Collectors.toList());
        } else if (auth != null) {
            rolesList = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
        }

        UserProfileResponse response = UserProfileResponse.builder()
                .username(username)
                .name(name)
                .email(email)
                .contactNumber(contactNumber)
                .organization(organization)
                .roles(rolesList)
                .build();

        return ResponseEntity.ok(response);
    }
}
