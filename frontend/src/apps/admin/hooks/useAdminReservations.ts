import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import { Reservation } from '@/shared/types/api';

export function useAdminReservations() {
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
        loadReservations();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, statusFilter]);

    const loadReservations = async () => {
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

    return {
        reservations, loading, error, setError,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        actionLoading,
        paymentModal, setPaymentModal,
        cancelModal, setCancelModal, cancelReason, setCancelReason,
        refundModal, setRefundModal, refundReason, setRefundReason,
        vendorDocsModal, setVendorDocsModal,
        page, setPage, totalPages,
        paginatedReservations,
        executeConfirmPayment, executeCancel, executeRefundApprove,
        handleExport, handleAction
    };
}
