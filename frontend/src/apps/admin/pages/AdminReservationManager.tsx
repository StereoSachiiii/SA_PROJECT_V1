import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { Reservation } from '@/shared/types/api';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ReservationFilters } from '../components/ReservationManager/ReservationFilters';
import { ReservationTable } from '../components/ReservationManager/ReservationTable';
import { PaymentConfirmModal } from '../components/ReservationManager/PaymentConfirmModal';
import { CancelReservationModal } from '../components/ReservationManager/CancelReservationModal';
import { RefundApprovalModal } from '../components/ReservationManager/RefundApprovalModal';
import { VendorMetadataModal } from '../components/ReservationManager/VendorMetadataModal';
import { LoadingState } from '@/shared/components/LoadingState';

export default function AdminReservationManager() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING_PAYMENT' | 'CANCELLED' | 'PENDING_REFUND'>('ALL');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Modal States
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [paymentModal, setPaymentModal] = useState<Reservation | null>(null);
    const [cancelModal, setCancelModal] = useState<Reservation | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [refundModal, setRefundModal] = useState<Reservation | null>(null);
    const [refundReason, setRefundReason] = useState('');
    const [vendorDocsModal, setVendorDocsModal] = useState<Reservation | null>(null);

    const [page, setPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        console.info('[Reservations] Triggering initial load');
        loadReservations();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const loadReservations = async () => {
        console.info('[Reservations] Fetching all reservations from API');
        setLoading(true);
        try {
            const data = await adminApi.getAllReservations();
            setReservations(data);
        } catch (err) {
            setError('Failed to load reservations.');
        } finally {
            setLoading(false);
        }
    };

    const executeConfirmPayment = async () => {
        if (!paymentModal) return;
        setActionLoading(paymentModal.id);
        setError('');
        try {
            await adminApi.confirmPayment(paymentModal.id);
            setReservations(prev => prev.map(r => r.id === paymentModal.id ? { ...r, status: 'PAID' } : r));
            setPaymentModal(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to confirm payment.');
        } finally {
            setActionLoading(null);
        }
    };

    const executeCancel = async () => {
        if (!cancelModal) return;
        setActionLoading(cancelModal.id);
        setError('');
        try {
            await adminApi.cancelReservation(cancelModal.id, cancelReason || 'Admin cancelled');
            setReservations(prev => prev.map(r => r.id === cancelModal.id ? { ...r, status: 'CANCELLED' } : r));
            setCancelModal(null);
            setCancelReason('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to cancel reservation.');
        } finally {
            setActionLoading(null);
        }
    };

    const executeRefundApprove = async () => {
        if (!refundModal) return;
        setActionLoading(refundModal.id);
        setError('');
        try {
            await adminApi.refundReservation(refundModal.id, refundReason || 'Refund Approved by Admin');
            setReservations(prev => prev.map(r => r.id === refundModal.id ? { ...r, status: 'CANCELLED' } : r));
            setRefundModal(null);
            setRefundReason('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process refund.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleExport = async () => {
        try {
            await adminApi.exportReservationsCsv();
        } catch (err: any) {
            setError('Failed to export CSV.');
        }
    };

    const handleAction = (e: React.MouseEvent, type: 'PAYMENT' | 'CANCEL' | 'REFUND' | 'DOCS', res: Reservation) => {
        e.stopPropagation();
        switch (type) {
            case 'PAYMENT': setPaymentModal(res); break;
            case 'CANCEL': setCancelModal(res); setCancelReason(''); break;
            case 'REFUND': setRefundModal(res); setRefundReason(''); break;
            case 'DOCS': setVendorDocsModal(res); break;
        }
    };

    const filteredReservations = useMemo(() => {
        if (!Array.isArray(reservations)) return [];
        return reservations.filter(res => {
            const username = res.user?.username || '';
            const qrCode = res.qrCode || '';
            const fallbackId = `RES-${res.id}`;
            const matchesSearch =
                username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                qrCode.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                fallbackId.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [reservations, debouncedSearchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredReservations.length / pageSize);
    const paginatedReservations = filteredReservations.slice(page * pageSize, (page + 1) * pageSize);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, statusFilter]);

    if (loading) return <LoadingState message="Loading Reservations..." fullPage />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">Manage & Audit Booking Data</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <ReservationFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <ReservationTable
                reservations={paginatedReservations}
                onRowClick={(id) => navigate(`/admin/reservations/${id}`)}
                onAction={handleAction}
                actionLoading={actionLoading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <PaymentConfirmModal
                reservation={paymentModal}
                isOpen={!!paymentModal}
                onClose={() => setPaymentModal(null)}
                onConfirm={executeConfirmPayment}
                isLoading={actionLoading === paymentModal?.id}
            />

            <CancelReservationModal
                reservation={cancelModal}
                isOpen={!!cancelModal}
                onClose={() => setCancelModal(null)}
                reason={cancelReason}
                onReasonChange={setCancelReason}
                onConfirm={executeCancel}
                isLoading={actionLoading === cancelModal?.id}
            />

            <RefundApprovalModal
                reservation={refundModal}
                isOpen={!!refundModal}
                onClose={() => setRefundModal(null)}
                reason={refundReason}
                onReasonChange={setRefundReason}
                onConfirm={executeRefundApprove}
                isLoading={actionLoading === refundModal?.id}
            />

            <VendorMetadataModal
                reservation={vendorDocsModal}
                isOpen={!!vendorDocsModal}
                onClose={() => setVendorDocsModal(null)}
            />
        </div>
    );
}
