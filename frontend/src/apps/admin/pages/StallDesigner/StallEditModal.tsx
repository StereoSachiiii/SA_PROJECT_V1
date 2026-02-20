import { useDesigner } from './DesignerContext';
import { STALL_SIZES, STALL_CATEGORIES } from '@/shared/constants';
import { StallSize, StallCategory } from '@/shared/types/api';

export function StallEditModal() {
    const { stalls, editingStallId, updateStall, deleteStall, setEditingStallId } = useDesigner();

    if (!editingStallId) return null;
    const stall = stalls.find(s => s.id === editingStallId);
    if (!stall) return null;

    const onClose = () => setEditingStallId(null);

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[460px] border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-sm uppercase tracking-widest text-gray-700">Stall Properties</h2>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: {stall.id > 10_000_000_000 ? 'New (unsaved)' : `#${stall.id}`}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Stall Name</label>
                        <input
                            type="text" value={stall.name}
                            onChange={e => updateStall(stall.id, { name: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Size + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Size</label>
                            <select
                                value={stall.size}
                                onChange={e => updateStall(stall.id, { size: e.target.value as StallSize })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {STALL_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                            <select
                                value={stall.category}
                                onChange={e => updateStall(stall.id, { category: e.target.value as StallCategory })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {STALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Price + SqFt */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Price (LKR)</label>
                            <input
                                type="number" step="100"
                                value={(stall.priceCents / 100).toFixed(0)}
                                onChange={e => updateStall(stall.id, { priceCents: parseFloat(e.target.value) * 100 })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Area (sqft)</label>
                            <input
                                type="number"
                                value={stall.sqFt || ''}
                                onChange={e => updateStall(stall.id, { sqFt: parseInt(e.target.value) || undefined })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="—"
                            />
                        </div>
                    </div>

                    {/* Position + Size */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Canvas Position (%)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['x', 'y', 'w', 'h'] as const).map(key => (
                                <div key={key}>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase block mb-1">{key === 'w' ? 'Width' : key === 'h' ? 'Height' : key.toUpperCase()}</span>
                                    <input
                                        type="number" step="0.1"
                                        value={stall.geometry[key].toFixed(1)}
                                        onChange={e => updateStall(stall.id, { geometry: { ...stall.geometry, [key]: parseFloat(e.target.value) } })}
                                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs font-bold text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Availability toggle */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="text-xs font-bold text-gray-600">Available for booking</span>
                        <button
                            onClick={() => updateStall(stall.id, { isAvailable: !stall.isAvailable })}
                            className={`w-10 h-6 rounded-full transition-colors relative ${stall.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${stall.isAvailable ? 'left-5' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-bold text-xs uppercase transition-colors">Done</button>
                        <button
                            onClick={() => deleteStall(stall.id)}
                            className="flex-1 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-bold text-xs uppercase transition-colors"
                        >Delete Stall</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
