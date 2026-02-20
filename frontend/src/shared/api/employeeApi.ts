import api from './client';
import {
    CheckInResponse,
    PageEnvelope,
    Reservation,
    DashboardStats
} from '../types/api';

export const employeeApi = {
    // DASHBOARD STATS
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/employee/dashboard');
        return response.data;
    },

    // LOOKUP RESERVATION (by QR or ID)
    lookupReservation: async (qrOrId: string): Promise<{ valid: boolean; reservationId: number; businessName: string; stallName: string; status: string; message: string }> => {
        const response = await api.get<{ valid: boolean; reservationId: number; businessName: string; stallName: string; status: string; message: string }>(`/employee/reservations/${qrOrId}`);
        return response.data;
    },

    // ADMIT RESERVATION (record check-in)
    admitReservation: async (reservationId: number): Promise<CheckInResponse> => {
        const response = await api.post<CheckInResponse>(`/employee/reservations/${reservationId}/admit`);
        return response.data;
    },

    // GET TEST QR CODE
    getTestQrCode: async (): Promise<{ qrCode: string; message: string }> => {
        const response = await api.get<{ qrCode: string; message: string }>('/employee/qr/test');
        return response.data;
    },

    // SEARCH RESERVATIONS
    search: async (query: string, page = 0, status?: string, eventId?: number): Promise<PageEnvelope<Reservation>> => {
        const response = await api.get<PageEnvelope<Reservation>>('/employee/search', {
            params: { q: query, page, status, eventId }
        });
        return response.data;
    },

    // EXPORT ATTENDANCE (Blob)
    exportAttendance: async (): Promise<Blob> => {
        const response = await api.get('/employee/attendance/export', {
            responseType: 'blob'
        });
        return response.data;
    },

    // FORCE CHECK-IN (Admin Override)
    forceCheckIn: async (data: { reservationId: number; adminOverrideCode: string; reason: string }): Promise<CheckInResponse> => {
        const response = await api.post<CheckInResponse>('/employee/force-check-in', data);
        return response.data;
    },

    // CANCEL RESERVATION (e.g. User request at gate)
    cancelReservation: async (id: number): Promise<void> => {
        await api.delete(`/employee/reservations/${id}`);
    }
};
