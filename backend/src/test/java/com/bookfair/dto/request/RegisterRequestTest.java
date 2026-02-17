package com.bookfair.dto.request;

import com.bookfair.entity.User;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class RegisterRequestTest {

    private static Validator validator;

    @BeforeAll
    static void initValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private RegisterRequest buildValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("validuser");
        request.setEmail("valid@example.com");
        request.setPassword("validPass123");
        request.setRole(User.Role.MERCHANT);
        request.setAddress("123 Main St");
        request.setContactNumber("1234567890");
        request.setBusinessName("Business");
        return request;
    }

    @Test
    void registerRequest_ShouldBeValid_WhenAllFieldsValid() {
        RegisterRequest request = buildValidRequest();

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenUsernameTooShort() {
        RegisterRequest request = buildValidRequest();
        request.setUsername("ab");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenEmailInvalid() {
        RegisterRequest request = buildValidRequest();
        request.setEmail("not-an-email");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenPasswordTooShort() {
        RegisterRequest request = buildValidRequest();
        request.setPassword("short");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenRoleNull() {
        RegisterRequest request = buildValidRequest();
        request.setRole(null);

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenAddressBlank() {
        RegisterRequest request = buildValidRequest();
        request.setAddress(" ");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void registerRequest_ShouldFailValidation_WhenContactNumberTooShort() {
        RegisterRequest request = buildValidRequest();
        request.setContactNumber("123456789");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
    }
}

