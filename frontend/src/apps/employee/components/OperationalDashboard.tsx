import React from 'react';

interface OperationalDashboardProps {
    stats: any;
    loadingStats: boolean;
}

export const OperationalDashboard: React.FC<OperationalDashboardProps> = ({ stats, loadingStats }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Total Stalls', val: stats?.totalStalls, icon: '🏢', color: 'bg-blue-500' },
                    { title: 'Booked Stalls', val: stats?.reservedStalls, icon: '📑', color: 'bg-indigo-500' },
                    { title: 'Checked In', val: stats?.checkedInCount || 0, icon: '🚶', color: 'bg-emerald-500' }
                ].map((stat) => (
                    <div key={stat.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-bl-full`}></div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.title}</h3>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tabular-nums">
                            {loadingStats ? '...' : stat.val}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Occupancy Overview
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-400">
                                <span>Vendor Check-in Progress</span>
                                <span>{stats?.reservedStalls ? Math.round(((stats?.checkedInCount || 0) / stats.reservedStalls) * 100) : 0}%</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000"
                                    style={{ width: `${stats?.reservedStalls ? Math.min(100, ((stats?.checkedInCount || 0) / stats.reservedStalls) * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
