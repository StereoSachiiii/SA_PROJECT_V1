import { ArrowRight } from 'lucide-react';
import { Event } from '@/shared/types/api';

interface EventSidebarProps {
    event: Event;
    onViewMap: () => void;
}

export function EventSidebar({ event, onViewMap }: EventSidebarProps) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Event Status</h3>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">Status</span>
                    <span className="text-sm font-bold text-slate-900">{event?.status || 'UPCOMING'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">Venue</span>
                    <span className="text-sm font-bold text-slate-900">{event?.venueName || 'Main Hall'}</span>
                </div>
            </div>

            <button
                onClick={onViewMap}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
                View Stall Map
                <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                Reserve your spot today. Secure payments via Stripe.
            </p>
        </div>
    );
}
