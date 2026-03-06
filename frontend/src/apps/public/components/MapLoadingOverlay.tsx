
export const MapLoadingOverlay = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                <span className="text-slate-400 text-sm tracking-widest uppercase">Loading venue</span>
            </div>
        </div>
    );
};

export default MapLoadingOverlay;
