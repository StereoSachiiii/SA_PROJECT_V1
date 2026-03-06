import { Reservation } from '@/shared/types/api';

interface StatusBadgeProps {
    status: Reservation['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusStyle = (status: Reservation['status']) => {
        switch (status) {
            case 'PAID':
                return 'bg-emerald-100 text-emerald-600';
            case 'PENDING_PAYMENT':
                return 'bg-amber-100 text-amber-600';
            case 'CHECKED_IN':
                return 'bg-indigo-100 text-indigo-600';
            default:
                return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-sm ${getStatusStyle(status)}`}>
            {status.replace('_', ' ')}
        </span>
    );
};
