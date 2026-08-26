import api from './client'
import type { Reservation, ReservationRequest } from '../types'

export const reservationApi = {
    create: async (data: ReservationRequest): Promise<Reservation[]> => {
        const response = await api.post<Reservation[]>('/reservations', data)
        return response.data
    },

    getMyReservations: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations/my-reservations')
        return response.data
    },

    getAdminReservations: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/admin/reservations')
        return response.data
    },

    getByUser: async (userId: number): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>(`/v1/vendor/reservations/user/${userId}`)
        return response.data
    },

    getById: async (id: number): Promise<Reservation> => {
        const response = await api.get<Reservation>(`/reservations/${id}`)
        return response.data
    },

    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/v1/vendor/reservations')
        return response.data
    },

    cancel: async (id: number): Promise<void> => {
        await api.delete(`/reservations/${id}`)
    },

    requestRefund: async (id: number, reason: string): Promise<void> => {
        await api.post(`/reservations/request-refund/${id}`, null, {
            params: { reason }
        })
    },
}
