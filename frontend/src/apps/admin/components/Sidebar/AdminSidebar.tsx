import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Undo2,
    FileSearch,
    Activity,
    MapPin
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hall Management', path: '/admin/halls', icon: MapPin },
    { name: 'Reservations', path: '/admin/reservations', icon: ClipboardList },
    { name: 'Refunds', path: '/admin/refunds', icon: Undo2 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileSearch },
    { name: 'System Health', path: '/admin/health', icon: Activity },
];

export default function AdminSidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Admin Console</h2>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">Stall Reservation System</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 text-center">
                <p className="text-[10px] text-gray-600 font-medium uppercase">Version 4.5.0</p>
            </div>
        </aside>
    );
}
