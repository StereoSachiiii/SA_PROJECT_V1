import { MapPin, Calendar } from 'lucide-react';
import { Event } from '@/shared/types/api';

interface EventHeroProps {
    event: Event;
}

export function EventHero({ event }: EventHeroProps) {
    return (
        <div className="relative h-[400px] bg-slate-900 overflow-hidden">
            {event?.imageUrl ? (
                <img
                    src={event.imageUrl}
                    alt={event?.name || 'Event'}
                    className="w-full h-full object-cover opacity-60"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-60" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 pb-20 container mx-auto">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-900/30 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                    Open for Booking
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 shadow-sm">
                    {event?.name || 'Loading Event...'}
                </h1>

                <div className="flex flex-wrap gap-6 text-slate-300 font-medium">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        {event?.location || 'Venue Location'}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-400" />
                        {event?.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date'}
                    </div>
                </div>
            </div>
        </div>
    );
}
