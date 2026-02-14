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
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "A1",
    "size": "SMALL",
    "priceCents": 500000,
    "width": 1,
    "height": 1,
    "positionX": 0,
    "positionY": 0,
    "colSpan": 1,
    "rowSpan": 1,
    "reserved": false,
    "occupiedBy": null
  }
]
```

### Get Available Stalls (Public)
```http
GET /api/stalls/available
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
  "stallIds": [1, 2]
}
```
**Response:** `200 OK` — list of `ReservationResponse` objects

**Features:**
- Validates max 3 stalls per user.
- Prevents double-booking.
- Sends confirmation email automatically.
- Generates QR code per reservation.

### Get All Reservations (Protected)
```http
GET /api/reservations
```

### Get Reservations by User (Protected)
```http
GET /api/reservations/user/{userId}
```
**Response Example:**
```json
[
  {
    "id": 1,
    "qrCode": "QR_RES_1_...",
    "createdAt": "2026-02-14T19:00:00",
    "publisherId": 1,
    "businessName": "ABC Books",
    "stallId": 1,
    "stallName": "A1",
    "stallSize": "SMALL"
  }
]
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
**Database:** PostgreSQL (configured in `application.properties`)
