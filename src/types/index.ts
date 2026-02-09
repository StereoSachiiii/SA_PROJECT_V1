/**
 * Type definitions for the API
 * These match the backend entities
 */

export interface Publisher {
    id: number
    businessName: string
    email: string
    contactPerson: string
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
    publisher: Publisher
    stall: Stall
    qrCode: string
    createdAt: string
}

export interface Genre {
    id: number
    name: string
    publisher: Publisher
}

// Request DTOs
export interface PublisherRequest {
    businessName: string
    email: string
    contactPerson: string
}

export interface ReservationRequest {
    publisherId: number
    stallIds: number[]
}

export interface GenreRequest {
    publisherId: number
    name: string
}
