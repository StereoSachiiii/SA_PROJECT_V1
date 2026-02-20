interface GenreSelectionProps {
    selected: string[];
    onToggle: (genre: string) => void;
    onSave: () => void;
    isPending: boolean;
    genres: string[];
}

export const GenreSelection = ({
    selected,
    onToggle,
    onSave,
    isPending,
    genres
}: GenreSelectionProps) => {
    return (
        <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group text-left mb-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-white/20 transition-colors duration-700"></div>

                <div className="relative z-10">
                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 block">Personalization</span>
                            <h2 className="text-4xl font-black mb-3 tracking-tight">One Last Step!</h2>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-sm">
                                To help readers find you, please select the primary literary genres you'll be showcasing at your stalls.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 mt-2">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => onToggle(genre)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selected.includes(genre)
                                        ? 'bg-white text-indigo-600 border-white shadow-xl scale-105'
                                        : 'bg-indigo-500/30 text-white border-white/20 hover:border-white/50 hover:bg-indigo-500/50'
                                        }`}
                                >
                                    {genre.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        {selected.length === 0 && (
                            <div className="flex items-center gap-2 text-rose-300 text-[10px] uppercase font-black tracking-widest animate-pulse">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Select at least one category to proceed
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onSave}
                disabled={selected.length === 0 || isPending}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-[0.2em] relative overflow-hidden group"
            >
                <span className="relative z-10">{isPending ? 'Finalizing Setup...' : 'Complete & View Pass →'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover:animate-shimmer"></div>
            </button>
        </div>
    );
};
