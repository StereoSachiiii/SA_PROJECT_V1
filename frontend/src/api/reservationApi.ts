import api from './client'
import type { Reservation, ReservationRequest } from '../types'

/**
 * Reservation API calls
 * 
 * TODO [FRONTEND DEV 2]: Add optimistic updates
 */
export const reservationApi = {
    create: async (data: ReservationRequest): Promise<Reservation[]> => {
        const response = await api.post<Reservation[]>('/reservations', data)
        return response.data
    },

    getByUser: async (userId: number): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>(`/reservations/user/${userId}`)
        return response.data
    },

    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations')
        return response.data
    },
}
