# API Documentation — Bookfair Stall Reservation

> Base URL: `http://localhost:8080`

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints (Public)

### Register
```http
POST /api/auth/register
```
```json
{
  "username": "abcbooks",
  "password": "securePass123",
  "email": "contact@abcbooks.com",
  "businessName": "ABC Books",
  "contactNumber": "0771234567",
  "role": "VENDOR"
}
```
**Response:** `200 OK` — `"User registered successfully!"`

### Login
```http
POST /api/auth/login
```
```json
{
  "username": "abcbooks",
  "password": "securePass123"
}
```
**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOi...",
  "type": "Bearer",
  "id": 1,
  "username": "abcbooks",
  "email": "contact@abcbooks.com",
  "role": "VENDOR"
}
```

---

## Stall Endpoints

### Get All Stalls (Public)
```http
GET /api/stalls
GET /api/stalls?size=SMALL
GET /api/stalls?available=true
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "A1",
    "size": "SMALL",
    "reserved": false,
    "positionX": 1,
    "positionY": 0
  }
]
```

### Get Available Stalls (Public)
```http
GET /api/stalls/available
```

### Get Stall by ID (Public)
```http
GET /api/stalls/{id}
```

---

## Reservation Endpoints

### Create Reservation (Protected)
```http
POST /api/reservations
```
```json
{
  "userId": 1,
  "stallIds": [1, 2, 3]
}
```
**Response:** `200 OK` — list of created reservations

**Rules:**
- Max 3 stalls per user
- Cannot reserve already-reserved stalls
- Email confirmation sent on success (TODO)
- QR code generated per reservation (TODO)

### Get All Reservations (Protected)
```http
GET /api/reservations
```

### Get Reservations by User (Protected)
```http
GET /api/reservations/user/{userId}
```

---

## Genre Endpoints

### Add Genre (Protected)
```http
POST /api/genres
```
```json
{
  "userId": 1,
  "name": "Fiction"
}
```

### Get Genres by User (Protected)
```http
GET /api/genres/user/{userId}
```

---

## Employee Portal Endpoints

### Dashboard Stats (Protected)
```http
GET /api/employee/dashboard
```
**Response:** `200 OK`
```json
{
  "totalStalls": 20,
  "reservedStalls": 5,
  "availableStalls": 15,
  "totalUsers": 3,
  "totalReservations": 8
}
```

### All Reservations (Protected)
```http
GET /api/employee/reservations
```

---

## User Endpoints

### Get All Users (Protected)
```http
GET /api/users
```

### Get User by ID (Protected)
```http
GET /api/users/{id}
```

---

## Error Responses

```json
{
  "error": "Stall already reserved: A1"
}
```

| Code | Meaning            |
|------|--------------------|
| 200  | Success            |
| 400  | Bad request        |
| 401  | Unauthorized       |
| 403  | Forbidden          |
| 404  | Not found          |
| 500  | Server error       |

---

**Roles:** `ADMIN`, `VENDOR`  
**Database:** H2 in-memory (`jdbc:h2:mem:bookfair`)  
**H2 Console:** `http://localhost:8080/h2-console` (user: `sa`, no password)
