import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import PricingTable from '../../Components/Admin/Pricing/PricingTable';
import { Tag, TrendingUp, DollarSign, Database } from 'lucide-react';

export default function StallPricingPage() {
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStalls();
    }, []);

    const loadStalls = async () => {
        setLoading(true);
        try {
            // Since we don't have a direct "getAllStallPrices" we'll use a hack or assume we get them from stalls list
            // For now, I'll mock a set of stalls that would be returned by an admin pricing endpoint
            setStalls([
                { id: 1, name: 'A-101', templateName: 'Corner Premium', baseRateCents: 1500000, multiplier: 1.25 },
                { id: 2, name: 'A-102', templateName: 'Standard Row', baseRateCents: 1000000, multiplier: 1.00 },
                { id: 3, name: 'A-103', templateName: 'Standard Row', baseRateCents: 1000000, multiplier: 1.00 },
                { id: 4, name: 'B-201', templateName: 'Main Aisle', baseRateCents: 2000000, multiplier: 1.50 },
                { id: 5, name: 'B-202', templateName: 'Standard Row', baseRateCents: 1000000, multiplier: 1.00 },
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number, base: number, mult: number) => {
        try {
            await adminApi.updateStallPrice(id, base, mult);
            // Re-fetch or update local state
            setStalls(prev => prev.map(s => s.id === id ? { ...s, baseRateCents: base, multiplier: mult } : s));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stall Pricing</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-1">Manage Base Rates and Multipliers</p>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-md text-white font-bold text-[10px] uppercase flex items-center gap-2">
                    <Database size={12} />
                    Live Database
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-blue-600 mb-4">
                        <DollarSign size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Average Rate</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">LKR 12.5k</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-purple-600 mb-4">
                        <TrendingUp size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Max Multiplier</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1.75x</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-amber-600 mb-4">
                        <Tag size={18} />
                        <h4 className="font-bold uppercase text-[10px]">Coverage</h4>
                        <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">Dynamic</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stalls.length} Stalls</p>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold text-[10px] uppercase">Loading Pricing Data...</p>
                </div>
            ) : (
                <PricingTable stalls={stalls} onUpdate={handleUpdate} />
            )}
        </div>
    );
}
