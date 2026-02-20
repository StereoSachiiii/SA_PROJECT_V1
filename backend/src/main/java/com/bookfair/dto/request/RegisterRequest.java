package com.bookfair.dto.request;

import com.bookfair.entity.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role;
    private String address;
    private String contactNumber;
    
    @NotBlank(message = "Business name is required")
    private String businessName;
    
    private String businessDescription;
    private String logoUrl;
    private java.util.List<com.bookfair.entity.PublisherCategory> categories;

}
