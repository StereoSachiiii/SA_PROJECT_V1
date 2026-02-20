import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/shared/types/api';
import { vendorApi } from '@/shared/api/vendorApi';

const ReservationRow = ({ res, onCancel }: { res: Reservation, onCancel: (id: number) => void }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await vendorApi.downloadTicket(res.id);
        } catch (e) {
            console.error('Download error', e);
        } finally {
            setIsDownloading(false);
        }
    }

    useEffect(() => {
        if (res.status !== 'PENDING_PAYMENT' || !res.expiresAt) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expire = new Date(res.expiresAt!).getTime();
            const diff = expire - now;

            if (diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(timer);
            } else {
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${mins}m ${secs}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [res.status, res.expiresAt]);

    return (
        <tr
            onClick={() => navigate(`/vendor/reservations/${res.id}`)}
            className="hover:bg-slate-50/80 transition-all cursor-pointer group border-b border-slate-50 last:border-0"
        >
            <td className="px-6 py-5">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                    #{res.id}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {res.event?.name || 'Colombo Bookfair 2026'}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stall Booking</div>
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1.5">
                    {res.stalls.map(s => (
                        <span key={s} className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                            {s}
                        </span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-5 text-center">
                <div className="flex flex-col items-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-sm
                        ${res.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                            res.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-600' :
                                res.status === 'CHECKED_IN' ? 'bg-indigo-100 text-indigo-600' :
                                    'bg-slate-100 text-slate-500'}`}>
                        {res.status.replace('_', ' ')}
                    </span>
                    {res.status === 'PENDING_PAYMENT' && timeLeft && (
                        <span className="text-[9px] text-rose-500 font-black mt-1.5 animate-pulse">
                            {timeLeft} Left
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                    {(res.status === 'PENDING_PAYMENT' || res.status === 'PAID') && (
                        <button
                            onClick={() => onCancel(res.id)}
                            className="text-rose-600 hover:text-white hover:bg-rose-600 p-2 rounded-xl transition-all active:scale-95 border-2 border-transparent hover:border-rose-100"
                            title={res.status === 'PAID' ? 'Request Refund' : 'Cancel Booking'}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                    {res.status === 'PAID' && (
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="text-indigo-600 hover:text-white hover:bg-indigo-600 p-2 rounded-xl transition-all active:scale-95 border-2 border-transparent hover:border-indigo-100"
                            title="Download Ticket"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                    )}
                    {res.status === 'PENDING_REFUND' && <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest italic">Reviewing Refund</span>}
                </div>
            </td>
        </tr>
    );
};

interface ReservationsTableProps {
    reservations: Reservation[];
    onCancel: (id: number) => void;
}

export const ReservationsTable = ({ reservations, onCancel }: ReservationsTableProps) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Reservations</h2>
                <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {reservations.length} Bookings
                </div>
            </div>

            <div className="overflow-x-auto">
                {reservations.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">No Stall Bookings</h3>
                        <p className="text-slate-400 font-medium text-sm">You haven't reserved any stalls yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Event Details</th>
                                <th className="px-6 py-4">Allocated Stalls</th>
                                <th className="px-6 py-4 text-center">Current Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 relative">
                            {reservations.map((res) => (
                                <ReservationRow key={res.id} res={res} onCancel={onCancel} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
