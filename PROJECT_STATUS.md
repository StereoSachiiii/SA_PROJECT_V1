# Project Status — Colombo Bookfair Stall Reservation

> Last updated: 2026-02-13

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Java 21 · Spring Boot 3 · Spring Security · JWT |
| Database | H2 (dev) · JPA/Hibernate           |
| Frontend | React 18 · TypeScript · Vite · TanStack Query · Tailwind |

---

## Backend Status

### Authentication (JWT + Spring Security)
- [x] `POST /api/auth/register` — register user (vendor/admin)
- [x] `POST /api/auth/login` — login, returns JWT token
- [x] JWT filter + SecurityConfig
- [x] BCrypt password encoding
- [ ] Return userId + token in login response for frontend storage
- [ ] Employee login (separate role check)

### Stall Management
- [x] `GET /api/stalls` — list all stalls (with size/available filters)
- [x] `GET /api/stalls/available` — available stalls only
- [x] `GET /api/stalls/{id}` — stall by ID
- [x] Auto-seed 20 stalls (A1–D5) on startup

### Reservations
- [x] `POST /api/reservations` — reserve stalls (max 3 per user)
- [x] `GET /api/reservations` — all reservations
- [x] `GET /api/reservations/user/{id}` — by user
- [ ] QR code generation (ZXing) — currently placeholder string
- [ ] `GET /api/reservations/{id}/qr` — download QR as PNG
- [ ] Email confirmation (JavaMailSender) — currently console log

### Genre Management
- [x] `POST /api/genres` — add genre for user
- [x] `GET /api/genres/user/{id}` — genres by user
- [ ] Bulk genre creation
- [ ] Genre suggestions endpoint

### Employee Portal
- [x] `GET /api/employee/dashboard` — stats (total/reserved/available stalls)
- [x] `GET /api/employee/reservations` — all reservations
- [ ] QR verification endpoint
- [ ] Search/filter reservations

---

## Frontend Status

### Pages
- [x] RegisterPage — form with validation + loading spinner
- [x] StallMapPage — grid layout, stall selection (max 3), confirm modal
- [x] HomePage — reservation cards + genre management
- [x] EmployeePortalPage — stats cards + reservations table
- [ ] **LoginPage** — needed to complete auth flow
- [ ] Reusable Input component (created by DilumPal)

### API Layer
- [x] Axios client with `/api` proxy to backend
- [x] `userApi` (register, getAll, getById)
- [x] `stallApi` (getAll, getAvailable)
- [x] `reservationApi` (create, getAll, getByUser)
- [x] `genreApi` (create, getByUser)

### Integration
- [x] Vite proxy configured (port 5173 → 8080)
- [x] CORS configured for ports 5173 + 5174
- [ ] Store JWT token + userId after login
- [ ] Attach JWT to API requests (Authorization header)
- [ ] Protected route guards

---

## Remaining TODOs (Priority Order)

### Must Complete
1. **Login Page** — frontend form + backend token storage
2. **QR Code Generation** — implement with ZXing library
3. **Email Notification** — send confirmation with QR attachment
4. **JWT Integration** — attach token to all API requests
5. **Merge all branches to main** before evaluation

### Should Complete
6. Employee QR verification endpoint
7. Genre bulk creation
8. Search/filter on Employee Portal
9. Reservation confirmation pop-up polish

### Nice to Have
10. Cancel reservation
11. Export reservations to CSV
12. QR download as ZIP bundle
13. Genre suggestions autocomplete

---

## Branch Strategy

| Branch        | Purpose               |
|---------------|------------------------|
| `main`        | Final merged code      |
| `backend`     | Backend development    |
| `frontend`    | Frontend development   |
| `feature/*`   | Individual features    |

All commits must be merged to `main` before evaluation.
