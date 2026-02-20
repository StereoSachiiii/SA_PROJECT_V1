import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '@/shared/api/reservationApi';
import { vendorApi } from '@/shared/api/vendorApi';

// Sub-components
import { ReservationHeader } from '../components/VendorReservationDetail/ReservationHeader';
import { EventDetailBanner } from '../components/VendorReservationDetail/EventDetailBanner';
import { StallAllocation } from '../components/VendorReservationDetail/StallAllocation';
import { EntryPass } from '../components/VendorReservationDetail/EntryPass';
import { PaymentSummary } from '../components/VendorReservationDetail/PaymentSummary';
import { GenreEditModal } from '../components/VendorReservationDetail/GenreEditModal';
import { CancelReservationModal } from '../components/VendorReservationDetail/CancelReservationModal';
import { QrFullscreenModal } from '../components/VendorReservationDetail/QrFullscreenModal';

const AVAILABLE_CATEGORIES = [
    { id: 'FICTION', label: 'Fiction' },
    { id: 'NON_FICTION', label: 'Non-Fiction' },
    { id: 'CHILDREN', label: 'Children\'s Books' },
    { id: 'COMICS', label: 'Comics & Manga' },
    { id: 'TEXTBOOKS', label: 'Textbooks' },
    { id: 'RELIGION', label: 'Religion' },
    { id: 'STATIONERY', label: 'Stationery' }
];

export const VendorReservationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const reservationId = Number(id);
    const [showQrFullscreen, setShowQrFullscreen] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showEditInfo, setShowEditInfo] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const { data: reservation, isLoading, error } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => reservationApi.getById(reservationId),
        enabled: !!reservationId,
    });

    const cancelMutation = useMutation({
        mutationFn: async () => {
            if (reservation?.status === 'PAID') {
                return vendorApi.requestRefund(reservationId, 'Vendor requested refund from detail page');
            }
            return vendorApi.cancelReservation(reservationId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            setShowCancelConfirm(false);
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: (categories: string[]) => vendorApi.updateProfile({ categories }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
            setShowEditInfo(false);
        }
    });

    const openEditModal = () => {
        setSelectedCategories(reservation?.user?.categories || []);
        setShowEditInfo(true);
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest animate-pulse">Loading Reservation...</p>
        </div>
    );

    if (error || !reservation) {
        return (
            <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Booking Not Found</h3>
                <p className="text-slate-500 mt-2 mb-8 font-medium max-w-sm">
                    We were unable to retrieve the reservation details. It may have been deleted or moved.
                </p>
                <button
                    onClick={() => navigate('/home')}
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const { status } = reservation;
    const isCancelled = status === 'CANCELLED';

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl animate-in fade-in duration-500">
            <ReservationHeader reservation={reservation} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {reservation.event && <EventDetailBanner event={reservation.event} />}
                    <StallAllocation reservation={reservation} />
                </div>

                {/* Sidebar (QR Code & Actions) */}
                <div className="space-y-6">
                    <EntryPass
                        qrCode={reservation.qrCode}
                        isCancelled={isCancelled}
                        onShowFullscreen={() => setShowQrFullscreen(true)}
                    />

                    <PaymentSummary reservation={reservation} />

                    {/* Action Cards */}
                    {!isCancelled && (
                        <div className="space-y-4">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
                                <h4 className="text-sm font-black text-indigo-800 mb-2 uppercase tracking-tight">Publisher Genre</h4>
                                <p className="text-xs text-indigo-600/70 mb-5 font-medium leading-relaxed">
                                    Want to change the genre categories shown for your stall on the exhibitor map?
                                </p>
                                <button
                                    onClick={openEditModal}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200 uppercase text-[10px] tracking-widest active:scale-[0.98]"
                                >
                                    Update Categories
                                </button>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm">
                                <h4 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">Reservation Management</h4>
                                <p className="text-xs text-slate-500 mb-5 font-medium leading-relaxed">
                                    {status === 'PAID'
                                        ? "Request a cancellation and refund for this booking. Standard policies apply."
                                        : status === 'PENDING_REFUND'
                                            ? "Your refund request is currently being reviewed by an administrator."
                                            : "Discard this pending booking to release the stall immediately."}
                                </p>
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    disabled={status === 'PENDING_REFUND'}
                                    className={`w-full font-black py-3.5 rounded-2xl border-2 transition-all uppercase text-[10px] tracking-widest active:scale-[0.98] ${status === 'PENDING_REFUND'
                                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                                        : 'bg-white hover:bg-rose-50 text-rose-600 border-slate-200 hover:border-rose-200'
                                        }`}
                                >
                                    {status === 'PAID' ? 'Request Refund' : status === 'PENDING_REFUND' ? 'Refund in Progress' : 'Discard Booking'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <QrFullscreenModal
                isOpen={showQrFullscreen}
                onClose={() => setShowQrFullscreen(false)}
                qrCode={reservation.qrCode || ''}
            />

            <GenreEditModal
                isOpen={showEditInfo}
                onClose={() => setShowEditInfo(false)}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                onSave={() => updateProfileMutation.mutate(selectedCategories)}
                isPending={updateProfileMutation.isPending}
                categories={AVAILABLE_CATEGORIES}
            />

            <CancelReservationModal
                isOpen={showCancelConfirm}
                onClose={() => setShowCancelConfirm(false)}
                onConfirm={() => cancelMutation.mutate()}
                isPending={cancelMutation.isPending}
                error={cancelMutation.error}
                status={status}
            />
        </div>
    );
};

export default VendorReservationDetailPage;
