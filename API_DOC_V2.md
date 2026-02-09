# 📘 API Documentation v2 (Proposed Final Version)

> **Production-ready API specification with JWT authentication and RESTful standards**

---

## 🔐 Authentication

All protected routes require JWT Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Token Payload
```json
{
  "sub": "user_id",
  "role": "PUBLISHER | EMPLOYEE | ADMIN",
  "exp": 1234567890
}
```

---

## 📊 Priority Legend (MoSCoW)

| Priority | Meaning | For Evaluation |
|----------|---------|----------------|
| 🔴 **MUST** | Core functionality, required for assignment | Implement first |
| 🟡 **SHOULD** | Important but not critical | Implement if time permits |
| 🟢 **COULD** | Nice enhancements | Bonus points |
| ⚪ **WON'T** | Out of scope | Don't implement |

---

# 🔓 PUBLIC ENDPOINTS (No Auth Required)

## Authentication

### 🔴 MUST: Register Publisher
```http
POST /api/auth/register
```
**Request:**
```json
{
  "businessName": "ABC Books",
  "email": "contact@abcbooks.com",
  "contactPerson": "John Doe",
  "password": "securePassword123"
}
```
**Response:** `201 Created`
```json
{
  "id": 1,
  "businessName": "ABC Books",
  "email": "contact@abcbooks.com",
  "contactPerson": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Errors:**
- `400` - Validation failed
- `409` - Email already exists

---

### 🔴 MUST: Login
```http
POST /api/auth/login
```
**Request:**
```json
{
  "email": "contact@abcbooks.com",
  "password": "securePassword123"
}
```
**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "publisher": {
    "id": 1,
    "businessName": "ABC Books",
    "email": "contact@abcbooks.com"
  }
}
```
**Errors:**
- `401` - Invalid credentials

---

### 🟡 SHOULD: Employee Login
```http
POST /api/auth/employee/login
```
**Request:**
```json
{
  "username": "admin",
  "password": "adminPassword"
}
```
**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "EMPLOYEE"
}
```

---

# 🏪 STALL ENDPOINTS

## Public

### 🔴 MUST: Get All Stalls
```http
GET /api/stalls
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `size` | string | Filter by size: `SMALL`, `MEDIUM`, `LARGE` |
| `available` | boolean | Filter by availability |

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "A1",
    "size": "SMALL",
    "reserved": false,
    "positionX": 1,
    "positionY": 0,
    "dimensions": { "width": 3, "height": 3, "unit": "meters" }
  },
  {
    "id": 2,
    "name": "A2",
    "size": "MEDIUM",
    "reserved": true,
    "positionX": 2,
    "positionY": 0
  }
]
```

---

### 🟢 COULD: Get Stall Details
```http
GET /api/stalls/{id}
```
**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "A1",
  "size": "SMALL",
  "reserved": false,
  "positionX": 1,
  "positionY": 0,
  "dimensions": { "width": 3, "height": 3, "unit": "meters" },
  "pricing": { "amount": 5000, "currency": "LKR" }
}
```

---

# 📝 RESERVATION ENDPOINTS

## Protected (Publisher Role)

### 🔴 MUST: Create Reservation
```http
POST /api/reservations
Authorization: Bearer <token>
```
**Request:**
```json
{
  "stallIds": [1, 2, 3]
}
```
> Note: `publisherId` extracted from JWT token

**Response:** `201 Created`
```json
{
  "reservations": [
    {
      "id": 1,
      "stall": { "id": 1, "name": "A1", "size": "SMALL" },
      "qrCode": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-09T21:00:00Z"
    },
    {
      "id": 2,
      "stall": { "id": 2, "name": "A2", "size": "MEDIUM" },
      "qrCode": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2026-02-09T21:00:00Z"
    }
  ],
  "emailSent": true
}
```
**Errors:**
- `400` - Exceeds max 3 stalls per publisher
- `409` - Stall already reserved
- `401` - Unauthorized

**Business Rules:**
- Maximum 3 stalls per publisher
- Cannot reserve already-reserved stalls
- Email notification sent on success

---

### 🔴 MUST: Get My Reservations
```http
GET /api/reservations/me
Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "publisher": {
    "id": 1,
    "businessName": "ABC Books"
  },
  "reservations": [
    {
      "id": 1,
      "stall": { "id": 1, "name": "A1", "size": "SMALL" },
      "qrCode": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-09T21:00:00Z"
    }
  ],
  "remainingSlots": 2
}
```

