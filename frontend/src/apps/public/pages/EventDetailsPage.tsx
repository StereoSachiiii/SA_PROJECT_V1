import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/shared/api/publicApi';

// Sub-components
import { EventHero } from '../components/EventHero';
import { EventDescription } from '../components/EventDescription';
import { EventVenueOverview } from '../components/EventVenueOverview';
import { EventSidebar } from '../components/EventSidebar';

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

    const handleViewMap = () => navigate(`/stalls/${eventId}`);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <EventHero event={event} />

            <div className="container mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <EventDescription description={event.description} />
                        <EventVenueOverview event={event} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <EventSidebar
                            event={event}
                            onViewMap={handleViewMap}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
