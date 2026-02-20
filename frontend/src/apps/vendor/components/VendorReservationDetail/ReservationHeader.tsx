import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/shared/types/api';

interface ReservationHeaderProps {
    reservation: Reservation;
}

export const ReservationHeader = ({ reservation }: ReservationHeaderProps) => {
    const navigate = useNavigate();
    const { status, createdAt, id } = reservation;
    const isCancelled = status === 'CANCELLED';

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <button
                    onClick={() => navigate('/home')}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 font-bold text-sm transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Booking #{id}
                    </h1>
                    <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest rounded-full border-2 ${status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        isCancelled ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                        {status.replace('_', ' ')}
                    </span>
                </div>
                <p className="text-slate-500 mt-2 font-medium underline decoration-slate-200 decoration-2 underline-offset-4">
                    Reserved on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};
