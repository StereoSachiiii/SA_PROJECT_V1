interface EventDetailBannerProps {
    event: {
        id: number;
        name: string;
        venueName?: string;
    };
}

export const EventDetailBanner = ({ event }: EventDetailBannerProps) => {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="relative z-10">
                <span className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2 block">Event Details</span>
                <h2 className="text-3xl font-black mb-1">{event?.name || 'Unknown Event'}</h2>
                <p className="text-indigo-100 font-medium flex items-center gap-2 mt-4 text-sm md:text-base">
                    <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event?.venueName || 'Venue TBD'}
                </p>
            </div>
        </div>
    );
};
