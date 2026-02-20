import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import NotificationBell from './NotificationBell';


export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // const [isHovered, setIsHovered] = useState(false);



    const isActive = (path: string) => {
        return location.pathname === path
            ? "text-primary-600 font-bold border-b-2 border-primary-500"
            : "text-gray-500 font-medium hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors duration-200";
    };

    return (
        <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-10">
                        <Link to="/home" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary-500 font-bold shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300 border border-primary-500/20">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <span className="font-extrabold text-2xl text-secondary tracking-tight group-hover:text-primary-600 transition-colors">
                                BookFair
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link to="/home" className={`px-5 py-2.5 text-base ${isActive('/home')}`}>
                                Home
                            </Link>

                            {user?.role === 'VENDOR' && (
                                <Link to="/vendor/dashboard" className={`px-5 py-2.5 text-base ${isActive('/vendor/dashboard')}`}>
                                    Dashboard
                                </Link>
                            )}
                            {user?.role === 'EMPLOYEE' && (
                                <Link to="/employee" className={`px-5 py-2.5 text-base ${isActive('/employee')}`}>
                                    Portal
                                </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin/dashboard" className={`px-5 py-2.5 text-base ${isActive('/admin/dashboard')}`}>
                                    Console
                                </Link>
                            )}

                            <Link to="/events" className={`px-5 py-2.5 text-base ${isActive('/events')}`}>
                                Events
                            </Link>
                        </div>
                    </div>

                    {/* User Profile / Actions */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                                {user.role === 'VENDOR' && <NotificationBell />}
                                <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm relative group cursor-pointer group-hover:bg-white transition-all">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 leading-none">{user.username}</span>
                                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider leading-none mt-1">{user.role || 'User'}</span>
                                    </div>

                                    {/* {use state for the hover } */}
                                    {/* Action Tooltip/Dropdown-lite */}
                                    <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-50 min-w-[160px]">
                                        <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-2">
                                            {user.role === 'VENDOR' && (
                                                <>
                                                    <Link to="/vendor/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                                        👤 Edit Profile
                                                    </Link>
                                                    <Link to="/vendor/documents" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                                        📄 Documents
                                                    </Link>
                                                </>
                                            )}
                                            {user.role === 'ADMIN' && (
                                                <Link to="/admin/vendor-documents" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                                    📄 Vendor Documents
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => logout()}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/" className="text-gray-600 font-bold hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-secondary hover:bg-black rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
