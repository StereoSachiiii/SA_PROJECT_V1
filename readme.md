# Colombo Bookfair Stall Reservation System

A comprehensive web application for managing stall reservations, floor layouts, and entry passes for large-scale book fairs.

## Key Features

### 🏢 Stall Management
- **Interactive Stall Designer**: Drag-and-drop-style layout creation for administrators.
- **Smart Scoping**: Hall-specific zones and influences (Walkways, Stages, Entrances).
- **Intelligent Pricing**: Automatic price calculation based on hall tiers, booth sizes, and proximity to key zones.

### 🎫 Booking & Reservations
- **Public Map**: Real-time availability view for prospective vendors.
- **Vendor Dashboard**: Manage bookings, track payment status, and update profile details.
- **Entry Pass System**: Secure QR-code-based tickets for venue access, with direct PDF/Image download functionality.

### 📊 Admin & Operations
- **Revenue Analytics**: Real-time tracking of total revenue and booking density.
- **Check-in System**: QR scanning for venue entry validation and logs.
- **Role-Based Access Control**: Granular permissions for Admins, Employees, and Vendors.

## Architecture

- **Frontend**: React 18 with Vite, TailwindCSS, and Axios for API communication.
- **Backend**: Spring Boot 3, Spring Security (JWT), Spring Data JPA (PostgreSQL).
- **Security**: JWT-based stateless authentication with rate-limiting and conflict protection.
- **Communication**: Thymeleaf-driven email templates for reservation confirmations.

---
*Developed with contributions from: Nihad, Anushka, Ramesh, Dilum, Sachin, and Nethmi.*
