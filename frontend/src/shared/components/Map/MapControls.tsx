interface MapControlsProps {
    zoomIn: () => void;
    zoomOut: () => void;
    resetTransform: () => void;
}

export function MapControls({ zoomIn, zoomOut, resetTransform }: MapControlsProps) {
    return (
        <div className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl font-bold text-xl pointer-events-auto"
                title="Zoom In"
            >
                +
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl font-bold text-xl pointer-events-auto"
                title="Zoom Out"
            >
                −
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); resetTransform(); }}
                className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 
                           flex items-center justify-center text-slate-700 hover:bg-slate-50 
                           active:scale-95 transition-all shadow-xl pointer-events-auto"
                title="Reset View"
            >
                <span className="text-sm font-black">↺</span>
            </button>
        </div>
    );
}

export function MapLegend() {
    return (
        <div className="absolute bottom-6 left-6 z-[100] flex gap-3 items-center
                    bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl
                    border border-slate-200 shadow-xl pointer-events-none">
            {[
                { cls: 'bg-white border border-slate-300', label: 'Available' },
                { cls: 'bg-blue-50 border-2 border-blue-500', label: 'Selected' },
                { cls: 'bg-amber-50 border border-amber-400', label: 'Premium' },
                { cls: 'bg-slate-100 border border-slate-200 opacity-60', label: 'Reserved' },
            ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-md ${cls}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
}
