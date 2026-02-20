package com.bookfair.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String businessName;
    private String businessDescription;
    private String logoUrl;
    private java.util.List<String> categories;
    private String contactNumber;
    private String address;
    private Integer reservedStallsCount;
}
