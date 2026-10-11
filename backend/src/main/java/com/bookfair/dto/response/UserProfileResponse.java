package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing user profile info extracted directly from OIDC ID token claims.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private String username;
    private String name;
    private String email;
    private String contactNumber;
    private String organization;
    private List<String> roles;
}
