import { useState } from 'react';
import { adminApi } from '@/shared/api/adminApi';
import RefundSearch from '@/apps/admin/components/Refunds/RefundSearch';
import RefundForm from '@/apps/admin/components/Refunds/RefundForm';
import { Undo2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RefundsPage() {
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refunded, setRefunded] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (id: string) => {
        setLoading(true);
        setRefunded(false);
        setError('');
        setReservation(null);
        try {
            // strip RES- prefix if inputted by user
            const numericId = id.toUpperCase().replace('RES-', '');
            if (!/^\d+$/.test(numericId)) {
                setError('Invalid Reservation ID format. Please use numerical ID or RES-XXX');
                return;
            }
            const data = await adminApi.getReservationById(numericId);
            if (data.status === 'CANCELLED') {
                setError(`Reservation RES-${data.id} is already cancelled or refunded.`);
                return;
            }
            setReservation(data);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError(`No reservation found with ID: ${id}`);
            } else {
                setError(err.response?.data?.message || 'Failed to look up reservation.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (reason: string) => {
        setLoading(true);
        setError('');
        try {
            await adminApi.refundReservation(reservation.id, reason);
            setRefunded(true);
            setReservation(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Refund failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="bg-gray-900 p-3 rounded-md shadow-sm">
                    <Undo2 size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Refunds</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-1">Transaction Reversal Management</p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {refunded && (
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg flex items-center gap-6">
                    <div className="bg-green-500 p-2 rounded-full">
                        <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-900 uppercase text-xs">Refund Successful</h4>
                        <p className="text-green-700 text-xs font-semibold leading-relaxed">
                            The transaction has been reversed and the stalls have been freed for registration.
                        </p>
                    </div>
                    <button
                        onClick={() => setRefunded(false)}
                        className="ml-auto text-[10px] font-bold text-green-600 uppercase hover:underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <RefundSearch onSearch={handleSearch} loading={loading} />

            {reservation && (
                <RefundForm
                    reservation={reservation}
                    onRefund={handleRefund}
                    loading={loading}
                />
            )}

            {!reservation && !refunded && !error && (
                <div className="p-20 text-center opacity-40 flex flex-col items-center gap-4">
                    <div className="w-1 bg-gray-200 h-10 rounded-full" />
                    <p className="text-gray-400 font-bold text-[10px] uppercase">Search for a reservation ID to begin a refund</p>
                </div>
            )}
        </div>
    );
}
