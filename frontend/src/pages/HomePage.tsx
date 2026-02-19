import Hero from '../Components/Hero'
import VisionMission from '../Components/VisionMission'
import Services from '../Components/Services'
import ReservationList from '../Components/ReservationList'
import UpcomingEvents from '../Components/UpcomingEvents'

import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const { user } = useAuth()

    // Safety check (should be handled by ProtectedRoute, but good for TS)
    const userId = user?.id

    const { data: reservations, isLoading: loadingReservations } = useQuery({
        queryKey: ['reservations', userId],
        queryFn: () => reservationApi.getByUser(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })



    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary-200 selection:text-secondary">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-200/20 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200/60">
                    <div>
                        <h1 className="text-4xl font-black text-secondary tracking-tight mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 font-medium">Welcome back, {user?.username}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-sm font-bold text-gray-600">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* LINEAR SECTION STACK */}
                <div className="flex flex-col gap-16">

                    {/* 1. Hero Banner */}
                    <section className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 transform hover:scale-[1.002] transition-transform duration-500 relative group">
                        <Hero />
                    </section>

                    {/* 2. Quick Actions (Now a horizontal CTA bar or full-width section) */}
                    <section>
                        <div className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 p-10 rounded-3xl shadow-xl border border-primary-700/20 relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8 transform hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/30 transition-colors duration-500"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center text-black shrink-0">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-black text-3xl text-black mb-2 tracking-tight">Expand Your Presence</h3>
                                    <p className="text-black/70 text-lg font-extrabold leading-relaxed">
                                        Ready to reach more readers? Book a new stall instantly.
                                    </p>
                                </div>
                            </div>

                            <a href="/events" className="w-full md:w-auto px-12 text-center bg-secondary text-primary-400 font-black py-5 rounded-xl shadow-lg hover:shadow-glow-gold hover:bg-black hover:text-white transition-all duration-300 relative z-10 whitespace-nowrap text-lg">
                                Book a New Stall
                            </a>
                        </div>
                    </section>


                    {/* 2. Upcoming Events - NEW */}
                    <section className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <span className="text-2xl">📅</span>
                                Upcoming Events
                            </h2>
                            <Link to="/events" className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-full transition-colors">
                                View All &rarr;
                            </Link>
                        </div>
                        <UpcomingEvents />
                    </section>

                    {/* 3. Reservations Section */}
                    <section className="bg-white/60 backdrop-blur-xl rounded-3xl p-1 border border-white/40 shadow-lg min-h-[400px]">
                        <div className="p-10">
                            <h2 className="text-3xl font-black text-secondary mb-10 flex items-center gap-4">
                                <div className="w-2 h-10 bg-primary-500 rounded-full"></div>
                                Your Booking Dashboard
                            </h2>
                            <ReservationList
                                reservations={reservations}
                                isLoading={loadingReservations}
                            />
                        </div>
                    </section>

                    {/* 4. Genre Management Section */}


                    {/* 4. Services */}
                    <section className="rounded-3xl bg-secondary p-1 overflow-hidden shadow-2xl">
                        <div className="p-10">
                            <h2 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-6">Event Services</h2>
                            <Services />
                        </div>
                    </section>

                    {/* 5. Vision & Mission Footer Section */}
                    <section className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100">
                        <VisionMission />
                    </section>
                </div>
            </div>
        </div>
    )
}
