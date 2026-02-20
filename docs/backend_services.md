# Backend Layer: Services

## Purpose
The Service layer (`com.bookfair.service`) is the "brain" of the application. It contains all business logic, orchestrates data flow between repositories, and handles complex domain operations. By isolating logic in services, we ensure that the codebase is dry, testable, and reusable.

## Core Services

### 1. [ReservationService](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/service/ReservationService.java)
Manages the complicated lifecycle of a stall booking.
- **Logic**: Handles stall availability checks, TTL (Time-To-Live) for pending payments, and reservation expiry.
- **Transactions**: Ensures that stall allocations are atomic (all or nothing).

### 2. [StallService](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/service/StallService.java)
Provides low-level access to stall inventory.
- **Capabilities**: Fetching stalls by hall, checking reservation status, and managing stall types/pricing.

### 3. [PaymentService](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/service/PaymentService.java)
Abstracts interactions with the Stripe API.
- **Stripe Integration**: Creates `PaymentIntent` objects and handles payment confirmation webhooks.
- **Financial Logic**: Converts currency to cents to avoid floating-point arithmetic issues.

### 4. [AdminService](file:///c:/Users/User/SA_PROJECT/backend/src/main/java/com/bookfair/service/AdminService.java)
Orchestrates high-level administrative tasks.
- **Functionality**: Global stats calculation, mass stall updates, and user management oversight.

## Key Design Patterns

### 1. Exception Handling
Services throw semantic custom exceptions (`com.bookfair.exception`) rather than generic ones. Examples:
- `ResourceNotFoundException`: Thrown when a requested entity doesn't exist.
- `ConflictException`: Thrown when an action violates business rules (e.g., booking an already reserved stall).

### 2. Transaction Management
Methods that perform multiple database writes are annotated with `@Transactional`. This ensures data integrity by rolling back all changes if any part of the operation fails.

### 3. Separation of Concerns
Services do not handle HTTP details (Status codes, headers) or low-level SQL. They focus purely on the "what" and "how" of the business rules.

## Data Seeding
The `DataSeeder` component is a special service invoked at startup to populate the system with core data (Halls, initial Stalls, Default Admin) if the database is empty.
