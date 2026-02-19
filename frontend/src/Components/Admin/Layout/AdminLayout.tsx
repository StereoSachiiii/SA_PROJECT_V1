import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Sidebar/AdminSidebar';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout('/admin/login');
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 gap-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold border-r border-gray-200 pr-4">
                        <User size={18} className="text-blue-600" />
                        <span>{user?.username}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase ml-1">Admin</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-semibold text-sm transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
