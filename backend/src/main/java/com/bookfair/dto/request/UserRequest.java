package com.bookfair.dto.request;

import com.bookfair.entity.User.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// For Admin use (keeping role)

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    
    @NotBlank(message = "Role is required")
    private Role role;
    
    private String businessName;

    @Size(min = 10, max = 15, message = "Contact number should be between 10-15 digits")
    private String contactNumber;
    
    private String address;
}
 