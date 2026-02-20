interface DashboardStatsProps {
    limit: number;
    used: number;
    remaining: number;
}

export const DashboardStats = ({ limit, used, remaining }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Stall Limit</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{limit}</span>
                        <span className="text-xs font-bold text-slate-300">Total</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Active Bookings</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-indigo-600 tracking-tighter">{used}</span>
                        <span className="text-xs font-bold text-indigo-200">Allocated</span>
                    </div>
                </div>
            </div>

            <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group ${remaining === 0 ? 'bg-rose-50/30' : ''}`}>
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform ${remaining === 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}></div>
                <div className="relative z-10">
                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${remaining === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Remaining Slots</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black tracking-tighter ${remaining === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{remaining}</span>
                        <span className={`text-xs font-bold ${remaining === 0 ? 'text-rose-200' : 'text-emerald-200'}`}>Available</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
