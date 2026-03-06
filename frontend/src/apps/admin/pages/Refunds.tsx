import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/shared/api/adminApi';
import { Reservation } from '@/shared/types/api';
import { Undo2, CheckCircle2, AlertCircle, ExternalLink, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700',
    PENDING_REFUND: 'bg-amber-100 text-amber-700',
    PENDING_PAYMENT: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
    EXPIRED: 'bg-red-100 text-red-600',
};

export default function RefundsPage() {
    const navigate = useNavigate();
    const [refundable, setRefundable] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [reasons, setReasons] = useState<Record<number, string>>({});
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [successResponse, setSuccessResponse] = useState<{ id: number, refundTxId: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<Reservation | null>(null);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const pending = await adminApi.getPendingRefunds();
            setRefundable(pending);
        } catch {
            setError('Failed to load pending refunds.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSearch = async () => {
        if (!searchId.trim()) return;
        setSearchLoading(true);
        setError('');
        try {
            const numericId = searchId.toUpperCase().replace('RES-', '');
            if (!/^\d+$/.test(numericId)) {
                setError('Invalid ID. Use a number or RES-XXX format.');
                return;
            }
            const data = await adminApi.getReservationById(numericId);
            if (data.status === 'CANCELLED') {
                setError(`RES-${data.id} is already cancelled.`);
                return;
            }
            if (data.status === 'PENDING_PAYMENT' || data.status === 'EXPIRED') {
                setError(`RES-${data.id} has status "${data.status}" — only PAID or PENDING_REFUND reservations are eligible.`);
                return;
            }
            // Add to table if not already present
            setRefundable(prev =>
                prev.find(r => r.id === data.id) ? prev : [data, ...prev]
            );
        } catch (err: any) {
            setError(err.response?.status === 404
                ? `No reservation found with ID: ${searchId}`
                : err.response?.data?.message || 'Lookup failed.');
        } finally {
            setSearchLoading(false);
            setSearchId('');
        }
    };

    const handleRefund = async (reservation: Reservation) => {
        const reason = reasons[reservation.id] || '';
        if (!reason.trim()) {
            setError(`Please provide a reason before refunding RES-${reservation.id}.`);
            return;
        }
        setProcessingId(reservation.id);
        setError('');
        try {
            const res = await adminApi.refundReservation(reservation.id, reason);
            setSuccessResponse({ id: res.id, refundTxId: res.refundTxId });
            setRefundable(prev => prev.filter(r => r.id !== reservation.id));
            setReasons(prev => { const n = { ...prev }; delete n[reservation.id]; return n; });
            setConfirmModal(null);
            setTimeout(() => setSuccessResponse(null), 5000);
        } catch (err: any) {
            setError(err.response?.data?.message || `Refund failed for RES-${reservation.id}.`);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-900 p-3 rounded-lg shadow-sm">
                        <Undo2 size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Refunds</h1>
                        <p className="text-gray-500 font-semibold uppercase text-[10px] mt-1">Transaction Reversal Management</p>
                    </div>
                </div>
                <button
                    onClick={load}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Success Banner */}
            {successResponse && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                        <p className="text-xs font-semibold text-green-800">
                            Refund for <span className="font-black">RES-{successResponse.id}</span> issued successfully.
                        </p>
                    </div>
                    <div className="text-[10px] bg-white border border-green-200 text-green-800 px-3 py-1.5 rounded-md font-mono shrink-0 font-bold shadow-sm">
                        Txn ID: {successResponse.refundTxId}
                    </div>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle size={18} className="text-rose-600 shrink-0" />
                    <p className="text-xs font-semibold text-rose-700 flex-1">{error}</p>
                    <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-700 font-black text-xs">✕</button>
                </div>
            )}

            {/* Lookup bar */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex gap-3 items-center">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Look up by Reservation ID (e.g. 57 or RES-57)"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-gray-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={searchLoading || !searchId.trim()}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-700 transition-colors disabled:opacity-40"
                >
                    {searchLoading ? 'Searching...' : 'Search'}
                </button>
                <p className="text-[10px] font-semibold text-gray-400 uppercase whitespace-nowrap">
                    Eligible: <span className="text-blue-600">PAID</span> or <span className="text-amber-600">PENDING_REFUND</span>
                </p>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xs font-bold uppercase text-gray-700">Refund Queue</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${refundable.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {loading ? '...' : `${refundable.length} pending`}
                    </span>
                </div>

                {loading ? (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Loading...</p>
                    </div>
                ) : refundable.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm font-bold text-gray-400">No pending refund requests</p>
                        <p className="text-[10px] text-gray-300 uppercase mt-1 font-semibold">Use the search bar above to look up a specific reservation</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="text-left px-6 py-3">Reservation</th>
                                    <th className="text-left px-6 py-3">Vendor</th>
                                    <th className="text-left px-6 py-3">Stall</th>
                                    <th className="text-left px-6 py-3">Amount</th>
                                    <th className="text-left px-6 py-3">Status</th>
                                    <th className="text-left px-6 py-3">Reason</th>
                                    <th className="text-left px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {refundable.map(res => (
                                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-gray-900">RES-{res.id}</span>
                                                <button
                                                    onClick={() => navigate(`/admin/reservations/${res.id}`)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="View details"
                                                >
                                                    <ExternalLink size={12} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : ''}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 text-xs">{res.user?.businessName || '—'}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold">{res.user?.email || res.user?.username}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 text-xs">{(res.stalls || []).join(', ') || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-gray-900">
                                                LKR {((res.totalPriceCents || 0) / 100).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${STATUS_COLORS[res.status] || 'bg-gray-100 text-gray-500'}`}>
                                                {res.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 min-w-[220px]">
                                            <input
                                                type="text"
                                                placeholder="Enter refund reason..."
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:border-red-400 focus:bg-white outline-none transition-all"
                                                value={reasons[res.id] || ''}
                                                onChange={e => setReasons(prev => ({ ...prev, [res.id]: e.target.value }))}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setConfirmModal(res)}
                                                disabled={processingId === res.id || !reasons[res.id]?.trim()}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                            >
                                                {processingId === res.id ? 'Processing...' : 'Issue Refund'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 text-red-600 mb-6">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Confirm Full Refund</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <p className="text-gray-500 font-semibold mb-1">Reservation:</p>
                                <p className="font-black text-gray-900 text-lg">RES-{confirmModal.id}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <p className="text-gray-500 font-semibold mb-1">Refund Amount:</p>
                                <p className="font-black text-gray-900 text-lg">LKR {((confirmModal.totalPriceCents || 0) / 100).toLocaleString()}</p>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-xs font-semibold text-red-800 flex gap-2">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <p>This will immediately reverse the transaction with the payment provider {confirmModal.paymentId ? '(Stripe)' : '(Manual Fallback)'}. This action cannot be undone.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                disabled={processingId === confirmModal.id}
                                className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRefund(confirmModal)}
                                disabled={processingId === confirmModal.id}
                                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl text-xs uppercase hover:bg-red-700 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {processingId === confirmModal.id ? 'Processing...' : 'Confirm Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
