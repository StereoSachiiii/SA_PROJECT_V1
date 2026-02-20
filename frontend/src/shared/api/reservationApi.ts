import api from './client'
import type { Reservation, ReservationRequest } from '../types'

/**
 * Reservation API calls
 * 
 * TODO [FRONTEND DEV 2]: Add optimistic updates
 */
export const reservationApi = {
    create: async (data: ReservationRequest): Promise<Reservation[]> => {
        const response = await api.post<Reservation[]>('/vendor/reservations', data)
        return response.data
    },

    getByUser: async (userId: number): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>(`/vendor/reservations/user/${userId}`)
        return response.data
    },

    getById: async (id: number): Promise<Reservation> => {
        const response = await api.get<Reservation>(`/vendor/reservations/${id}`)
        return response.data
    },

    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/vendor/reservations')
        return response.data
    },

    cancel: async (id: number): Promise<void> => {
        await api.delete(`/vendor/reservations/${id}`)
    },

    requestRefund: async (id: number, reason: string): Promise<void> => {
        await api.post(`/vendor/reservations/request-refund/${id}`, null, {
            params: { reason }
        })
    },
}
