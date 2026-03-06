import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { useAdminReservations } from '../hooks/useAdminReservations';

import { ReservationFilters } from '../components/ReservationManager/ReservationFilters';
import { ReservationTable } from '../components/ReservationManager/ReservationTable';
import { PaymentConfirmModal } from '../components/ReservationManager/PaymentConfirmModal';
import { CancelReservationModal } from '../components/ReservationManager/CancelReservationModal';
import { RefundApprovalModal } from '../components/ReservationManager/RefundApprovalModal';
import { VendorMetadataModal } from '../components/ReservationManager/VendorMetadataModal';
import { LoadingState } from '@/shared/components/LoadingState';

export default function AdminReservationManager() {
    const navigate = useNavigate();
    const {
        loading, error, setError,
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
    } = useAdminReservations();

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
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-auto opacity-50 hover:opacity-100">
                        <Plus className="rotate-45" size={14} />
                    </button>
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