---

### 🟢 COULD: Cancel Reservation
```http
DELETE /api/reservations/{id}
Authorization: Bearer <token>
```
**Response:** `204 No Content`

**Errors:**
- `403` - Cannot cancel others' reservations
- `400` - Cannot cancel within 24h of event

---

### 🔴 MUST: Get QR Code Image
```http
GET /api/reservations/{id}/qr
Authorization: Bearer <token>
```
**Response:** `200 OK`
```
Content-Type: image/png
<binary PNG data>
```

---

### 🟡 SHOULD: Download All QR Codes (ZIP)
```http
GET /api/reservations/me/qr-bundle
Authorization: Bearer <token>
```
**Response:** `200 OK`
```
Content-Type: application/zip
Content-Disposition: attachment; filename="qr-codes.zip"
```

---

# 📚 GENRE ENDPOINTS

## Protected (Publisher Role)

### 🔴 MUST: Add Genre
```http
POST /api/genres
Authorization: Bearer <token>
```
**Request:**
```json
{
  "name": "Fiction"
}
```
**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Fiction"
}
```

---

### 🟡 SHOULD: Add Multiple Genres (Bulk)
```http
POST /api/genres/bulk
Authorization: Bearer <token>
```
**Request:**
```json
{
  "genres": ["Fiction", "Non-Fiction", "Children's Books"]
}
```
**Response:** `201 Created`
```json
{
  "added": [
    { "id": 1, "name": "Fiction" },
    { "id": 2, "name": "Non-Fiction" },
    { "id": 3, "name": "Children's Books" }
  ]
}
```

---

### 🔴 MUST: Get My Genres
```http
GET /api/genres/me
Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "genres": [
    { "id": 1, "name": "Fiction" },
    { "id": 2, "name": "Non-Fiction" }
  ]
}
```

---

### 🟢 COULD: Delete Genre
```http
DELETE /api/genres/{id}
Authorization: Bearer <token>
```
**Response:** `204 No Content`

---

### 🟢 COULD: Get Genre Suggestions
```http
GET /api/genres/suggestions
```
**Response:** `200 OK`
```json
{
  "suggestions": [
    "Fiction",
    "Non-Fiction", 
    "Children's Books",
    "Educational",
    "Comics & Graphic Novels",
    "Poetry",
    "Religious",
    "Self-Help",
    "Travel",
    "Cookbooks"
  ]
}
```

---

# 👔 EMPLOYEE PORTAL ENDPOINTS

## Protected (Employee Role)

### 🔴 MUST: Get Dashboard Statistics
```http
GET /api/employee/dashboard
Authorization: Bearer <employee_token>
```
**Response:** `200 OK`
```json
{
  "stats": {
    "totalStalls": 20,
    "reservedStalls": 12,
    "availableStalls": 8,
    "totalPublishers": 10,
    "totalReservations": 15,
    "occupancyRate": 60.0
  },
  "recentReservations": [
    {
      "id": 15,
      "publisher": "ABC Books",
      "stall": "A5",
      "createdAt": "2026-02-09T21:00:00Z"
    }
  ]
}
```

---

### 🔴 MUST: Get All Reservations
```http
GET /api/employee/reservations
Authorization: Bearer <employee_token>
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 0) |
| `size` | int | Items per page (default: 20) |
| `search` | string | Search by publisher name or stall |
| `sortBy` | string | Sort field: `createdAt`, `stall`, `publisher` |

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "publisher": {
        "id": 1,
        "businessName": "ABC Books",
        "email": "contact@abcbooks.com",
        "contactPerson": "John Doe"
      },
      "stall": { "id": 1, "name": "A1", "size": "SMALL" },
      "qrCode": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-09T21:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45,
  "totalPages": 3
}
```

---

### 🔴 MUST: Get All Publishers
```http
GET /api/employee/publishers
Authorization: Bearer <employee_token>
```
**Response:** `200 OK`
```json
{
  "publishers": [
    {
      "id": 1,
      "businessName": "ABC Books",
      "email": "contact@abcbooks.com",
      "contactPerson": "John Doe",
      "reservationCount": 2,
      "genres": ["Fiction", "Non-Fiction"]
    }
  ]
}
```

---

### 🟡 SHOULD: Export Reservations CSV
```http
GET /api/employee/reservations/export
Authorization: Bearer <employee_token>
```
**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="reservations-2026-02-09.csv"
```

