import api from './client'
import type { Reservation, ReservationRequest } from '../types'

export const reservationApi = {
    /**
     * Creates reservations for the selected stalls
     */
    create: async (data: ReservationRequest): Promise<Reservation[]> => {
        if (!data.stallIds || data.stallIds.length === 0) {
            throw new Error("Please select at least one stall.");
        }
        const response = await api.post<Reservation[]>('/reservations', data)
        return response.data
    },

    getByUser: async (userId: number): Promise<Reservation[]> => {
        if (!userId) throw new Error("Authentication required: User ID missing");
        const response = await api.get<Reservation[]>(`/reservations/user/${userId}`)
        return response.data
    },

    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations')
        return response.data
    },
}