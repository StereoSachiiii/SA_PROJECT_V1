# Colombo International Bookfair - Stall Reservation System

## Project Structure
- `backend` branch - Spring Boot REST API
- `frontend` branch - React + Vite + TanStack Query + Tailwind

## Schema
```
Publisher (id, businessName, email, contactPerson)
    └── Genre (id, publisherId, name)
    └── Reservation (id, publisherId, stallId, qrCode, createdAt)
            └── Stall (id, name, size, reserved, positionX, positionY)
```

## Team
- 3 Backend Developers
- 3 Frontend Developers  
- 1-2 Merge Reviewers

## Branches
- `main` - Production ready code (protected)
- `backend` - Backend development
- `frontend` - Frontend development
