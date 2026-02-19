import api from './client';
import {
    Reservation,
    ReservationRequest,
    User
} from '../types/api';

export const vendorApi = {
    // ATOMIC BATCH BOOKING
    createReservation: async (data: ReservationRequest): Promise<Reservation[]> => {
        const response = await api.post<Reservation[]>('/vendor/reservations', data);
        return response.data;
    },

    // GET MY RESERVATIONS
    getMyReservations: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/vendor/reservations/me');
        return response.data;
    },

    // CANCEL RESERVATION
    cancelReservation: async (id: number): Promise<void> => {
        await api.delete(`/vendor/reservations/${id}`);
    },

    // CHECK LIMITS
    getAvailableCount: async (eventId?: number): Promise<{ limit: number, used: number, remaining: number }> => {
        const response = await api.get('/vendor/reservations/available-count', {
            params: { eventId }
        });
        return response.data;
    },

    // GET PROFILE
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/vendor/profile');
        return response.data;
    },

    // UPDATE PROFILE
    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.patch<User>('/vendor/profile', data);
        return response.data;
    }
};
