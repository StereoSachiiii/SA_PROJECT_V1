import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '@/shared/api/adminApi';

export function useStallPricing() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/public/events');
            const data = response.ok ? await response.json() : [];
            const eventList = Array.isArray(data) ? data : data.content || [];
            setEvents(eventList);
            if (eventList.length > 0) {
                setSelectedEventId(eventList[0].id);
            }
        } catch (err) {
            setError('Failed to load events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedEventId) loadStallsForEvent(selectedEventId);
    }, [selectedEventId]);

    const loadStallsForEvent = async (eventId: number) => {
        setLoading(true);
        setError('');
        try {
            const stallList = await fetch(`/api/v1/admin/events/${eventId}/stalls`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).then(r => r.json());
            setStalls(Array.isArray(stallList) ? stallList : []);
        } catch (err) {
            setError('Failed to load stalls for this event.');
            setStalls([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number, base: number, mult: number) => {
        try {
            await adminApi.updateStallPrice(id, base, mult);
            setStalls(prev => prev.map(s => s.id === id
                ? { ...s, finalPriceCents: Math.round(base * mult), pricingVersion: 'MANUAL' }
                : s
            ));
        } catch (err) {
            throw err;
        }
    };

    const stats = useMemo(() => {
        if (stalls.length === 0) return { avg: 0, max: 1, count: stalls.length };
        const prices = stalls.map(s => s.finalPriceCents || 0).filter(p => p > 0);
        const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const max = prices.length > 0 ? Math.max(...prices) : 0;
        return { avg, max, count: stalls.length };
    }, [stalls]);

    const pricingStalls = stalls.map(s => ({
        id: s.id,
        name: `Stall #${s.id}`,
        templateName: s.pricingVersion || 'Standard',
        baseRateCents: s.finalPriceCents || 0,
        multiplier: 1.0,
    }));

    return {
        events, selectedEventId, setSelectedEventId,
        stalls, loading, error,
        handleUpdate, stats, pricingStalls
    };
}
