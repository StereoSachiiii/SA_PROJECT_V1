package com.bookfair.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String businessName;
    private String email;
    private String contactPerson;
    private String password;
    private String phone;
}
