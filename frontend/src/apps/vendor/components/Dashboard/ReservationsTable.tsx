import { useMemo } from 'react';
import { Reservation } from '@/shared/types/api';
import { ReservationRow } from './ReservationRow';
import { ReservationEmptyState } from './ReservationEmptyState';

interface ReservationsTableProps {
    reservations: Reservation[];
    onCancel: (id: number) => void;
}

export const ReservationsTable = ({ reservations, onCancel }: ReservationsTableProps) => {
    const grouped = useMemo(() => {
        const groups: Record<string, Record<string, Reservation[]>> = {};

        reservations.forEach(res => {
            const eventName = res.event?.name || 'Colombo Book Fair 2026';
            const hallName = res.stallDetails?.hallName || 'General Hall';

            if (!groups[eventName]) groups[eventName] = {};
            if (!groups[eventName][hallName]) groups[eventName][hallName] = [];
            groups[eventName][hallName].push(res);
        });

        // Sort: Active first, CANCELLED last
        Object.values(groups).forEach(hallGroups => {
            Object.values(hallGroups).forEach(resList => {
                resList.sort((a, b) => {
                    if (a.status === 'CANCELLED' && b.status !== 'CANCELLED') return 1;
                    if (a.status !== 'CANCELLED' && b.status === 'CANCELLED') return -1;
                    return 0;
                });
            });
        });

        return groups;
    }, [reservations]);

    const eventNames = Object.keys(grouped).sort();

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Active Reservations</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Organized by Event and Venue</p>
                </div>
                <div className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">
                    {reservations.length} Bookings
                </div>
            </div>

            <div className="overflow-x-auto">
                {reservations.length === 0 ? (
                    <ReservationEmptyState />
                ) : (
                    <div className="divide-y divide-slate-100">
                        {eventNames.map(eventName => (
                            <div key={eventName} className="p-1">
                                <div className="px-8 py-4 bg-slate-50/50 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">{eventName}</h3>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-indigo-400 transition-colors">Event Header</span>
                                </div>

                                {Object.keys(grouped[eventName]).sort().map(hallName => (
                                    <div key={hallName} className="mb-4 last:mb-0">
                                        <div className="px-10 py-2 border-b border-slate-50 flex items-center gap-2">
                                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{hallName}</span>
                                        </div>

                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-white text-slate-400 uppercase text-[8px] font-black tracking-[0.2em]">
                                                <tr>
                                                    <th className="px-10 py-3 w-24">REF</th>
                                                    <th className="px-6 py-3">Allocated Stall</th>
                                                    <th className="px-6 py-3 text-center">Status</th>
                                                    <th className="px-10 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 relative">
                                                {grouped[eventName][hallName].map((res) => (
                                                    <ReservationRow
                                                        key={res.id}
                                                        res={res}
                                                        onCancel={onCancel}
                                                        isGrouped
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
