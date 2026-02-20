# Security Architecture

## Overview
The system implements a stateless security model using **Spring Security** and **JWT (JSON Web Tokens)**. This ensures secure communication between the frontend and backend without requiring server-side sessions.

## Authentication Flow
1. **Login**: User submits credentials to `/api/v1/auth/login`.
2. **Verification**: `AuthService` verifies credentials against the database.
3. **Token Generation**: `JwtUtils` generates a signed JWT containing user identity and roles.
4. **Issuance**: Token is returned to the client and stored in `localStorage`.
5. **Authorization**: Client includes the token in the `Authorization: Bearer <token>` header for subsequent requests.

## Security Components

### 1. SecurityConfig
Located at `com.bookfair.security.SecurityConfig`.
- Configures HTTP security filters.
- Defines public vs. protected endpoints.
- Enables CORS and disables CSRF (since stateless).
- Sets session management to `STATELESS`.

### 2. JwtAuthenticationFilter
- Intercepts every request.
- Validates the presence and signature of the JWT.
- Loads `UserDetails` from the token and populates the `SecurityContext`.

### 3. Rate Limiting
The `RateLimitingFilter` provides rudimentary protection against brute-force and DoS attacks by limiting the frequency of requests from a single IP.

## Role-Based Access Control (RBAC)
The system distinguishes between several user roles:

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **ADMIN** | System-wide | Manage events, stalls, pricing, and approve refunds. |
| **VENDOR** | Business-specific | Book stalls, manage their profile, view tickets. |
| **EMPLOYEE** | Operational | Verify entry passes, check-in vendors at halls. |

Endpoints are protected using method-level security:
```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteEvent(Long id) { ... }
```

## Security Best Practices Implemented
- **Password Hashing**: BCrypt is used via `PasswordEncoder`.
- **JWT Signing**: HMAC-SHA512 with a strong externalized secret.
- **Statelessness**: No sensitive data stored in server memory.
- **Stateless Tokens**: Tokens are immutable and signed.
