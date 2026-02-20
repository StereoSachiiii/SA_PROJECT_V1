import UpcomingEvents from '@/apps/public/components/UpcomingEvents';

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Discover Upcoming Fairs
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Browse our selection of upcoming exhibitions and secure your booth
                        before slots are filled. We use real-time data to help you choose the best location.
                    </p>
                </header>

                <section className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl">
                    <UpcomingEvents />
                </section>

                <footer className="mt-16 text-center text-slate-400 text-sm">
                    <p>&copy; 2026 Colombo International Book Fair. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
