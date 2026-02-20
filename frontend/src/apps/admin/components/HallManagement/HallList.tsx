import React from 'react';
import { Building2, FileText, Globe, Edit, Archive, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hall } from '@/shared/types/api';
import { StatusBadge } from '@/shared/components/StatusBadge';

interface HallListProps {
    halls: Hall[];
    onPublish: (hall: Hall) => void;
    onArchive: (hall: Hall) => void;
    onEdit: (hall: Hall) => void;
    onOpenCreate: () => void;
}

export const HallList: React.FC<HallListProps> = ({
    halls,
    onPublish,
    onArchive,
    onEdit,
    onOpenCreate
}) => {
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'PREMIUM': return 'text-purple-600 border-purple-200 bg-purple-50';
            case 'STANDARD': return 'text-blue-600 border-blue-200 bg-blue-50';
            case 'BUDGET': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
            default: return 'text-gray-600 border-gray-200 bg-gray-50';
        }
    };

    if (halls.length === 0) {
        return (
            <div className="col-span-full py-20 text-center opacity-40">
                <Building2 size={48} className="mx-auto mb-3" />
                <p className="font-bold uppercase text-xs">No halls found in this building</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {halls.map(hall => (
                <div key={hall.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{hall.name}</h3>
                                <div className="mt-1">
                                    <StatusBadge status={hall.status} type="HALL" />
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getTierColor(hall.tier || 'STANDARD')}`}>
                                {hall.tier || 'STANDARD'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Capacity</p>
                                <p className="font-black text-gray-900 mt-0.5">{hall.capacity?.toLocaleString() || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Floor</p>
                                <p className="font-black text-gray-900 mt-0.5">L{hall.floorLevel !== undefined ? hall.floorLevel : '1'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-4 flex gap-2">
                        <Link
                            to={`/admin/halls/${hall.id}/inventory`}
                            className="flex-1 text-center py-2 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-lg font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1.5"
                        >
                            <FileText size={12} />
                            Inventory
                        </Link>
                        {hall.status !== 'PUBLISHED' && (
                            <button
                                onClick={() => onPublish(hall)}
                                title="Publish Hall"
                                className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                            >
                                <Globe size={16} />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(hall)}
                            title="Edit Hall"
                            className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => onArchive(hall)}
                            title="Archive Hall"
                            className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                            <Archive size={16} />
                        </button>
                    </div>
                </div>
            ))}

            {/* Create New Hall Floating/End Card? No, better to have it as a button in the header usually, but I'll keep it consistent with the parent's logic which had a button in the header. */}
        </div>
    );
};
