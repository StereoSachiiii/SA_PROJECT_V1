# Backend Layer: Controllers

## Purpose
The Controller layer (`com.bookfair.controller`) acts as the entry point for all RESTful API requests. Its primary responsibility is to handle HTTP mapping, validate incoming requests, and orchestrate calls to the Service layer.

## API Structure
The API follows versioned REST principles, typically prefixed with `/api/v1`.

### Key Controllers

#### 1. [AdminController](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/controller/AdminController.java)
- **Base Path**: `/api/v1/admin`
- **Scope**: Elevated operations for system managers.
- **Key Endpoints**:
    - `POST /events`: Initialize a new fair.
    - `PUT /events/{id}`: Update schedule or metadata.
    - `GET /stats`: Aggregated system metrics.

#### 2. [AuthController](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/controller/AuthController.java)
- **Base Path**: `/api/v1/auth`
- **Scope**: Public access for identity management.
- **Key Endpoints**:
    - `POST /login`: Credential verification and JWT issuance.
    - `POST /register`: New vendor account creation.

#### 3. [ReservationController](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/controller/ReservationController.java)
- **Base Path**: `/api/v1/reservations`
- **Scope**: Vendor-specific booking lifecycle.
- **Key Endpoints**:
    - `POST /`: Create a PENDING_PAYMENT reservation.
    - `GET /my`: List current user's bookings.

## Design Patterns

### 1. DTO Integration
Controllers never expose JPA Entities directly. They consume and return DTOs (`com.bookfair.dto`) to prevent accidental data leaks and decouples the external API from internal storage logic.

### 2. Standardized Responses
Responses are typically returned as `ResponseEntity<T>`, ensuring consistent HTTP status codes:
- `200 OK`: Success.
- `201 Created`: Successful resource creation.
- `400 Bad Request`: Validation failure.
- `403 Forbidden`: Insufficient permissions.

### 3. Global Exception Handling
Controllers delegate error handling to a `@ControllerAdvice` (`GlobalExceptionHandler`), ensuring that exceptions like `ResourceNotFoundException` translate into clean, structured JSON errors.
