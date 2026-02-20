interface DashboardHeaderProps {
    businessName?: string;
    username: string;
    canBook: boolean;
    onBookClick: () => void;
}

export const DashboardHeader = ({ businessName, username, canBook, onBookClick }: DashboardHeaderProps) => {
    return (
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Command Center</span>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Dashboard</h1>
                <p className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{businessName || username}</span></p>
            </div>

            <button
                onClick={onBookClick}
                disabled={!canBook}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl active:scale-95 ${canBook
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
            >
                <span className="relative z-10">{canBook ? 'Book New Stall' : 'Limit Reached'}</span>
                {canBook && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -translate-x-full group-hover:animate-shimmer"></div>}
            </button>
        </header>
    );
};
