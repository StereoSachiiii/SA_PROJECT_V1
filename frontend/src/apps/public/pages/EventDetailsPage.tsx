import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/shared/api/publicApi';
import { MapPin, Calendar, ArrowRight, LayoutGrid, Info } from 'lucide-react';

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const eventId = Number(id);

    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => publicApi.getEvent(eventId),
        enabled: !!eventId
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2>
                    <p className="text-slate-500 mb-6">The event you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        Browse all events
                    </button>
                </div>
            </div>
        );
    }

    // TEMPORARY FIX: We don't have a direct public "getEventById" that returns full details in the PublicController yet?
    // PublicController has getEventMap but that returns map data.
    // PublicController has getActiveEvents. 
    // Let's use getActiveEvents and find it, or simply add getEventById to PublicController?
    // User asked to "add a page", implying we should likely add the endpoint if needed.
    // However, for speed, I will use the "getEventMap" endpoint if I updated it? 
    // I updated PublicController.java's getEventMap? NO, I updated mapToEventResponse used in search/list.
    // I SHOULD have added a getEventDetails endpoint or similar. 
    // BUT, let's look at PublicController.getEventMap again.

    // It returns:
    // response.put("eventId", id);
    // response.put("eventName", event.getName());
    // response.put("stalls", stalls);
    // response.put("layout", layout);

    // It DOES NOT return description/image/dates. 

    // PLAN ADJUSTMENT: I need to add a proper `getEventById` to PublicController or update `getEventMap` to return full details.
    // Updating `getEventMap` is risky as it's for the map. 
    // I will add `getEventById` to `PublicController` in the next step. 
    // For now, I will write this component assuming `publicApi.getEvent(id)` exists and returns `EventResponse`.

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
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

            <div className="container mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-600" />
                                About the Event
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                {event?.description ? (
                                    <p className="whitespace-pre-line">{event.description}</p>
                                ) : (
                                    <p className="italic text-slate-400">No description available for this event.</p>
                                )}
                            </div>
                        </div>

                        {/* Venue Overview */}
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
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
                                onClick={() => navigate(`/stalls/${eventId}`)}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                            >
                                View Stall Map
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                                Reserve your spot today. Secure payments via Stripe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
