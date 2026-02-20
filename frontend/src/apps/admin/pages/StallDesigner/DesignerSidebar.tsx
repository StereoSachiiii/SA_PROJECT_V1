import { useDesigner } from './DesignerContext';
import { formatPrice } from './types';
import { STALL_CATEGORIES } from '@/shared/constants';

export function DesignerSidebar() {
    const {
        stalls, zones, setZones, influences, setInfluences,
        drawMode, setDrawMode,
        zoneType, setZoneType,
        influenceType, setInfluenceType
    } = useDesigner();

    const totalStalls = stalls.length;
    const available = stalls.filter(s => s.isAvailable).length;
    const blocked = totalStalls - available;
    const totalRevenue = stalls.reduce((sum, s) => sum + s.priceCents, 0);

    const handleSelectZoneType = (type: 'WALKWAY' | 'STAGE' | 'ENTRANCE') => {
        setZoneType(type);
        setDrawMode('ZONE');
    };

    const handleSelectInfluenceType = (type: 'NOISE' | 'TRAFFIC' | 'FACILITY') => {
        setInfluenceType(type);
        setDrawMode('INFLUENCE');
    };

    return (
        <div className="w-64 bg-white border-l border-gray-200 p-5 flex flex-col gap-5 flex-shrink-0 overflow-y-auto">
            {/* Mode Switcher */}
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Draw Mode</p>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['STALL', 'ZONE', 'INFLUENCE'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setDrawMode(mode)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${drawMode === mode ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {drawMode === 'STALL' && (
                <>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Layout Summary</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Stalls', value: totalStalls, color: 'text-gray-900' },
                                { label: 'Available', value: available, color: 'text-green-600' },
                                { label: 'Blocked', value: blocked, color: 'text-red-500' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{s.label}</span>
                                    <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Total Value</span>
                            <span className="text-sm font-black text-gray-900">{formatPrice(totalRevenue)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">By Category</p>
                        <div className="space-y-2">
                            {STALL_CATEGORIES.map(cat => {
                                const count = stalls.filter(s => s.category === cat).length;
                                if (count === 0) return null;
                                return (
                                    <div key={cat} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{cat}</span>
                                        <span className="text-xs font-bold text-gray-700">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {drawMode === 'ZONE' && (
                <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Zone to Draw</p>
                    <button onClick={() => handleSelectZoneType('WALKWAY')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${zoneType === 'WALKWAY' ? 'bg-gray-200 border-gray-400 text-gray-900' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'}`}>
                        Walkway
                    </button>
                    <button onClick={() => handleSelectZoneType('STAGE')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${zoneType === 'STAGE' ? 'bg-purple-200 border-purple-400 text-purple-900' : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'}`}>
                        Stage Area
                    </button>
                    <button onClick={() => handleSelectZoneType('ENTRANCE')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${zoneType === 'ENTRANCE' ? 'bg-orange-200 border-orange-400 text-orange-900' : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700'}`}>
                        Entrance
                    </button>

                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                        {zones.map((z) => (
                            <div key={z.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-600">{z.label}</span>
                                <button onClick={() => setZones(prev => prev.filter(x => x.id !== z.id))} className="text-red-400 hover:text-red-600">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {drawMode === 'INFLUENCE' && (
                <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Heatmap to Draw</p>
                    <button onClick={() => handleSelectInfluenceType('TRAFFIC')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${influenceType === 'TRAFFIC' ? 'bg-green-200 border-green-400 text-green-900' : 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700'}`}>
                        High Traffic Node
                    </button>
                    <button onClick={() => handleSelectInfluenceType('NOISE')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${influenceType === 'NOISE' ? 'bg-red-200 border-red-400 text-red-900' : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'}`}>
                        Noise Source
                    </button>
                    <button onClick={() => handleSelectInfluenceType('FACILITY')} className={`w-full py-2 border text-xs font-bold rounded-lg transition-colors ${influenceType === 'FACILITY' ? 'bg-blue-200 border-blue-400 text-blue-900' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'}`}>
                        Core Facility
                    </button>

                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                        {influences.map((inf) => (
                            <div key={inf.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-600">{inf.type} Node</span>
                                <button onClick={() => setInfluences(prev => prev.filter(x => x.id !== inf.id))} className="text-red-400 hover:text-red-600">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-[9px] text-gray-400 leading-relaxed">
                    {drawMode === 'STALL' && 'Draw rectangles to add stalls. Click to edit.'}
                    {drawMode === 'ZONE' && 'Add structural elements. They will be rendered underneath stalls.'}
                    {drawMode === 'INFLUENCE' && 'Place invisible heatmap nodes that vendor tooltips use for recommendations.'}
                </p>
            </div>
        </div>
    );
}
