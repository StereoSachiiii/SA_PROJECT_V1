package com.bookfair.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRequestTest {

    private static Validator validator;

    @BeforeAll
    static void initValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void loginRequest_ShouldBeValid_WhenAllFieldsPresent() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void loginRequest_ShouldFailValidation_WhenUsernameBlank() {
        LoginRequest request = new LoginRequest();
        request.setUsername(" ");
        request.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void loginRequest_ShouldFailValidation_WhenPasswordBlank() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword(" ");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }
}

