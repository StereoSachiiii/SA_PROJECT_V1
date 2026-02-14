/**
 * Type definitions for the API
 * These match the backend entities
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
    reserved: boolean
    positionX: number
    positionY: number
}

export interface Reservation {
    id: number
    user: User
    stall: Stall
    qrCode: string
    createdAt: string
}

export interface Genre {
    id: number
    name: string
    user: User
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
