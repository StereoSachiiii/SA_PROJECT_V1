import React from 'react';
import { Hash, Calendar, CheckCircle2, AlertCircle, XCircle, FileText, ClipboardList } from 'lucide-react';
import { Reservation } from '@/shared/types/api';
import { StatusBadge } from '@/shared/components/StatusBadge';

interface ReservationTableProps {
    reservations: Reservation[];
    onRowClick: (id: number) => void;
    onAction: (e: React.MouseEvent, type: 'PAYMENT' | 'CANCEL' | 'REFUND' | 'DOCS', res: Reservation) => void;
    actionLoading: number | null;
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

export const ReservationTable: React.FC<ReservationTableProps> = ({
    reservations,
    onRowClick,
    onAction,
    actionLoading,
    page,
    totalPages,
    onPageChange
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendor Info</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Financials</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reservations.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                        <ClipboardList size={48} />
                                        <p className="font-bold uppercase text-xs">No matching reservations found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr
                                    key={res.id}
                                    onClick={() => onRowClick(res.id)}
                                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                                                {res.user?.username?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{res.user?.username || 'Unknown Vendor'}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase">{res.user?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-black uppercase flex items-center gap-1.5">
                                                <Hash size={12} className="text-gray-400" />
                                                {res.qrCode || `RES-${res.id}`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                                                <Calendar size={12} className="text-gray-400" />
                                                {new Date(res.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-900 text-sm">
                                                LKR {((res.totalPriceCents || 0) / 100).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">
                                                {res.stalls?.length || 0} Stalls
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={res.status} type="RESERVATION" />
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {actionLoading === res.id ? (
                                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {res.status === 'PENDING_PAYMENT' && (
                                                        <button
                                                            onClick={(e) => onAction(e, 'PAYMENT', res)}
                                                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-green-600 transition-all"
                                                            title="Confirm Payment"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
                                                    {res.status === 'PENDING_REFUND' && (
                                                        <button
                                                            onClick={(e) => onAction(e, 'REFUND', res)}
                                                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-orange-500 transition-all"
                                                            title="Approve Refund Request"
                                                        >
                                                            <AlertCircle size={18} />
                                                        </button>
                                                    )}
                                                    {res.status !== 'CANCELLED' && res.status !== 'PENDING_REFUND' && (
                                                        <button
                                                            onClick={(e) => onAction(e, 'CANCEL', res)}
                                                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-rose-600 transition-all"
                                                            title="Cancel Reservation"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    {res.user && (
                                                        <button
                                                            onClick={(e) => onAction(e, 'DOCS', res)}
                                                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                                                            title="View Vendor Metadata"
                                                        >
                                                            <FileText size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {reservations.length} Bookings
                </p>

                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => onPageChange(page - 1)}
                            className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs font-bold text-gray-500 py-1 px-2">Page {page + 1} of {totalPages}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => onPageChange(page + 1)}
                            className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <AlertCircle size={12} />
                    Data refreshes in real-time
                </div>
            </div>
        </div>
    );
};
