import api from './client';
import {
    PageEnvelope,
    EventStall,
    Event
} from '../types/api';

interface AuditLog {
    id: number;
    actorId: number;
    action: string;
    entityType: string;
    entityId: number;
    timestamp: string;
    metadata: any;
}

interface RefundResponse {
    id: number;
    status: 'REFUNDED';
    refundTxId: string;
    refundedAt: string;
}

interface SystemHealth {
    database: string;
    paymentGateway: string;
    mailService: string;
    uptimeSeconds: number;
    usedMemoryBytes: number;
    totalMemoryBytes: number;
    maxMemoryBytes: number;
    activeThreads: number;
    latencyMs: number;
}

export const adminApi = {
    // AUDIT LOGS
    getAuditLogs: async (entityType?: string, page = 0): Promise<PageEnvelope<AuditLog>> => {
        const response = await api.get<PageEnvelope<AuditLog>>('/admin/audit/logs', {
            params: { entityType, page }
        });
        return response.data;
    },

    // MANUAL REFUND
    refundReservation: async (reservationId: number, reason: string): Promise<RefundResponse> => {
        const response = await api.post<RefundResponse>('/admin/payments/refund', {
            reservationId,
            reason
        });
        return response.data;
    },
    // UPDATE PRICE
    updateStallPrice: async (stallId: number, baseRateCents: number, multiplier: number): Promise<EventStall> => {
        const response = await api.patch<EventStall>(`/admin/stalls/${stallId}/price`, {
            baseRateCents,
            multiplier
        });
        return response.data;
    },

    // SYSTEM HEALTH
    getHealth: async (): Promise<SystemHealth> => {
        const response = await api.get<SystemHealth>('/system/health');
        return response.data;
    },

    // EVENT MANAGEMENT
    createEvent: async (data: Partial<Event>): Promise<Event> => {
        const response = await api.post<Event>('/admin/events', data);
        return response.data;
    },

    deleteEvent: async (id: number): Promise<void> => {
        await api.delete(`/admin/events/${id}`);
    },

    // EVENT STATS
    getEventStats: async (eventId: number): Promise<any> => {
        const response = await api.get(`/admin/events/${eventId}/stats`);
        return response.data;
    },

    // LAYOUT MANAGEMENT
    saveLayout: async (eventId: number, stalls: Partial<EventStall>[]): Promise<EventStall[]> => {
        const response = await api.post<EventStall[]>(`/admin/events/${eventId}/stalls`, stalls);
        return response.data;
    },

    uploadVenueMap: async (eventId: number, file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>(`/admin/events/${eventId}/map`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
};
