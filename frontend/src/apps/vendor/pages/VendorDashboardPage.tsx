import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '@/shared/api/vendorApi';
import { Reservation } from '@/shared/types/api';
import { useAuth } from '@/shared/context/AuthContext';

// Sub-components
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { ReservationsTable } from '../components/Dashboard/ReservationsTable';
import { CancelConfirmModal } from '../components/Dashboard/CancelConfirmModal';

export default function VendorDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [limits, setLimits] = useState({ limit: 3, used: 0, remaining: 3 });

    // Cancellation state
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedResId, setSelectedResId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [resData, limitData] = await Promise.all([
                vendorApi.getMyReservations(),
                vendorApi.getAvailableCount()
            ]);
            setReservations(resData);
            setLimits(limitData);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = (id: number) => {
        setSelectedResId(id);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedResId) return;
        const res = reservations.find(r => r.id === selectedResId);
        if (!res) return;

        setActionLoading(true);
        try {
            if (res.status === 'PAID') {
                await vendorApi.requestRefund(selectedResId, 'Vendor requested refund from dashboard');
            } else {
                await vendorApi.cancelReservation(selectedResId);
            }
            setShowCancelModal(false);
            loadDashboard();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] pulse">Loading Assets...</p>
        </div>
    );

    const selectedRes = reservations.find(r => r.id === selectedResId);

    return (
        <div className="container mx-auto p-6 md:p-12 max-w-7xl animate-in fade-in duration-500">
            <DashboardHeader
                businessName={user?.businessName}
                username={user?.username || ''}
                canBook={limits.remaining > 0}
                onBookClick={() => navigate('/events')}
            />

            {error && (
                <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-6 rounded-[2rem] mb-10 flex items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="bg-rose-600 text-white p-2 rounded-xl">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-black uppercase text-[10px] tracking-widest leading-none mb-1">Service Alert</p>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="ml-auto text-rose-300 hover:text-rose-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <DashboardStats
                limit={limits.limit}
                used={limits.used}
                remaining={limits.remaining}
            />

            <ReservationsTable
                reservations={reservations}
                onCancel={handleCancelRequest}
            />

            <CancelConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                isLoading={actionLoading}
                status={selectedRes?.status}
            />
        </div>
    );
}
