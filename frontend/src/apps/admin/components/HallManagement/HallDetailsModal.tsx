import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Hall, Venue, Building, PublisherCategory } from '@/shared/types/api';
import { HALL_TIERS, PUBLISHER_GENRES, NOISE_LEVELS } from '@/shared/constants';

interface HallDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingHall: Hall | null;
    selectedVenue: Venue | null;
    selectedBuilding: Building | null;
    onSave: (data: any) => Promise<void>;
    isSaving: boolean;
    error: string | null;
}

export const HallDetailsModal: React.FC<HallDetailsModalProps> = ({
    isOpen,
    onClose,
    editingHall,
    selectedVenue,
    selectedBuilding,
    onSave,
    isSaving,
    error
}) => {
    const [formData, setFormData] = useState({
        name: '',
        tier: 'STANDARD',
        floorLevel: '1',
        totalSqFt: '0',
        capacity: '0',
        mainCategory: 'FICTION' as PublisherCategory,
        isIndoor: true,
        isAirConditioned: true,
        isGroundFloor: true,
        expectedFootfall: '0',
        noiseLevel: 'LOW',
        distanceFromEntrance: '0',
        distanceFromParking: '0',
        nearbyFacilities: ''
    });

    useEffect(() => {
        if (editingHall) {
            setFormData({
                name: editingHall.name || '',
                tier: editingHall.tier || 'STANDARD',
                floorLevel: editingHall.floorLevel?.toString() || '1',
                totalSqFt: editingHall.totalSqFt?.toString() || '0',
                capacity: editingHall.capacity?.toString() || '0',
                mainCategory: editingHall.mainCategory || 'FICTION',
                isIndoor: editingHall.isIndoor ?? true,
                isAirConditioned: editingHall.isAirConditioned ?? true,
                isGroundFloor: editingHall.isGroundFloor ?? true,
                expectedFootfall: editingHall.expectedFootfall?.toString() || '0',
                noiseLevel: editingHall.noiseLevel || 'LOW',
                distanceFromEntrance: editingHall.distanceFromEntrance?.toString() || '0',
                distanceFromParking: editingHall.distanceFromParking?.toString() || '0',
                nearbyFacilities: editingHall.nearbyFacilities || ''
            });
        } else {
            setFormData({
                name: '',
                tier: 'STANDARD',
                floorLevel: '1',
                totalSqFt: '0',
                capacity: '0',
                mainCategory: 'FICTION',
                isIndoor: true,
                isAirConditioned: true,
                isGroundFloor: true,
                expectedFootfall: '0',
                noiseLevel: 'LOW',
                distanceFromEntrance: '0',
                distanceFromParking: '0',
                nearbyFacilities: ''
            });
        }
    }, [editingHall, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSave(formData);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                <div className="bg-gray-900 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="font-bold text-sm uppercase tracking-wider">
                            {editingHall ? 'Edit Hall' : 'Create New Hall'}
                        </h2>
                        <p className="text-gray-400 text-[10px] mt-1 uppercase">
                            {selectedVenue?.name} / {selectedBuilding?.name}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-lg flex gap-2 items-center">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">Core Info</h3>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Hall Name *</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Hall A"
                                value={formData.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tier</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.tier}
                                    onChange={e => handleChange('tier', e.target.value)}
                                >
                                    {HALL_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Floor Level</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.floorLevel}
                                    onChange={e => handleChange('floorLevel', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Total Sq Ft</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.totalSqFt}
                                    onChange={e => handleChange('totalSqFt', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Capacity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.capacity}
                                    onChange={e => handleChange('capacity', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Main Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.mainCategory}
                                onChange={e => handleChange('mainCategory', e.target.value as PublisherCategory)}
                            >
                                {PUBLISHER_GENRES.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">Environment & Metadata</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expected Footfall</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.expectedFootfall}
                                    onChange={e => handleChange('expectedFootfall', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Noise Level</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.noiseLevel}
                                    onChange={e => handleChange('noiseLevel', e.target.value)}
                                >
                                    {NOISE_LEVELS.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Distance from Entrance (m)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.distanceFromEntrance}
                                    onChange={e => handleChange('distanceFromEntrance', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Distance from Parking (m)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.distanceFromParking}
                                    onChange={e => handleChange('distanceFromParking', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nearby Facilities</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Restrooms, Food Court, ATM"
                                value={formData.nearbyFacilities}
                                onChange={e => handleChange('nearbyFacilities', e.target.value)}
                            />
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.isIndoor} onChange={e => handleChange('isIndoor', e.target.checked)} className="rounded" />
                                <span className="text-xs font-bold text-gray-600 uppercase">Indoor</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.isAirConditioned} onChange={e => handleChange('isAirConditioned', e.target.checked)} className="rounded" />
                                <span className="text-xs font-bold text-gray-600 uppercase">Air Conditioned</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.isGroundFloor} onChange={e => handleChange('isGroundFloor', e.target.checked)} className="rounded" />
                                <span className="text-xs font-bold text-gray-600 uppercase">Ground Floor</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : editingHall ? 'Update Hall' : 'Create Hall'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
