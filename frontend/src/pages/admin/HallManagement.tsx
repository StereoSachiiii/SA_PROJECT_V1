import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import {
    Plus,
    Edit2,
    Activity,
    MapPin,
    Users,
    Maximize,
    ChevronRight,
    Search,
    Archive
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HallManagement() {
    const [halls, setHalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadHalls();
    }, []);

    const loadHalls = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllHalls();
            setHalls(data);
        } catch (err) {
            console.error("Failed to load halls:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'FLAGSHIP': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'STANDARD': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ANNEX': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'OUTDOOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-green-100 text-green-700';
            case 'DRAFT': return 'bg-orange-100 text-orange-700';
            case 'ARCHIVED': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredHalls = halls.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Loading Halls...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hall Management</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">Manage Venue Infrastructure & Pricing Tiers</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Plus size={16} />
                    Create New Hall
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Halls', value: halls.length, icon: Activity, color: 'text-blue-600' },
                    { label: 'Flagship Tiers', value: halls.filter(h => h.tier === 'FLAGSHIP').length, icon: MapPin, color: 'text-purple-600' },
                    { label: 'Total Capacity', value: halls.reduce((sum, h) => sum + (h.capacity || 0), 0), icon: Users, color: 'text-emerald-600' },
                    { label: 'published', value: halls.filter(h => h.status === 'PUBLISHED').length, icon: Maximize, color: 'text-orange-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <stat.icon className={stat.color} size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Filter halls by name..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Hall Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredHalls.map((hall) => (
                    <div key={hall.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{hall.name}</h3>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getTierColor(hall.tier)}`}>
                                        {hall.tier}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${getStatusColor(hall.status)}`}>
                                    {hall.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Physical Size</p>
                                    <p className="font-bold text-gray-700 text-sm whitespace-nowrap">{hall.totalSqFt?.toLocaleString() || '0'} SQ.FT</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Capacity</p>
                                    <p className="font-bold text-gray-700 text-sm">{hall.capacity || '0'} PEOPLE</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Floor Level</p>
                                    <p className="font-bold text-gray-700 text-sm">{hall.floorLevel === 0 ? 'GROUND' : `LEVEL ${hall.floorLevel}`}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Air Conditioned</p>
                                    <p className="font-bold text-gray-700 text-sm">{hall.isAirConditioned ? 'YES' : 'NO'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-all" title="Edit Hall">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-rose-600 transition-all" title="Archive Hall">
                                    <Archive size={16} />
                                </button>
                            </div>

                            <Link
                                to={`/admin/halls/${hall.id}/inventory`}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 font-bold text-[10px] uppercase hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            >
                                Manage Stalls
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
