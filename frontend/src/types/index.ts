/**
 * Type definitions for the API
 * These match the backend DTOs (not entities)
 */

export interface User {
    id: number
    username: string
    email: string
    businessName: string
    contactNumber: string
    role: 'ADMIN' | 'VENDOR'
}

export interface Stall {
    id: number
    name: string
    size: 'SMALL' | 'MEDIUM' | 'LARGE'
    priceCents?: number
    width?: number
    height?: number
    reserved: boolean
    occupiedBy?: string
    positionX: number
    positionY: number
    colSpan?: number
    rowSpan?: number
}

export interface Reservation {
    id: number
    user: User
    stall: Stall
    qrCode: string
    status: 'CONFIRMED' | 'CANCELLED'
    emailSent: boolean
    createdAt: string
}

export interface Genre {
    id: number
    name: string
}

// Auth
export interface AuthResponse {
    token: string
    id: number
    username: string
    email: string
    businessName: string
    roles: string[]
}

// Request DTOs
export interface UserRequest {
    username: string
    password?: string
    email: string
    businessName: string
    contactNumber: string
    address?: string
    role?: 'ADMIN' | 'VENDOR'
}

export interface ReservationRequest {
    userId: number
    stallIds: number[]
}

export interface GenreRequest {
    userId: number
    name: string
}
