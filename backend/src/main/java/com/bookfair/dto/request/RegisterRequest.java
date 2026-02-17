package com.bookfair.dto.request;

import jakarta.validation.constraints.Size;

import com.bookfair.entity.User.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    
    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "Contact number is required")
    @Size(min = 10, max = 15, message = "Contact number should be between 10-15 digits")
    private String contactNumber;
    
    private String businessName;
}
