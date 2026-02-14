package com.bookfair.dto.request;

import com.bookfair.entity.User.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
    private String address;
    private String contactNumber;
    private String businessName;
}
