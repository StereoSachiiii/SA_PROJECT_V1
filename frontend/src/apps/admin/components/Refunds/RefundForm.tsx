import { useState } from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

import { Reservation } from '@/shared/types/api';

interface RefundFormProps {
    reservation: Reservation;
    onRefund: (reason: string) => void;
    loading: boolean;
}

export default function RefundForm({ reservation, onRefund, loading }: RefundFormProps) {
    const [reason, setReason] = useState('');

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Process Refund</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">Current Status: {reservation.status}</p>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-md">
                    <ShieldCheck size={20} className="text-blue-600" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-md">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Refund Amount</label>
                    <p className="text-lg font-bold text-gray-900">LKR {((reservation.totalPriceCents || 0) / 100).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Related Stalls</label>
                    <p className="text-lg font-bold text-gray-900">{(reservation.stalls || []).join(', ')}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 px-1">Reason for Refund</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-200 p-4 rounded-md font-semibold text-gray-900 focus:border-red-500 focus:bg-white outline-none transition-all min-h-[100px]"
                        placeholder="Please provide a brief explanation for the refund..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className="bg-red-50 p-4 rounded-md flex items-center gap-4 text-red-800 border border-red-100">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-xs font-semibold leading-relaxed">
                        Notice: This will immediately initiate a transaction reversal. This action cannot be undone.
                    </p>
                </div>

                <button
                    disabled={loading || !reason || (reservation.status !== 'PAID' && reservation.status !== 'PENDING_REFUND')}
                    onClick={() => onRefund(reason)}
                    className="w-full bg-red-600 text-white py-4 rounded-md font-bold text-xs uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processing Refund...' : 'Confirm Full Refund'}
                </button>
            </div>
        </div>
    );
}