---

### 🟡 SHOULD: Verify QR Code
```http
POST /api/employee/verify-qr
Authorization: Bearer <employee_token>
```
**Request:**
```json
{
  "qrCode": "550e8400-e29b-41d4-a716-446655440000"
}
```
**Response:** `200 OK`
```json
{
  "valid": true,
  "reservation": {
    "id": 1,
    "publisher": "ABC Books",
    "stall": "A1",
    "contactPerson": "John Doe"
  }
}
```
**Errors:**
- `404` - QR code not found

---

### 🟢 COULD: Manually Create Reservation (Walk-in)
```http
POST /api/employee/reservations
Authorization: Bearer <employee_token>
```
**Request:**
```json
{
  "publisherId": 1,
  "stallIds": [5]
}
```

---

### 🟢 COULD: Get Stall Map Data
```http
GET /api/employee/stall-map
Authorization: Bearer <employee_token>
```
**Response:** `200 OK`
```json
{
  "rows": 4,
  "columns": 5,
  "stalls": [
    {
      "id": 1,
      "name": "A1",
      "positionX": 1,
      "positionY": 0,
      "reserved": true,
      "publisher": "ABC Books"
    }
  ]
}
```

---

# 🛡️ ADMIN ENDPOINTS (Future)

## Protected (Admin Role)

### ⚪ WON'T: Manage Stalls
```http
POST   /api/admin/stalls        # Create stall
PUT    /api/admin/stalls/{id}   # Update stall
DELETE /api/admin/stalls/{id}   # Delete stall
```

### ⚪ WON'T: Manage Employees
```http
GET    /api/admin/employees
POST   /api/admin/employees
DELETE /api/admin/employees/{id}
```

---

# 📋 Implementation Checklist

## v1 (Current - No Auth)
| Priority | Endpoint | Status |
|----------|----------|--------|
| 🔴 MUST | `POST /api/publishers` | ✅ Done |
| 🔴 MUST | `GET /api/stalls` | ✅ Done |
| 🔴 MUST | `POST /api/reservations` | ✅ Done |
| 🔴 MUST | `GET /api/reservations` | ✅ Done |
| 🔴 MUST | `POST /api/genres` | ✅ Done |
| 🔴 MUST | `GET /api/genres/publisher/{id}` | ✅ Done |

## v2 (Proposed - With Auth)
| Priority | Endpoint | Status |
|----------|----------|--------|
| 🔴 MUST | `POST /api/auth/register` | ⬜ TODO |
| 🔴 MUST | `POST /api/auth/login` | ⬜ TODO |
| 🔴 MUST | `GET /api/reservations/me` | ⬜ TODO |
| 🔴 MUST | `GET /api/reservations/{id}/qr` | ⬜ TODO |
| 🔴 MUST | `GET /api/employee/dashboard` | ⬜ TODO |
| 🟡 SHOULD | `POST /api/auth/employee/login` | ⬜ TODO |
| 🟡 SHOULD | `POST /api/genres/bulk` | ⬜ TODO |
| 🟡 SHOULD | `GET /api/employee/reservations/export` | ⬜ TODO |
| 🟡 SHOULD | `POST /api/employee/verify-qr` | ⬜ TODO |
| 🟡 SHOULD | `GET /api/reservations/me/qr-bundle` | ⬜ TODO |
| 🟢 COULD | `DELETE /api/reservations/{id}` | ⬜ TODO |
| 🟢 COULD | `DELETE /api/genres/{id}` | ⬜ TODO |
| 🟢 COULD | `GET /api/genres/suggestions` | ⬜ TODO |
| 🟢 COULD | `GET /api/stalls/{id}` | ⬜ TODO |
| 🟢 COULD | `POST /api/employee/reservations` | ⬜ TODO |

---

# 📐 Standard Response Formats

## Success Response
```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

## Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "timestamp": "2026-02-09T21:00:00Z"
}
```

## Pagination Response
```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

---

# 🔧 HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200` | OK | Successful GET, PUT |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation error |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Valid token, no permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource |
| `500` | Server Error | Unexpected error |

---

**Document Version:** 2.0  
**Last Updated:** 2026-02-09  
**Authors:** Project Lead
