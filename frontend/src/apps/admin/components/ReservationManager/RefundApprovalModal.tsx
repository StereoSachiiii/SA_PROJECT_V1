import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Reservation } from '@/shared/types/api';

interface RefundApprovalModalProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    onReasonChange: (reason: string) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const RefundApprovalModal: React.FC<RefundApprovalModalProps> = ({
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
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-100 mb-4">
                    <AlertCircle className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Approve Refund</h3>
                <p className="text-sm text-gray-500 mb-4">
                    The vendor requested a refund for booking <strong>#{reservation.id}</strong>. Approving this will cancel the booking and release the stall. Ensure you process the financial refund via Stripe dashboard.
                </p>
                <div className="text-left mb-6">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Approval Note (Optional)</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        placeholder="E.g., Confirmed and refunded via Stripe..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
                        Close
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50">
                        {isLoading ? 'Processing...' : 'Approve Refund & Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};
