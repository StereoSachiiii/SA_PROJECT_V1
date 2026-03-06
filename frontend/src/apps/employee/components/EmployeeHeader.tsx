import React from 'react';
import { User } from '@/shared/types/api';

interface EmployeeHeaderProps {
    user: User | null;
    activeTab: 'SCAN' | 'DASHBOARD' | 'SEARCH';
    setActiveTab: (tab: 'SCAN' | 'DASHBOARD' | 'SEARCH') => void;
    onExport: () => void;
    events: any[];
    selectedEventId: number | null;
    setSelectedEventId: (id: number) => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
    user, activeTab, setActiveTab, onExport,
    events, selectedEventId, setSelectedEventId
}) => {
    return (
        <header className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                        🛡️
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-black tracking-tight text-slate-900">Operational Hub</h1>
                            {events && events.length > 0 && (
                                <select
                                    className="bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-bold"
                                    value={selectedEventId || ''}
                                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                                >
                                    {events.map((evt: any) => (
                                        <option key={evt.id} value={evt.id}>{evt.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Operator: {user?.username}</p>
                    </div>
                </div>

                <nav className="flex bg-slate-100 p-1 rounded-xl">
                    {(['SCAN', 'QR Scanner', '🔍'] as const, ['DASHBOARD', 'Monitoring', '📊'] as const, ['SEARCH', 'Directory', '📇'] as const).map(() => null)}
                    {/* TypeScript mapping fix below */}
                    {[
                        { id: 'SCAN', label: 'QR Scanner', icon: '🔍' },
                        { id: 'DASHBOARD', label: 'Monitoring', icon: '📊' },
                        { id: 'SEARCH', label: 'Directory', icon: '📇' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={onExport}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                >
                    <span>📥</span> Export Logs
                </button>
            </div>
        </header >
    );
};
