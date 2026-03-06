import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/shared/types/api';
import { vendorApi } from '@/shared/api/vendorApi';
import { StatusBadge } from './StatusBadge';
import { formatTimeLeft } from '@/shared/utils/format';

interface ReservationRowProps {
    res: Reservation;
    onCancel: (id: number) => void;
    isGrouped?: boolean;
}

export const ReservationRow = ({ res, onCancel, isGrouped }: ReservationRowProps) => {
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
            const display = formatTimeLeft(res.expiresAt);
            setTimeLeft(display);
            if (display === 'Expired') clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [res.status, res.expiresAt]);

    return (
        <tr
            onClick={() => navigate(`/vendor/reservations/${res.id}`)}
            className="hover:bg-slate-50/80 transition-all cursor-pointer group border-b border-slate-50 last:border-0"
        >
            <td className="px-10 py-4">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                    #{res.id}
                </span>
            </td>

            {!isGrouped && (
                <td className="px-6 py-4">
                    <div className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                        {res.event?.name || 'Colombo Book Fair 2026'}
                    </div>
                </td>
            )}

            <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                    {res.stalls.map(s => (
                        <div key={s} className="flex flex-col">
                            <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                {s}
                            </span>
                        </div>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <div className="flex flex-col items-center">
                    <StatusBadge status={res.status} />
                    {res.status === 'PENDING_PAYMENT' && timeLeft && (
                        <span className="text-[8px] text-rose-500 font-black mt-1 animate-pulse">
                            {timeLeft}
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
