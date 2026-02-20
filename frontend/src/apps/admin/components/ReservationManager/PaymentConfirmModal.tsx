import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reservation } from '@/shared/types/api';

interface PaymentConfirmModalProps {
    reservation: Reservation | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const PaymentConfirmModal: React.FC<PaymentConfirmModalProps> = ({
    reservation,
    isOpen,
    onClose,
    onConfirm,
    isLoading
}) => {
    if (!isOpen || !reservation) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Payment</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to mark booking <strong>#{reservation.id}</strong> as PAID? This will instantly generate and send the entry ticket.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {isLoading ? 'Processing...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};
