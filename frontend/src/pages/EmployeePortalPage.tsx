import { useQuery } from '@tanstack/react-query'
import { userApi, stallApi, reservationApi } from '../api'

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
    const { data: stalls } = useQuery({
        queryKey: ['stalls'],
        queryFn: stallApi.getAll,
    })

    const { data: reservations } = useQuery({
        queryKey: ['reservations'],
        queryFn: reservationApi.getAll,
    })

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: userApi.getAll,
    })

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
                    <div className="text-gray-500 text-sm">Users</div>
                    <div className="text-2xl font-bold text-blue-600">{users?.length ?? 0}</div>
                </div>
            </div>

            {/* Reservations Table */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">All Reservations</h2>
                <table className="w-full bg-white rounded shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Stall</th>
                            <th className="text-left p-3">User</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">QR Code</th>
                            <th className="text-left p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations?.map((res) => (
                            <tr key={res.id} className="border-t">
                                <td className="p-3 font-medium">{res.stall?.name}</td>
                                <td className="p-3">{res.user?.username}</td>
                                <td className="p-3">{res.user?.email}</td>
                                <td className="p-3 font-mono text-xs">{res.qrCode?.slice(0, 12)}...</td>
                                <td className="p-3">{new Date(res.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Stall Map Overview */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Stall Map</h2>
                <div className="grid grid-cols-5 gap-2">
                    {stalls?.map((stall) => (
                        <div
                            key={stall.id}
                            className={`p-2 rounded text-center text-sm ${stall.reserved ? 'bg-red-200' : 'bg-green-200'
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
