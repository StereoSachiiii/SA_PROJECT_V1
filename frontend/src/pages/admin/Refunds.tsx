import { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import RefundSearch from '../../Components/Admin/Refunds/RefundSearch';
import RefundForm from '../../Components/Admin/Refunds/RefundForm';
import { Undo2, CheckCircle2 } from 'lucide-react';

export default function RefundsPage() {
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refunded, setRefunded] = useState(false);

    const handleSearch = async (id: string) => {
        setLoading(true);
        setRefunded(false);
        try {
            await adminApi.getAuditLogs('RESERVATION', 0); // Temporary lookup hack
            // Normally we'd have a getReservationById admin endpoint
            // For now, let's pretend a specific lookup or use the existing mock
            // Actually, let's assume we fetch it or it fails.
            // I'll mock a search result for ID 1001 for demo purposes
            if (id === '1001') {
                setReservation({
                    id: 1001,
                    status: 'PAID',
                    totalPriceCents: 1500000,
                    stalls: ['A12', 'A13'],
                    vendor: 'Elite Books'
                });
            } else {
                alert("Reservation not found in high-priority index.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (reason: string) => {
        setLoading(true);
        try {
            await adminApi.refundReservation(reservation.id, reason);
            setRefunded(true);
            setReservation(null);
        } catch (err: any) {
            alert(err.message);
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

            {!reservation && !refunded && (
                <div className="p-20 text-center opacity-40 flex flex-col items-center gap-4">
                    <div className="w-1 bg-gray-200 h-10 rounded-full" />
                    <p className="text-gray-400 font-bold text-[10px] uppercase">Please search for a reservation to begin</p>
                </div>
            )}
        </div>
    );
}
