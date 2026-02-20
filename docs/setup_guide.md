# Developer Setup Guide

Welcome to the **Saffron App (SA_PROJECT)** setup guide. This document will help you get your local development environment up and running.

## 🛠 Prerequisites

Ensure you have the following installed on your system:

- **Java 17+** (OpenJDK recommended)
- **Node.js 18+** (LTS recommended)
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Redis** (optional, recommended for caching)

---

## 🚀 Backend Setup (Spring Boot)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Configure Environment Variables:**
    Copy the example environment file and update it with your local credentials:
    ```bash
    cp .env.example .env
    ```
    *Required variables in `.env`:*
    - `DB_URL`: `jdbc:postgresql://localhost:5432/bookfair`
    - `DB_USERNAME`: Your PG username
    - `DB_PASSWORD`: Your PG password
    - `JWT_SECRET`: A long random string (HS256)

3.  **Database Initialization:**
    Create a database named `bookfair` in PostgreSQL.

4.  **Build and Run:**
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    The API will be available at `http://localhost:8080`.

---

## 💻 Frontend Setup (React + Vite)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `frontend` directory if you need to override defaults:
    - `VITE_API_URL`: Set to `http://localhost:8080/api/v1`

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

---

## 🧪 Seeding Data

By default, the application is set to `spring.jpa.hibernate.ddl-auto=update`. To seed initial data (venues, stalls, admins):

1.  Check `backend/src/main/resources/application.properties`.
2.  Set `spring.sql.init.mode=always` temporarily or run the `data.sql` script manually against your database.
3.  **Default Credentials:**
    - **Admin:** `admin` / `admin123`
    - **Vendor:** `vendor` / `vendor123`

---

## ❓ Troubleshooting

- **Database Connection Issues:** Ensure PostgreSQL is running and the `bookfair` database exists.
- **CORS Errors:** Ensure `FRONTEND_URL` in the backend `.env` matches your Vite dev server address.
- **Build Failures:** Try clearing `node_modules` or running `mvn clean`.
