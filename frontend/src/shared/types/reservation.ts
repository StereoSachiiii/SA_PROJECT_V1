import { User } from './user';
import { Stall } from './stall';

export interface Reservation {
    id: number
    user: User
    stall: Stall
    qrCode: string
    status: 'CONFIRMED' | 'CANCELLED'
    emailSent: boolean
    createdAt: string
}

export interface ReservationRequest {
    userId: number
    stallIds: number[]
}
