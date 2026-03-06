import api from './client';
import {
    PageEnvelope,
    EventStall,
    Event,
    Hall,
    StallTemplate,
    StallSize,
    StallCategory,
    AdminDashboardStats,
    AuditLog,
    SystemHealth,
    Reservation,
    Venue,
    Building,
    MapZone,
    MapInfluence,
    putHallRequest,
    PhysicalConstraint,
    EventStallAdminResponse
} from '../types/api';

interface RefundResponse {
    id: number;
    status: 'CANCELLED_PENDING_MANUAL_REFUND';
    refundTxId: string;
    refundedAt: string;
    reason: string;
}

export const adminApi = {
    // ─── AUDIT LOGS ───────────────────────────────────────────────
    getAuditLogs: async (entityType?: string, page = 0, actorId?: number): Promise<PageEnvelope<AuditLog>> => {
        const response = await api.get<PageEnvelope<AuditLog>>('/admin/audit-logs', {
            params: { entityType, page, actorId }
        });
        return response.data;
    },

    // ─── SYSTEM HEALTH ────────────────────────────────────────────
    getHealth: async (): Promise<SystemHealth> => {
        const response = await api.get<SystemHealth>('/system/health');
        return response.data;
    },

    // ─── DASHBOARD ────────────────────────────────────────────────
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        const response = await api.get<AdminDashboardStats>('/admin/dashboard/stats');
        return response.data;
    },

    // ─── EVENT MANAGEMENT ────────────────────────────────────────
    getAllEvents: async (): Promise<Event[]> => {
        const response = await api.get<Event[]>('/admin/events');
        return response.data;
    },

    getEventById: async (id: number): Promise<Event> => {
        const response = await api.get<Event>(`/admin/events/${id}`);
        return response.data;
    },

    getEventStalls: async (eventId: number): Promise<EventStallAdminResponse[]> => {
        const response = await api.get<EventStallAdminResponse[]>(`/admin/events/${eventId}/stalls`);
        return response.data;
    },

    createEvent: async (data: Partial<Event>): Promise<Event> => {
        const response = await api.post<Event>('/admin/events', data);
        return response.data;
    },

    deleteEvent: async (id: number): Promise<void> => {
        await api.delete(`/admin/events/${id}`);
    },

    updateEvent: async (id: number, data: Partial<Event>): Promise<Event> => {
        const response = await api.put<Event>(`/admin/events/${id}`, data);
        return response.data;
    },

    changeEventStatus: async (id: number, status: string): Promise<Event> => {
        const response = await api.put<Event>(`/admin/events/${id}/status`, null, { params: { status } });
        return response.data;
    },

    getEventStats: async (eventId: number): Promise<{ totalStalls: number, reservedStalls: number, revenueCents: number }> => {
        const response = await api.get<{ totalStalls: number, reservedStalls: number, revenueCents: number }>(`/admin/events/${eventId}/stats`);
        return response.data;
    },

    // ─── LAYOUT MANAGEMENT ───────────────────────────────────────
    saveLayout: async (eventId: number, stalls: any[]): Promise<void> => {
        await api.post(`/admin/events/${eventId}/layout`, stalls);
    },

    saveZones: async (eventId: number, zones: Partial<MapZone>[]): Promise<void> => {
        await api.post(`/admin/events/${eventId}/zones`, zones);
    },

    saveInfluences: async (eventId: number, influences: Partial<MapInfluence>[]): Promise<void> => {
        await api.post(`/admin/events/${eventId}/influences`, influences);
    },

    uploadVenueMap: async (eventId: number, file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>(`/admin/events/${eventId}/map`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ─── RESERVATION MANAGEMENT ──────────────────────────────────
    getAllReservations: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/admin/reservations');
        return response.data;
    },

    getReservationById: async (id: number | string): Promise<Reservation> => {
        const response = await api.get<Reservation>(`/admin/reservations/${id}`);
        return response.data;
    },

    confirmPayment: async (reservationId: number): Promise<void> => {
        await api.post(`/admin/reservations/${reservationId}/confirm-payment`);
    },

    cancelReservation: async (reservationId: number, reason = 'Admin cancelled'): Promise<void> => {
        await api.post(`/admin/reservations/${reservationId}/cancel`, null, {
            params: { reason }
        });
    },

    exportReservationsCsv: async (): Promise<void> => {
        const response = await api.get('/admin/reservations/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reservations.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    // ─── REFUNDS ─────────────────────────────────────────────────
    refundReservation: async (reservationId: number, reason: string): Promise<RefundResponse> => {
        const response = await api.post<RefundResponse>('/admin/payments/refund', {
            reservationId,
            reason
        });
        return response.data;
    },

    getPendingRefunds: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/admin/refunds/pending');
        return response.data;
    },

    // ─── HALL MANAGEMENT ─────────────────────────────────────────
    getAllVenues: async (): Promise<Venue[]> => {
        const response = await api.get<Venue[]>('/admin/venues');
        return response.data;
    },

    getBuildingsByVenue: async (venueId: number): Promise<Building[]> => {
        const response = await api.get<Building[]>(`/admin/venues/${venueId}/buildings`);
        return response.data;
    },

    getHallsByBuilding: async (buildingId: number): Promise<Hall[]> => {
        const response = await api.get<Hall[]>(`/admin/buildings/${buildingId}/halls`);
        return response.data;
    },

    getAllHalls: async (): Promise<Hall[]> => {
        const response = await api.get<Hall[]>('/admin/halls');
        return response.data;
    },

    createHall: async (data: Partial<Hall>): Promise<Hall> => {
        const response = await api.post<Hall>('/admin/halls', data);
        return response.data;
    },

    updateHall: async (id: number, data: putHallRequest): Promise<Hall> => {
        const response = await api.put<Hall>(`/admin/halls/${id}`, data);
        return response.data;
    },

    changeHallStatus: async (id: number, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<Hall> => {
        const response = await api.patch<Hall>(`/admin/halls/${id}/status`, { status });
        return response.data;
    },

    archiveHall: async (id: number): Promise<void> => {
        await api.delete(`/admin/halls/${id}`);
    },

    deleteHall: async (id: number): Promise<void> => {
        await api.delete(`/admin/halls/${id}/destroy`);
    },

    updateHallLayout: async (id: number, constraints: PhysicalConstraint[]): Promise<void> => {
        await api.put(`/admin/halls/${id}/layout`, constraints);
    },

    // ─── STALL INVENTORY ─────────────────────────────────────────
    getStallsByHall: async (hallId: number): Promise<StallTemplate[]> => {
        const response = await api.get<StallTemplate[]>(`/admin/halls/${hallId}/stalls`);
        return response.data;
    },

    bulkGenerateStalls: async (hallId: number, params: { count: number, size: StallSize, category: StallCategory, basePriceCents: number }): Promise<StallTemplate[]> => {
        const response = await api.post<StallTemplate[]>(`/admin/halls/${hallId}/stalls/bulk`, null, { params });
        return response.data;
    },

    setStallBlocked: async (hallId: number, stallId: number, blocked: boolean): Promise<StallTemplate> => {
        const response = await api.patch<StallTemplate>(`/admin/halls/${hallId}/stalls/${stallId}/block`, { blocked });
        return response.data;
    },

    updateStallTemplate: async (hallId: number, stallId: number, data: Partial<StallTemplate>): Promise<StallTemplate> => {
        const response = await api.put<StallTemplate>(`/admin/halls/${hallId}/stalls/${stallId}`, data);
        return response.data;
    },

    bulkPriceAdjust: async (hallId: number, percentage: number): Promise<void> => {
        await api.post(`/admin/halls/${hallId}/price-adjust`, { percentage });
    },

    exportStallsCsv: async (hallId: number): Promise<void> => {
        const response = await api.get(`/admin/halls/${hallId}/stalls/export`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `stalls-hall-${hallId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    // ─── PRICING ─────────────────────────────────────────────────
    updateStallPrice: async (stallId: number, baseRateCents: number, multiplier: number): Promise<EventStall> => {
        const response = await api.put<EventStall>(`/admin/stalls/${stallId}/price`, {
            baseRateCents,
            multiplier
        });
        return response.data;
    },
};
