import { useState, useEffect, useMemo } from 'react';
import { formatNumber } from '@/shared/utils/format';
import { adminApi } from '@/shared/api/adminApi';
import PricingTable from '@/apps/admin/components/Pricing/PricingTable';
import { Tag, TrendingUp, DollarSign, Database, AlertCircle } from 'lucide-react';

export default function StallPricingPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load events on mount to let admin pick which event's stalls to price
    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            // Use the dashboard stats which gives us a list of events indirectly
            // Fetch all halls first then get events from stalls via the event endpoint
            // Actually, fetch events from the admin dashboard — we'll get them from the public endpoint
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
            // The 'data' variable from adminApi.getEventStats(eventId) was unused.
            // If it's meant to be used, it should be integrated into the state or logic.
            // For now, removing the unused declaration.
            // const data = await adminApi.getEventStats(eventId);
            // Also fetch the actual stall list
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

    // Map EventStall shape to what PricingTable expects
    const pricingStalls = stalls.map(s => ({
        id: s.id,
        name: s.templateId ? `Stall #${s.id}` : `Stall #${s.id}`,
        templateName: s.pricingVersion || 'Standard',
        baseRateCents: s.finalPriceCents || 0,
        multiplier: 1.0,
    }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stall Pricing</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-1">Manage Base Rates and Multipliers</p>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-md text-white font-bold text-[10px] uppercase flex items-center gap-2">
                    <Database size={12} />
                    Live Database
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* Event Selector */}
            {events.length > 1 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Select Event</label>
                    <select
                        className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedEventId || ''}
                        onChange={e => setSelectedEventId(Number(e.target.value))}
                    >
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title || ev.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-blue-600 mb-4">
                        <DollarSign size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Average Price</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        LKR {stats.avg > 0 ? formatNumber(stats.avg / 100) : '—'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-purple-600 mb-4">
                        <TrendingUp size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Highest Price</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        LKR {stats.max > 0 ? formatNumber(stats.max / 100) : '—'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-amber-600 mb-4">
                        <Tag size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Coverage</h4>
                        <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">Dynamic</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.count} Stalls</p>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 font-bold text-[10px] uppercase mt-4">Loading Pricing Data...</p>
                </div>
            ) : pricingStalls.length === 0 ? (
                <div className="p-20 text-center opacity-40">
                    <p className="text-gray-400 font-bold text-[10px] uppercase">No stalls found for this event. Generate stalls in the Stall Inventory page first.</p>
                </div>
            ) : (
                <PricingTable stalls={pricingStalls} onUpdate={handleUpdate} />
            )}
        </div>
    );
}
