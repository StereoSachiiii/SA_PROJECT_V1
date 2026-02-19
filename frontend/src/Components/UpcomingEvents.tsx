import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../api/publicApi'
import { Link } from 'react-router-dom'

export default function UpcomingEvents() {
    const { data: eventEnvelope, isLoading, error } = useQuery({
        queryKey: ['active-events'],
        queryFn: publicApi.getActiveEvents,
        staleTime: 1000 * 60 * 15 // 15 mins
    })

    const events = eventEnvelope?.content || []

    if (isLoading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    )

    if (error) return (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            Failed to load events. Please try again later.
        </div>
    )

    if (events.length === 0) return (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-lg font-bold text-gray-500">No Upcoming Events</h3>
            <p className="text-gray-400 text-sm">Check back later for new book fairs!</p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col group">
                    <div className="h-32 bg-gradient-to-br from-primary-100 to-blue-50 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">📅</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-primary-700 shadow-sm">
                            {event.status}
                        </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {event.name}
                        </h3>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(event.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {event.location || 'Location TBA'}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Link
                                to={`/stalls/${event.id}`}
                                className="block w-full text-center bg-gray-50 hover:bg-primary-50 text-gray-900 hover:text-primary-700 font-bold py-3 rounded-xl transition-colors border border-gray-200"
                            >
                                View Stalls
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
