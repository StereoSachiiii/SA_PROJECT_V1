import type { Reservation } from '../types'
import ReservationTicket from './ReservationTicket'

interface ReservationListProps {
    reservations: Reservation[] | undefined;
    isLoading: boolean;
}

export default function ReservationList({ reservations, isLoading }: ReservationListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 text-gray-400 font-medium animate-pulse">
                Loading your tickets...
            </div>
        )
    }

    if (!reservations || reservations.length === 0) {
        return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-3xl text-center">
                <p className="text-gray-500 mb-4">You haven't reserved any stalls yet.</p>
                <a href="/stalls" className="inline-block px-6 py-2 bg-primary-500 text-secondary font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
                    Browse Stalls
                </a>
            </div>
        )
    }

    const grouped = reservations?.reduce((acc, res) => {
        const eventName = res.event?.name || 'Uncategorized'
        if (!acc[eventName]) acc[eventName] = []
        acc[eventName].push(res)
        return acc
    }, {} as Record<string, Reservation[]>)

    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-secondary tracking-tight">Your Tickets</h2>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200 shadow-sm text-gray-500">
                    {reservations.filter(r => r.status !== 'CANCELLED').length} Active
                </span>
            </div>

            <div className="space-y-12">
                {Object.entries(grouped || {}).map(([eventName, eventReservations]) => (
                    <div key={eventName} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-base font-black uppercase tracking-[0.2em] text-gray-400">
                                {eventName}
                            </h3>
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                {eventReservations[0]?.event?.venueName || 'No Venue'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {eventReservations.map((res) => (
                                <ReservationTicket key={res.id} reservation={res} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
