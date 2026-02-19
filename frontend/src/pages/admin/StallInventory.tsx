import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import {
    Filter,
    Plus,
    LayoutGrid,
    Search,
    IndianRupee,
    Hash,
    Maximize2,
    ArrowLeft,
    Download,
    AlertCircle
} from 'lucide-react';

export default function StallInventory() {
    const { id: hallId } = useParams<{ id: string }>();
    const [stalls, setStalls] = useState<any[]>([]);
    const [hall, setHall] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showBulkModal, setShowBulkModal] = useState(false);

    useEffect(() => {
        if (hallId) {
            loadData();
        }
    }, [hallId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [halls, stallData] = await Promise.all([
                adminApi.getAllHalls(),
                adminApi.getStallsByHall(Number(hallId))
            ]);
            const currentHall = halls.find((h: any) => h.id === Number(hallId));
            setHall(currentHall);
            setStalls(stallData);
        } catch (err) {
            console.error("Failed to load inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'FOOD': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'RETAIL': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'SPONSOR': return 'text-purple-600 bg-purple-50 border-purple-100';
            case 'ANCHOR': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const filteredStalls = stalls.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Loading Inventory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Link to="/admin/halls" className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase hover:text-blue-600 transition-colors">
                        <ArrowLeft size={14} />
                        Back to Halls
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{hall?.name || 'Hall Inventory'}</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px]">Manage physical stall templates and base pricing</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-[10px] uppercase hover:bg-gray-50 transition-all">
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-black transition-all shadow-lg"
                    >
                        <Plus size={16} />
                        Bulk Generate
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Search & Filters */}
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find stall by ID or name..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 font-bold text-[10px] uppercase hover:bg-gray-100 transition-all">
                        <Filter size={16} />
                        Full Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stall Definition</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Classification</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Physical Specs</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Base Pricing</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStalls.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <LayoutGrid size={48} />
                                            <p className="font-bold uppercase text-xs">No stalls found in this hall</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStalls.map((stall) => (
                                    <tr key={stall.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                                    <Hash size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">{stall.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">{stall.size} Tier</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${getCategoryColor(stall.category)}`}>
                                                {stall.category || 'RETAIL'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1.5 font-bold text-gray-700 text-sm">
                                                    <Maximize2 size={12} className="text-gray-400" />
                                                    {stall.sqFt || '??'} <span className="text-[10px] text-gray-400 font-bold">SQFT</span>
                                                </div>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Geometric Template</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className="font-black text-gray-900 text-sm">
                                                    LKR {(stall.basePriceCents / 100).toLocaleString()}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Gross Base Rate</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${stall.isAvailable ? 'bg-emerald-500' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                    {stall.isAvailable ? 'Active' : 'Blocked'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Inventory: {stalls.length} Total Units
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                        <AlertCircle size={14} className="text-blue-500" />
                        Changes here affect all subsequent events
                    </div>
                </div>
            </div>

            {/* Modal - Simulated for Bulk */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6 bg-gray-900 text-white">
                            <h3 className="text-xl font-bold">Bulk Stall Generator</h3>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Automatic Template Provisioning</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                                        <input type="number" defaultValue={20} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Size Tier</label>
                                        <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                                            <option>SMALL</option>
                                            <option>MEDIUM</option>
                                            <option>LARGE</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Category</label>
                                    <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold">
                                        <option>RETAIL</option>
                                        <option>FOOD</option>
                                        <option>SPONSOR</option>
                                        <option>ANCHOR</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Rate (LKR)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input type="number" defaultValue={5000} className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Confirm & Generate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
