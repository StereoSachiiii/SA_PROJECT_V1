import { useState } from 'react';
import { Save, X, Edit2 } from 'lucide-react';

interface StallPricing {
    id: number;
    name: string;
    templateName: string;
    baseRateCents: number;
    multiplier: number;
}

interface PricingTableProps {
    stalls: StallPricing[];
    onUpdate: (id: number, baseRate: number, multiplier: number) => Promise<void>;
}

export default function PricingTable({ stalls, onUpdate }: PricingTableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<{ base: number; mult: number }>({ base: 0, mult: 1 });
    const [saving, setSaving] = useState(false);

    const startEdit = (stall: StallPricing) => {
        setEditingId(stall.id);
        setEditValues({ base: stall.baseRateCents, mult: stall.multiplier });
    };

    const handleSave = async (id: number) => {
        setSaving(true);
        try {
            await onUpdate(id, editValues.base, editValues.mult);
            setEditingId(null);
        } catch (err) {
            alert("Update failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Stall Name</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Base Rate (LKR)</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Multiplier</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Final Price</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stalls.map((stall) => {
                            const isEditing = editingId === stall.id;
                            const finalPrice = isEditing
                                ? (editValues.base * editValues.mult) / 100
                                : (stall.baseRateCents * stall.multiplier) / 100;

                            return (
                                <tr key={stall.id} className={`transition-colors ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-900">{stall.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{stall.templateName}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                className="w-32 bg-white border border-gray-200 px-3 py-1.5 rounded-md font-semibold text-sm outline-none focus:border-blue-500 transition-all"
                                                value={editValues.base}
                                                onChange={e => setEditValues({ ...editValues, base: Number(e.target.value) })}
                                            />
                                        ) : (
                                            <span className="font-semibold text-gray-700">LKR {(stall.baseRateCents / 100).toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-24 bg-white border border-gray-200 px-3 py-1.5 rounded-md font-semibold text-sm outline-none focus:border-blue-500 transition-all"
                                                value={editValues.mult}
                                                onChange={e => setEditValues({ ...editValues, mult: Number(e.target.value) })}
                                            />
                                        ) : (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">x{stall.multiplier.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`text-sm font-bold ${isEditing ? 'text-blue-600' : 'text-gray-900'}`}>
                                            LKR {finalPrice.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSave(stall.id)}
                                                    disabled={saving}
                                                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-2 bg-white border border-gray-200 text-gray-400 rounded-md hover:text-gray-900 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(stall)}
                                                className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
