import React from 'react';
import { XCircle } from 'lucide-react';
import { Reservation } from '@/shared/types/api';

interface CancelReservationModalProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    onReasonChange: (reason: string) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
    reservation,
    isOpen,
    onClose,
    reason,
    onReasonChange,
    onConfirm,
    isLoading
}) => {
    if (!isOpen || !reservation) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-rose-100 mb-4">
                    <XCircle className="h-7 w-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Cancel Booking</h3>
                <p className="text-sm text-gray-500 mb-4">
                    You are about to cancel booking <strong>#{reservation.id}</strong>. The stall will be released to the public. If this was a PAID booking, a refund process will need to be initiated.
                </p>
                <div className="text-left mb-6">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Cancellation Reason (Optional)</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        placeholder="E.g., Vendor requested, policy violation..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
                        Close
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50">
                        {isLoading ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
};
