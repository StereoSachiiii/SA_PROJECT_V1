import api from './client';
import {
    CheckInRequest,
    CheckInResponse,
    CheckInOverrideRequest,
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

    // SCAN QR (Check-In)
    checkIn: async (data: CheckInRequest): Promise<CheckInResponse> => {
        const response = await api.post<CheckInResponse>('/employee/check-in', data);
        return response.data;
    },

    // FORCE CHECK-IN
    forceCheckIn: async (data: CheckInOverrideRequest): Promise<CheckInResponse> => {
        const response = await api.post<CheckInResponse>('/employee/force-check-in', data);
        return response.data;
    },

    // VALIDATE QR (Dry Run)
    validateQr: async (qrCode: string): Promise<any> => {
        const response = await api.post('/employee/qr/validate', { qrCode });
        return response.data;
    },

    // SEARCH RESERVATIONS
    search: async (query: string, page = 0): Promise<PageEnvelope<Reservation>> => {
        const response = await api.get<PageEnvelope<Reservation>>('/employee/search', {
            params: { q: query, page }
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

    // CANCEL RESERVATION (e.g. User request at gate)
    cancelReservation: async (id: number): Promise<void> => {
        await api.delete(`/employee/reservations/${id}`);
    }
};
