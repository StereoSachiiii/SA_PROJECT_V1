package com.bookfair.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JwtUtils — Token Generation & Validation")
class JwtUtilsTest {

    private JwtUtils jwtUtils;

    // Base64-encoded 256-bit key for tests
    private static final String TEST_SECRET = "dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLW5lZWRzLXRvLWJlLWxvbmctZW5vdWdo";
    private static final long TEST_EXPIRATION_MS = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", TEST_EXPIRATION_MS);
    }

    // ─── Token Generation ───────────────────────────────────────

    @Test
    @DisplayName("generateJwtToken produces a non-null token from Authentication")
    void generateJwtToken_withValidAuth_returnsToken() {
        Authentication auth = createAuth("vendor1");
        String token = jwtUtils.generateJwtToken(auth);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    @DisplayName("generateJwtTokenFromUsername produces a token with correct subject")
    void generateJwtTokenFromUsername_correctSubject() {
        String token = jwtUtils.generateJwtTokenFromUsername("admin");
        String extracted = jwtUtils.getUserNameFromJwtToken(token);

        assertEquals("admin", extracted);
    }

    @Test
    @DisplayName("Token contains correct username after round-trip")
    void tokenRoundTrip_preservesUsername() {
        String username = "employee_scanner";
        String token = jwtUtils.generateJwtTokenFromUsername(username);
        String result = jwtUtils.getUserNameFromJwtToken(token);

        assertEquals(username, result);
    }

    // ─── Token Validation ────────────────────────────────────────

    @Test
    @DisplayName("validateJwtToken returns true for valid token")
    void validateJwtToken_validToken_returnsTrue() {
        String token = jwtUtils.generateJwtTokenFromUsername("testuser");
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("validateJwtToken returns false for malformed token")
    void validateJwtToken_malformedToken_returnsFalse() {
        assertFalse(jwtUtils.validateJwtToken("not.a.valid.jwt"));
    }

    @Test
    @DisplayName("validateJwtToken returns false for empty/null token")
    void validateJwtToken_emptyToken_returnsFalse() {
        assertFalse(jwtUtils.validateJwtToken(""));
    }

    @Test
    @DisplayName("validateJwtToken returns false for expired token")
    void validateJwtToken_expiredToken_returnsFalse() {
        // Create a token that expired 1 second ago
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(TEST_SECRET));
        String expiredToken = Jwts.builder()
                .setSubject("expireduser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(expiredToken));
    }

    @Test
    @DisplayName("validateJwtToken returns false for token signed with different key")
    void validateJwtToken_wrongKey_returnsFalse() {
        Key wrongKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String token = Jwts.builder()
                .setSubject("hacker")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(wrongKey, SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(token));
    }

    // ─── Long Expiration ─────────────────────────────────────────

    @Test
    @DisplayName("Long expiration field handles values > Integer.MAX_VALUE")
    void longExpiration_handlesLargeValues() {
        long thirtyDaysMs = 30L * 24 * 60 * 60 * 1000; // 2,592,000,000 > Integer.MAX_VALUE
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", thirtyDaysMs);

        String token = jwtUtils.generateJwtTokenFromUsername("longexpiry");
        assertTrue(jwtUtils.validateJwtToken(token));

        // Verify the username still survives
        assertEquals("longexpiry", jwtUtils.getUserNameFromJwtToken(token));
    }

    // ─── Helpers ─────────────────────────────────────────────────

    private Authentication createAuth(String username) {
        UserDetails userDetails = User.builder()
                .username(username)
                .password("irrelevant")
                .roles("VENDOR")
                .build();
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
