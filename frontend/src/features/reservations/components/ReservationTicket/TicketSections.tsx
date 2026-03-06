import type { Reservation } from '../../types';

interface TicketHeaderProps {
    reservation: Reservation;
    isPaid: boolean;
    isPending: boolean;
}

export const TicketHeader = ({ reservation, isPaid, isPending }: TicketHeaderProps) => (
    <div className="flex justify-between items-start">
        <div>
            <h3 className="text-2xl font-black text-black tracking-tight transition-colors">
                {reservation.stalls?.join(', ') || 'No Stall Info'}
            </h3>
            <p className="text-xs uppercase font-extrabold tracking-widest text-black/60 mt-1">
                {reservation.stalls?.length || 0} {reservation.stalls?.length === 1 ? 'Stall' : 'Stalls'}
                {reservation.event?.venueName && ` • ${reservation.event.venueName}`}
            </p>
        </div>
        <span className={`
            px-3 py-1 text-[11px] font-black rounded-full border
            ${isPaid
                ? 'bg-black/10 text-black border-black/20'
                : isPending
                    ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                    : 'bg-red-500/20 text-red-700 border-red-500/30'}
        `}>
            {reservation.status.replace('_', ' ')}
        </span>
    </div>
);

export const TicketInfo = ({ createdAt }: { createdAt: string }) => (
    <div className="mt-8 flex items-center gap-4 text-sm text-black">
        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center border border-black/10">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div>
            <p className="text-[11px] uppercase font-extrabold tracking-widest text-black/50">
                Reserved On
            </p>
            <p className="font-black font-mono text-black">
                {new Date(createdAt).toLocaleDateString()}
            </p>
        </div>
    </div>
);
