
interface StallMapHeroProps {
    eventName: string;
}

export const StallMapHero = ({ eventName }: StallMapHeroProps) => {
    return (
        <section className="bg-white px-8 py-20 text-center border-t border-slate-100">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-4">
                Colombo International Book Fair 2026
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5
                       tracking-tight leading-tight">
                {eventName || 'The Premier Exhibition Experience.'}
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed mb-12">
                Secure your position in Sri Lanka's most anticipated literary event.
                Pricing reflects real foot-traffic patterns and spatial visibility.
            </p>
            <div className="flex gap-16 justify-center mb-12">
                {[
                    ['45,000+', 'Expected Footfall'],
                    ['200+', 'Publishers'],
                    ['10+', 'Halls'],
                ].map(([n, l]) => (
                    <div key={l}>
                        <div className="text-3xl font-black text-slate-900">{n}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{l}</div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold
                       uppercase tracking-wider shadow-sm hover:bg-slate-800 transition-all"
            >
                ↑ Back to Map
            </button>
        </section>
    );
};

export default StallMapHero;
