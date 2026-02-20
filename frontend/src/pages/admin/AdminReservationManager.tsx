import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Reservation } from '../../types/api';
import {
    Search,
    Download,
    Eye,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    Hash,
    ClipboardList
} from 'lucide-react';

export default function AdminReservationManager() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING_PAYMENT' | 'CANCELLED'>('ALL');

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllReservations();
            setReservations(data);
        } catch (err) {
            console.error("Failed to load reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredReservations = Array.isArray(reservations) ? reservations.filter(res => {
        const username = res.user?.username || '';
        const qrCode = res.qrCode || '';
        // In the API response we receive, the stall might be in a different shape
        // For now, let's just search by username and QR code
        const matchesSearch =
            username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qrCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING_PAYMENT': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Loading Reservations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
                    <p className="text-gray-500 font-semibold uppercase text-[10px] mt-2">Manage & Audit Booking Data</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors">
                        <Download size={14} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by vendor or ticket ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    {(['ALL', 'PAID', 'PENDING_PAYMENT', 'CANCELLED'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${statusFilter === status
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendor Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Financials</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <ClipboardList size={48} />
                                            <p className="font-bold uppercase text-xs">No matching reservations found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                                                    {res.user?.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{res.user?.username || 'Unknown Vendor'}</p>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase">{res.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 font-black uppercase flex items-center gap-1.5">
                                                    <Hash size={12} className="text-gray-400" />
                                                    {res.qrCode || `RES-${res.id}`}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    {new Date(res.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <p className="font-black text-gray-900 text-sm">
                                                    LKR {((res.totalPriceCents || 0) / 100).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">
                                                    {res.stalls?.length || 0} Stalls
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border ${getStatusColor(res.status)}`}>
                                                {res.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 transition-all" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                {res.status === 'PENDING_PAYMENT' && (
                                                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-green-600 transition-all" title="Confirm Payment">
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                                {res.status !== 'CANCELLED' && (
                                                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-rose-600 transition-all" title="Cancel Reservation">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Count */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Showing {filteredReservations.length} of {reservations.length} Bookings
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                        <AlertCircle size={12} />
                        Data refreshes in real-time
                    </div>
                </div>
            </div>
        </div>
    );
}
