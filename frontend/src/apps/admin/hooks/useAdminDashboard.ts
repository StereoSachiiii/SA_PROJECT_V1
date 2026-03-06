import { useState, useEffect } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { PageEnvelope, Event, AdminDashboardStats, AuditLog, SystemHealth } from '@/shared/types/api';

export function useAdminDashboard() {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVENTS'>('OVERVIEW');
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [auditLogs, setAuditLogs] = useState<PageEnvelope<AuditLog> | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Event Management State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [eventData, setEventData] = useState<Partial<Event>>({
        name: '',
        location: 'BMICH',
        status: 'UPCOMING',
        startDate: new Date().toISOString().split('T')[0] + 'T00:00:00',
        endDate: new Date().toISOString().split('T')[0] + 'T23:59:59'
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [h, a, e, s] = await Promise.all([
                adminApi.getHealth().catch(() => ({
                    database: 'DOWN',
                    paymentGateway: 'DOWN',
                    mailService: 'DOWN',
                    uptimeSeconds: 0,
                    usedMemoryBytes: 0,
                    totalMemoryBytes: 0,
                    maxMemoryBytes: 0,
                    activeThreads: 0,
                    latencyMs: 0
                } as SystemHealth)),
                adminApi.getAuditLogs('RESERVATION', 0).catch((err) => { console.error("AuditLogs Error:", err); return null; }),
                adminApi.getAllEvents().catch((err) => { console.error("AllEvents Error:", err); return []; }),
                adminApi.getDashboardStats().catch((err) => { console.error("Stats Fetch Error:", err); return null; })
            ]);
            setHealth(h);
            setAuditLogs(a);
            setEvents(e);
            setStats(s);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async () => {
        try {
            // Ensure dates are parsed as valid LocalDateTime for Java backend (needs T00:00:00 format, not just YYYY-MM-DD)
            const payload = { ...eventData };
            if (payload.startDate && payload.startDate.length === 10) payload.startDate += 'T00:00:00';
            if (payload.endDate && payload.endDate.length === 10) payload.endDate += 'T23:59:59';

            await adminApi.createEvent(payload);
            setShowCreateModal(false);
            setEventData({
                name: '', location: 'BMICH', status: 'UPCOMING',
                startDate: new Date().toISOString().split('T')[0] + 'T00:00:00',
                endDate: new Date().toISOString().split('T')[0] + 'T23:59:59'
            });
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm('Are you sure? This will delete the event and all stalls.')) return;
        try {
            await adminApi.deleteEvent(id);
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleUpdateEventStatus = async (id: number, status: 'UPCOMING' | 'OPEN' | 'CLOSED') => {
        try {
            await adminApi.changeEventStatus(id, status);
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleStartEdit = (event: Event) => {
        setEventData({
            ...event,
            startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] + 'T00:00:00' : undefined,
            endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] + 'T23:59:59' : undefined
        });
        setShowEditModal(true);
    };

    const handleUpdateEvent = async () => {
        if (!eventData.id) return;
        try {
            const payload = { ...eventData };
            if (payload.startDate && payload.startDate.length === 10) payload.startDate += 'T00:00:00';
            if (payload.endDate && payload.endDate.length === 10) payload.endDate += 'T23:59:59';

            await adminApi.updateEvent(eventData.id, payload);
            setShowEditModal(false);
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return {
        activeTab, setActiveTab,
        health, auditLogs, events, stats, loading,
        showCreateModal, setShowCreateModal,
        showEditModal, setShowEditModal,
        eventData, setEventData,
        loadInitialData,
        handleCreateEvent,
        handleDeleteEvent,
        handleUpdateEventStatus,
        handleStartEdit,
        handleUpdateEvent
    };
}
