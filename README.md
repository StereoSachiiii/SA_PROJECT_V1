# Colombo International Bookfair — Stall Reservation System

A reservation management system for the Colombo International Bookfair, allowing book publishers and vendors to register and reserve stalls online.

## Architecture

```
Frontend (React + Vite)          Backend (Spring Boot)
├── RegisterPage                 ├── AuthController
├── LoginPage (TODO)             ├── UserController
├── StallMapPage        ──API──► ├── StallController
├── HomePage                     ├── ReservationController
└── EmployeePortalPage           ├── GenreController
                                 └── EmployeeController

                                 Database: H2 (in-memory)
                                 Auth: JWT + Spring Security
```

## Running Locally

**Backend:**
```bash
mvn spring-boot:run
# API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

## Schema

```
User (id, username, email, password, role, businessName, contactNumber)
  ├── Reservation (id, userId, stallId, qrCode, createdAt)
  │       └── Stall (id, name, size, reserved, positionX, positionY)
  └── Genre (id, userId, name)
```

## Branches

| Branch      | Purpose              |
|-------------|----------------------|
| `main`      | Final merged code    |
| `backend`   | Backend development  |
| `frontend`  | Frontend development |

## Team
- 3 Backend Developers (Java/Spring Boot)
- 3 Frontend Developers (React/TypeScript)

See `PROJECT_STATUS.md` for current progress and remaining TODOs.  
See `API_DOC.md` for endpoint documentation.  
See `CONTRIBUTING.md` for team workflow.
