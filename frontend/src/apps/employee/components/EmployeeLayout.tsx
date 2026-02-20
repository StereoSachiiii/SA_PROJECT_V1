import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';

export default function EmployeeLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => {
        return location.pathname === path
            ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900";
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 shadow-sm">
                {/* Brand */}
                <div className="h-24 flex items-center px-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
                            🛡️
                        </div>
                        <span className="font-black text-xl text-slate-900 tracking-tight">Staff Portal</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="mx-6 mb-8 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black text-lg shadow-sm">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-slate-900 truncate">{user?.username}</p>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{user?.role || 'Operator'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 mt-2">Operations</p>

                    <Link to="/employee" className={`flex items-center gap-3 px-6 py-3.5 text-sm font-black rounded-2xl transition-all ${isActive('/employee')}`}>
                        <span className="text-lg">📊</span>
                        Operational Hub
                    </Link>

                </nav>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl w-full transition-all group"
                    >
                        <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
                        Sign Out
                    </button>
                    <Link to="/home" className="flex items-center justify-center gap-2 mt-4 text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                        <span>←</span> Main Site
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
