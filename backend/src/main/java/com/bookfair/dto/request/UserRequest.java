package com.bookfair.dto.request;

import com.bookfair.entity.User.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// For Admin use (keeping role)

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
    private String businessName;
    private String contactNumber;
    private String address;
}
 