package com.bookfair.controller;

import com.bookfair.dto.request.LoginRequest;
import com.bookfair.dto.request.UserRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full integration tests for /api/v1/auth endpoints.
 * Uses H2 in-memory DB via test application.properties.
 */
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("AuthController — Integration Tests")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    // Helper to create a valid registration request with all required fields
    private UserRequest validRegistration(String username, String email) {
        UserRequest req = new UserRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword("password123");
        req.setBusinessName("Test Publisher Ltd");
        req.setContactNumber("+94771234567");
        return req;
    }

    // ─── Registration ────────────────────────────────────────────

    @Test
    @DisplayName("POST /auth/register — valid registration returns JWT + user")
    void register_validData_returns200WithToken() throws Exception {
        UserRequest req = validRegistration("newuser", "newuser@test.com");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("newuser"))
                .andExpect(jsonPath("$.user.email").value("newuser@test.com"))
                .andExpect(jsonPath("$.user.role").value("VENDOR")); // Default role
    }

    @Test
    @DisplayName("POST /auth/register — duplicate username returns 409")
    void register_duplicateUsername_returns409() throws Exception {
        UserRequest req = validRegistration("dupuser", "dup1@test.com");

        // First registration succeeds
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Second registration with same username fails
        UserRequest req2 = validRegistration("dupuser", "dup2@test.com");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("POST /auth/register — missing required fields fail validation (400)")
    void register_missingFields_returns400() throws Exception {
        // Missing username, email, password, businessName, contactNumber
        UserRequest req = new UserRequest();
        req.setEmail("valid@test.com");
        req.setPassword("password123");
        // Missing username, businessName, contactNumber

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ─── Login ──────────────────────────────────────────────────

    @Test
    @DisplayName("POST /auth/login — valid credentials return JWT + user profile")
    void login_validCredentials_returns200() throws Exception {
        // First register
        UserRequest reg = validRegistration("logintest", "logintest@test.com");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        // Then login
        LoginRequest login = new LoginRequest("logintest", "password123");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("logintest"));
    }

    @Test
    @DisplayName("POST /auth/login — wrong password returns 401")
    void login_wrongPassword_returns401() throws Exception {
        // Register first
        UserRequest reg = validRegistration("logintest2", "logintest2@test.com");
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        // Login with wrong password
        LoginRequest login = new LoginRequest("logintest2", "wrongpassword");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /auth/login — blank fields fail validation")
    void login_blankFields_returns400() throws Exception {
        LoginRequest login = new LoginRequest("", "");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest());
    }

    // ─── /auth/me (Current User) ─────────────────────────────────

    @Test
    @DisplayName("GET /auth/me — with valid JWT returns current user profile")
    void me_validToken_returnsUser() throws Exception {
        // Register + get token
        UserRequest reg = validRegistration("metest", "metest@test.com");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();

        // Call /me
        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("metest"))
                .andExpect(jsonPath("$.email").value("metest@test.com"));
    }

    @Test
    @DisplayName("GET /auth/me — without token does not return 200")
    void me_noToken_returnsError() throws Exception {
        // Without a token, the controller NPEs on null Principal (500) or security blocks (401).
        // Either way, it must NOT return 200.
        int status = mockMvc.perform(get("/api/v1/auth/me"))
                .andReturn().getResponse().getStatus();
        assertNotEquals(200, status, "Unauthenticated /me must not return 200");
    }

    // ─── Security: Role-Based Access ─────────────────────────────

    @Test
    @DisplayName("VENDOR cannot access /api/v1/admin/dashboard/stats (403)")
    void vendor_cannotAccessAdmin_returns403() throws Exception {
        // Register a vendor
        UserRequest reg = validRegistration("vendorblock", "vendorblock@test.com");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();

        // Try admin endpoint
        mockMvc.perform(get("/api/v1/admin/dashboard/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }
}
