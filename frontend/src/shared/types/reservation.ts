import { User } from './user';
import { Stall } from './stall';

export interface Reservation {
    id: number
    user?: User
    stall?: Stall
    stalls?: string[]
    eventName?: string
    reservationDate?: string
    stallType?: string
    stallSize?: string
    stallCount?: number
    businessCategory?: string
    specialComments?: string
    qrCode: string
    status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'PENDING_REFUND' | 'CONFIRMED'
    emailSent: boolean
    createdAt: string
}

export interface ReservationRequest {
    eventName: string
    reservationDate: string
    stallType: 'STANDARD' | 'PREMIUM' | 'CORNER'
    stallSize: 'SMALL' | 'MEDIUM' | 'LARGE'
    stallCount: number
    businessCategory: string
    specialComments?: string
    stallIds?: number[]
    eventId?: number
}
