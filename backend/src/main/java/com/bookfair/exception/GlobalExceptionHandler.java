package com.bookfair.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bookfair.dto.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found at {} : {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ErrorResponse> handleBusinessLogicException(BusinessLogicException ex, HttpServletRequest request) {
        log.warn("Business Logic Violation at {}: {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(DataAccessException ex, HttpServletRequest request) {
        log.error("CRITICAL: Database failure at {} : {}", request.getRequestURI(), ex.getMessage());
        String message = "Database service is temporarily unavailable. Please try again later.";
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );

        log.warn("Validation Failed at {} : {}", request.getRequestURI(), errors);
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Failed", request, errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationExcepption(ConstraintViolationException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getConstraintViolations().forEach(violation -> {
            String propertyPath = violation.getPropertyPath().toString();
            String fieldName = propertyPath.substring(propertyPath.lastIndexOf('.') + 1);
            errors.put(fieldName, violation.getMessage());
        });

        log.warn("Constraint violation at {}: {}", request.getRequestURI(), errors);
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid parameter values", request, errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        log.error("CRITICAL: Unhandled exception at {} : {}", request.getRequestURI(), ex.getMessage());
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request, null);
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus httpStatus, String message, HttpServletRequest request, Map<String, String> details) {
        ErrorResponse errorResponse = new ErrorResponse(httpStatus.value(), 
        httpStatus.name(), 
        message, 
        request.getRequestURI(), 
        LocalDateTime.now(), 
        details);

        return new ResponseEntity<>(errorResponse, httpStatus);
    }
}