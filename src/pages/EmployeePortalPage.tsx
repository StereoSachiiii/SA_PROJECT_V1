import { useQuery } from '@tanstack/react-query'
import { stallApi, reservationApi, publisherApi } from '../api'
import { useState } from 'react'

/**
 * Employee Portal Page
 * 
 * TODO [FRONTEND DEV 3]:
 * - Add search/filter functionality
 * - Add reservation details view
 * - Add export to CSV feature
 * - Add summary statistics cards
 * - Style with proper table design
 */
function EmployeePortalPage() {

    // Search State
    const [searchTerm, setSearchTerm] = useState("");

    const { data: stalls } = useQuery({
        queryKey: ['stalls'],
        queryFn: stallApi.getAll,
    })

    const { data: reservations } = useQuery({
        queryKey: ['reservations'],
        queryFn: reservationApi.getAll,
    })

    const { data: publishers } = useQuery({
        queryKey: ['publishers'],
        queryFn: publisherApi.getAll,
    })

    // Filter Logic: Filters by Publisher Name, Stall Name, or Email
    const filteredReservations = reservations?.filter(res =>
        res.publisher?.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.stall?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.publisher?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // CSV Export Logic
    const handleExportCSV = () => {
        const headers = ["Stall", "Publisher", "Email", "Date"].join(",");
        const rows = (filteredReservations || []).map(res => [
            res.stall?.name,
            res.publisher?.businessName,
            res.publisher?.email,
            new Date(res.createdAt).toLocaleDateString()
        ].join(","));

        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookfair_reservations_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Calculate stats
    const totalStalls = stalls?.length ?? 0
    const reservedStalls = stalls?.filter(s => s.reserved).length ?? 0
    const availableStalls = totalStalls - reservedStalls

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Employee Portal</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Total Stalls</div>
                    <div className="text-2xl font-bold">{totalStalls}</div>
                </div>
                <div className="bg-green-50 p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Available</div>
                    <div className="text-2xl font-bold text-green-600">{availableStalls}</div>
                </div>
                <div className="bg-red-50 p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Reserved</div>
                    <div className="text-2xl font-bold text-red-600">{reservedStalls}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Publishers</div>
                    <div className="text-2xl font-bold text-blue-600">{publishers?.length ?? 0}</div>
                </div>
            </div>

            {/* Reservations Table Section */}
            <section className="mb-8 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">All Reservations</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search reservations..."
                            className="border rounded px-3 py-2 text-sm flex-1 md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={handleExportCSV}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Stall</th>
                                <th className="p-4 font-semibold text-gray-600">Publisher</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                <th className="p-4 font-semibold text-gray-600">QR Code</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations?.map((res) => (
                                <tr key={res.id} className="border-b hover:bg-blue-50 transition">
                                    <td className="p-4 font-medium text-blue-700">{res.stall?.name}</td>
                                    <td className="p-4">{res.publisher?.businessName}</td>
                                    <td className="p-4 text-gray-600">{res.publisher?.email}</td>
                                    <td className="p-4 font-mono text-xs text-gray-400">
                                        {res.qrCode?.slice(0, 12)}...
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(res.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredReservations?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No reservations found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Stall Map Overview */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">Live Stall Map Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
                    {stalls?.map((stall) => (
                        <div
                            key={stall.id}
                            title={`${stall.name} - ${stall.size}`}
                            className={`p-3 rounded-md text-center text-xs font-bold shadow-sm border transition-all ${stall.reserved
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-green-100 text-green-700 border-green-200'
                                }`}
                        >
                            {stall.name}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default EmployeePortalPage
