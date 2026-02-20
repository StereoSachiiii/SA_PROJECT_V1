import { useDesigner } from './DesignerContext';

export function DesignerHeader({
    onSave, saving, message
}: {
    onSave: () => void;
    saving: boolean;
    message: { text: string; type: 'success' | 'error' } | null;
}) {
    const { event, hall } = useDesigner();

    const stats = [
        { label: 'Tier', value: hall.tier || '—' },
        { label: 'Category', value: hall.mainCategory?.replace('_', ' ') || '—' },
        { label: 'Floor', value: hall.floorLevel != null ? `Level ${hall.floorLevel}` : 'G' },
        { label: 'Area', value: hall.totalSqFt ? `${hall.totalSqFt.toLocaleString()} sqft` : '—' },
        { label: 'Capacity', value: hall.capacity ? `${hall.capacity.toLocaleString()}` : '—' },
        { label: 'Environment', value: hall.isAirConditioned ? 'A/C' : 'Non-A/C' },
    ];

    return (
        <div className="flex-shrink-0 bg-white">
            {/* Top Toolbar */}
            <div className="h-12 border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-gray-800 truncate max-w-[200px]">{event.name}</span>
                    <span className="text-gray-300">·</span>
                    <span className="font-bold text-sm text-blue-600">{hall.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    {message && (
                        <span className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={onSave} disabled={saving}
                        className="px-5 py-2 bg-gray-900 text-white hover:bg-black disabled:opacity-30 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        {saving ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>
            </div>

            {/* Hall Info Ribbon */}
            <div className="border-b border-gray-200 px-6 py-3">
                <div className="flex items-center gap-8 overflow-x-auto">
                    {stats.map(s => (
                        <div key={s.label} className="flex-shrink-0">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                            <p className="text-sm font-bold text-gray-800">{s.value}</p>
                        </div>
                    ))}
                    {hall.expectedFootfall && (
                        <div className="flex-shrink-0">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Footfall</p>
                            <p className="text-sm font-bold text-gray-800">{hall.expectedFootfall.toLocaleString()}/day</p>
                        </div>
                    )}
                    <div className="flex-shrink-0 ml-auto">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${hall.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' :
                                hall.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>{hall.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
