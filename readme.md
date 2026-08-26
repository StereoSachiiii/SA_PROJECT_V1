# Colombo Bookfair Stall Reservation System

A secure, enterprise-grade web application for managing stall reservations, floor layouts, vendor profiles, and entry passes for large-scale book fairs.

Built with **Spring Boot 3** (OAuth2 Resource Server / Client) and **React 18 + TypeScript + Vite**, with OpenID Connect (OIDC) identity federation via **Asgardeo**, local **HTTPS encryption**, and full **OWASP Top 10 security hardening**.

---

## 🚀 Key Features

### 🏢 Stall Management & Interactive Layouts
- **Interactive Stall Inventory**: Real-time availability view per hall, tier, and floor level.
- **Dynamic Pricing Engine**: Automated calculation based on booth size (Small, Medium, Large), hall tier, and VIP multipliers.

### 🎫 Booking & Vendor Management
- **Token-Driven Stall Reservation**: Secure booking flow extracting user identity strictly from OIDC JWT claims (preventing BOLA/IDOR).
- **OIDC Profile Integration**: Synchronized vendor profiles showing identity claims issued directly by Asgardeo IdP.
- **Entry Ticket & QR Generation**: Automated generation and download of digital QR pass tickets for venue check-in.

### 📊 Admin & Event Operations
- **Organizer Dashboard**: Real-time analytics tracking revenue, vendor counts, and reservation density.
- **Global Management**: Global endpoints allowing event organizers to review, confirm, or refund vendor bookings.
- **Check-in System**: QR scanning for venue gate access validation and entry log auditing.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your development machine:

1. **Java JDK 17+**: `java -version`
2. **Node.js 18+** and `npm`: `node -v` && `npm -v`
3. **Maven 3.8+**: `mvn -v`
4. **MySQL Database 8.0+**: Running on port `3306`

---

## 🗄️ Database Setup

1. **Create MySQL Database**:
   Log in to your MySQL server and create the application database:
   ```sql
   CREATE DATABASE IF NOT EXISTS stall_reservation_db;
   ```

2. **Schema & Initial Data Loading**:
   The SQL schema and seed data are located in `backend/src/main/resources/data.sql`.
   
   - When launching Spring Boot with `spring.jpa.hibernate.ddl-auto=update`, tables are generated automatically.
   - Alternatively, execute `data.sql` directly using your MySQL client:
     ```bash
     mysql -u root -p stall_reservation_db < backend/src/main/resources/data.sql
     ```

---

## 🔐 Environment & OpenID Connect (OIDC) Setup

### 1. SSL Keystore Generation (HTTPS)
Generate a self-signed PKCS12 keystore (`keystore.p12`) for local HTTPS development:
```bash
# Execute in backend/src/main/resources/
cd backend/src/main/resources
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 3650 -storepass changeit -dname "CN=localhost, OU=Engineering, O=BookFair, L=Colombo, ST=Western, C=LK"
```

### 2. Backend Environment File (`.env`)
Copy `.env.example` to `.env` in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```
Fill in your Asgardeo OIDC application credentials:
```properties
SERVER_PORT=8443
SSL_KEYSTORE_PASSWORD=changeit

DB_URL=jdbc:mysql://localhost:3306/stall_reservation_db
DB_USERNAME=root
DB_PASSWORD=root

ASGARDEO_ORG_NAME=your_org_name
ASGARDEO_CLIENT_ID=your_asgardeo_client_id
ASGARDEO_CLIENT_SECRET=your_asgardeo_client_secret
ASGARDEO_ISSUER_URI=https://api.asgardeo.io/t/your_org/oauth2/token
ASGARDEO_JWK_SET_URI=https://api.asgardeo.io/t/your_org/oauth2/jwks
JWT_SECRET=your_secure_random_256bit_key
FRONTEND_URL=https://localhost:5173
BACKEND_URL=https://localhost:8443
```

### 3. Frontend Environment File (`.env`)
Copy `.env.example` to `.env` in the `frontend` directory:
```bash
cp frontend/.env.example frontend/.env
```
Ensure the API endpoint points to HTTPS port 8443:
```properties
VITE_API_URL=https://localhost:8443/api
```

---

## 🏃 Running the Application

### 1. Launch Spring Boot Backend
Open a terminal in the `backend` directory:
```bash
cd backend
mvn spring-boot:run
```
- **Backend HTTPS Endpoint**: `https://localhost:8443/api`

### 2. Launch React (Vite) Frontend
Open a terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
- **Frontend HTTPS Application**: `https://localhost:5173`

---

## 🛡️ Security & OWASP Top 10 Mitigations

| Security Area | Implementation Details |
| :--- | :--- |
| **Authentication & OIDC** | Spring Boot configured as OAuth2 Resource Server validating JWT access tokens issued by Asgardeo OIDC IdP (`JWKSet` verification). |
| **Identity / BOLA / IDOR Protection** | User identity is strictly extracted from `@AuthenticationPrincipal Jwt jwt` (`jwt.getSubject()`). Request body `username` fields are ignored. |
| **Role-Based Access Control (RBAC)** | Global method security (`@EnableMethodSecurity`) enforces `@PreAuthorize("hasRole('ORGANIZER')")` on management endpoints. |
| **SQL Injection Prevention** | All repository queries use Spring Data JPA method signatures or parameterized JPQL (`:paramName`). Zero string concatenation. |
| **Cross-Site Scripting (XSS)** | Backend escapes free-text inputs (`HtmlUtils.htmlEscape`). Frontend relies on React's automatic HTML entity escaping with 0 `dangerouslySetInnerHTML` usages. |
| **CORS Policy** | Restricted allowed origins explicitly to trusted clients (`https://localhost:5173`, `https://localhost:8443`), disallowing wildcard `*` with credentials. |
| **Security Headers** | HTTP headers injected via `SecurityConfig`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`. |
| **Information Leakage Prevention** | `GlobalExceptionHandler.java` catches generic exceptions, suppressing internal stack traces and database schema details from API errors. |

---

Developed for the Colombo Book Fair Stall Reservation Platform.
