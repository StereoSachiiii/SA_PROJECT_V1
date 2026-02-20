import { useState, useEffect } from 'react';
import { formatCurrency } from '@/shared/utils/format';
import { adminApi } from '@/shared/api/adminApi';
import { publicApi } from '@/shared/api/publicApi';
import { PageEnvelope, Event, AdminDashboardStats, AuditLog, SystemHealth } from '@/shared/types/api';
import { Link } from 'react-router-dom';
import MetricsCard from '@/apps/admin/components/Dashboard/MetricsCard';
import HealthPreview from '@/apps/admin/components/Dashboard/HealthPreview';
import {
    Users,
    Ticket,
    Banknote,
    CalendarDays,
    TrendingUp
} from 'lucide-react';

// Sub-components
import { ActivityLogPreview } from '../components/Dashboard/ActivityLogPreview';
import { EventManagementTable } from '../components/Dashboard/EventManagementTable';
import { EventFormModal } from '../components/Dashboard/EventFormModal';

export default function Dashboard() {
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
        status: 'DRAFT',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        console.info('[Dashboard] Initializing data stream');
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        console.info('[Dashboard] Refreshing metrics, health, and logs');
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
                adminApi.getAuditLogs('RESERVATION', 0),
                publicApi.getActiveEvents(),
                adminApi.getDashboardStats().catch(() => null)
            ]);
            setHealth(h);
            setAuditLogs(a);
            setEvents(e.content);
            setStats(s);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async () => {
        try {
            await adminApi.createEvent(eventData);
            setShowCreateModal(false);
            setEventData({ name: '', location: 'BMICH', status: 'DRAFT' });
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

    const handleUpdateEventStatus = async (id: number, status: 'DRAFT' | 'OPEN' | 'CLOSED') => {
        try {
            await adminApi.updateEvent(id, { status });
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleStartEdit = (event: Event) => {
        setEventData({
            ...event,
            startDate: new Date(event.startDate).toISOString().split('T')[0],
            endDate: new Date(event.endDate).toISOString().split('T')[0]
        });
        setShowEditModal(true);
    };

    const handleUpdateEvent = async () => {
        if (!eventData.id) return;
        try {
            await adminApi.updateEvent(eventData.id, eventData);
            setShowEditModal(false);
            loadInitialData();
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (loading && !health) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Synchronizing Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3 block">Command Intel</span>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">System Console</h1>
                    <p className="text-slate-500 font-medium mt-2">Real-time oversight of all operational vectors.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
                    <button
                        onClick={() => setActiveTab('OVERVIEW')}
                        className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'OVERVIEW' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('EVENTS')}
                        className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'EVENTS' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Operations
                    </button>
                </div>
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="space-y-12">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricsCard
                            title="Total Orders"
                            value={stats?.totalReservations?.toString() || "0"}
                            icon={Ticket}
                            subtitle="Active Stalls"
                            color="blue"
                        />
                        <MetricsCard
                            title="Gross Revenue"
                            value={formatCurrency(stats?.totalRevenueLkr || 0)}
                            icon={Banknote}
                            subtitle="Cleared Funds"
                            color="green"
                        />
                        <MetricsCard
                            title="Active Entities"
                            value={stats?.activeVendors?.toString() || "0"}
                            icon={Users}
                            subtitle="Verified Vendors"
                            color="purple"
                        />
                        <MetricsCard
                            title="Saturation Index"
                            value={`${Math.round(stats?.fillRate || 0)}%`}
                            icon={TrendingUp}
                            subtitle="Inventory Sold"
                            color="amber"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Audit Log Preview */}
                        <div className="lg:col-span-2">
                            <ActivityLogPreview auditLogs={auditLogs} />
                        </div>

                        {/* Side Panels */}
                        <div className="space-y-8">
                            <HealthPreview health={health} onRefresh={loadInitialData} />

                            <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <h4 className="font-black uppercase text-[10px] tracking-[0.3em] opacity-60 mb-6">Upcoming Event</h4>
                                    <div className="text-2xl font-black tracking-tight leading-tight mb-4">Colombo Bookfair 2026</div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80 mb-10">
                                        <CalendarDays size={14} strokeWidth={3} />
                                        Sept 18 - Sept 25
                                    </div>
                                    <Link to="/admin/stalls">
                                        <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 shadow-lg">
                                            Architect Layout
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'EVENTS' && (
                <div className="animate-in slide-in-from-bottom-5 duration-500">
                    <EventManagementTable
                        events={events}
                        onUpdateStatus={handleUpdateEventStatus}
                        onEdit={handleStartEdit}
                        onDelete={handleDeleteEvent}
                        onCreateClick={() => {
                            setEventData({ name: '', location: 'BMICH', status: 'DRAFT', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });
                            setShowCreateModal(true);
                        }}
                    />
                </div>
            )}

            <EventFormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateEvent}
                eventData={eventData}
                setEventData={setEventData}
                title="Create Operation"
            />

            <EventFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdateEvent}
                eventData={eventData}
                setEventData={setEventData}
                title="Edit Operation"
                isEditing
            />
        </div>
    );
}
