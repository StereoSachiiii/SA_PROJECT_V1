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
