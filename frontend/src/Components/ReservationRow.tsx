import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorApi } from '../api/vendorApi';
import { Reservation } from '../types/api';
import { useAuth } from '../context/AuthContext';


// export this and change the reservation table in the dashboard to use this component, so that we can show the countdown timer for pending payments and also have a consistent design for the reservation rows across the app
const ReservationRow = ({ res, onCancel }: { res: Reservation, onCancel: (id: number) => void }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (res.status !== 'PENDING_PAYMENT' || !res.expiresAt) return;

        const updatedTimer = () => {
            const now = new Date().getTime();
            const expire = new Date(res.expiresAt!).getTime();
            const diff = expire - now;

            if (diff <= 0) {
                setTimeLeft("Expired");
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        updatedTimer();
        const interval = setInterval(updatedTimer, 1000);
        return () => clearInterval(interval);
    }, [res.status, res.expiresAt]);

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-mono text-sm text-gray-600">#{res.id}</td>
            <td className="px-6 py-4 font-medium">{res.vendor || 'Event 2026'}</td>
            <td className="px-6 py-4">
                {res.stalls.map(s => (
                    <span key={s} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {s}
                    </span>
                ))}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit
                        ${res.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            res.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'}`}>
                        {res.status.replace('_', ' ')}
                    </span>
                    {res.status === 'PENDING_PAYMENT' && timeLeft && (
                        <span className="text-xs text-red-600 font-bold mt-1">
                            Expires in: {timeLeft}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                {(res.status === 'PENDING_PAYMENT' || res.status === 'PAID') && (
                    <button onClick={() => onCancel(res.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Cancel</button>
                )}
                {res.status === 'CHECKED_IN' && <span className="text-gray-400 text-sm italic">Checked In</span>}
            </td>
        </tr>
    );
};

export default function VendorDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [limits, setLimits] = useState({ limit: 3, used: 0, remaining: 3 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [resData, limitData] = await Promise.all([
                vendorApi.getMyReservations(),
                vendorApi.getAvailableCount()
            ]);
            setReservations(resData);
            setLimits(limitData);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    
    const handleCancel = async (id: number) => {
        // user a modal later on instead of window.confirm for better UX
       
        try {
            await vendorApi.cancelReservation(id);
            loadDashboard(); 
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Vendor Command Center</h1>
                    <p className="text-gray-600">Welcome back, {user?.businessName || user?.username}</p>
                </div>
                <button
                    onClick={() => navigate('/stalls')}
                    disabled={limits.remaining <= 0}
                    className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${limits.remaining > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                >
                    {limits.remaining > 0 ? 'Book New Stall' : 'Limit Reached'}
                </button>
            </header>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Stall Limit</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{limits.limit}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Active Bookings</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{limits.used}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Remaining Slots</h3>
                    <p className={`text-4xl font-bold mt-2 ${limits.remaining === 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {limits.remaining}
                    </p>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Your Reservations</h2>
                </div>

                {reservations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No active reservations. Click "Book New Stall" to get started.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Event</th>
                                <th className="px-6 py-3">Stalls</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reservations.map((res) => (
                                <ReservationRow key={res.id} res={res} onCancel={handleCancel} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
