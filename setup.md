# Project Setup Guide

Follow these steps to get the Colombo Bookfair Stall Reservation System running locally.

## Prerequisites
- **Java**: JDK 17 or 21
- **Node.js**: v18+ (with npm)
- **PostgreSQL**: v14+
- **Maven**: 3.8+

## Database Setup
1. Create a PostgreSQL database named `bookfair_db`.
2. Configure environment variables (or update `application.properties`):
   - `DB_URL`: jdbc:postgresql://localhost:5432/bookfair_db
   - `DB_USERNAME`: [your_username]
   - `DB_PASSWORD`: [your_password]

## Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and run the service:
   ```bash
   mvn spring-boot:run
   ```
   *Note: The database will automatically seed on initial startup.*

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials
- **Admin**: `admin` / `admin123`
- **Vendor**: `vendor` / `vendor123`
- **Employee**: `employee` / `employee123`
