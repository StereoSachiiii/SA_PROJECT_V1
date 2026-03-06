import { LayoutGrid } from 'lucide-react';
import { Event } from '@/shared/types/api';

interface EventVenueOverviewProps {
    event: Event;
}

export function EventVenueOverview({ event }: EventVenueOverviewProps) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <LayoutGrid className="w-6 h-6 text-violet-600" />
                    Venue Overview
                </h2>
            </div>
            <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                {event?.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={`${event.name} venue`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 m-4 rounded-xl bg-slate-50/50">
                        <LayoutGrid className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Venue Image Available</p>
                    </div>
                )}
                {event?.imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full">{event?.venueName || 'Venue'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
