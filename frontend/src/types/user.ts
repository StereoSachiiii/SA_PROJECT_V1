export interface User {
    id: number
    username: string
    email: string
    businessName: string
    contactNumber: string
    role: 'ADMIN' | 'VENDOR'
}

export interface AuthResponse {
    token: string
    id: number
    username: string
    email: string
    businessName: string
    roles: string[]
}

export interface UserRequest {
    username: string
    password?: string
    email: string
    businessName: string
    contactNumber: string
    address?: string
    role?: 'ADMIN' | 'VENDOR'
}

export interface LoginRequest {
    username: string
    password: string
}