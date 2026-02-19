import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

/**
 * PublicRoute
 * 
 * Guards routes that should NOT be accessible if already logged in (e.g. Login, Register).
 * Redirects to /home (or dashboard) if user is authenticated.
 */
interface PublicRouteProps {
    children?: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        // If authenticated as VENDOR and trying to access staff login, ALLOW it.
        // If authenticated as ADMIN/EMPLOYEE and trying to access vendor login, ALLOW it.
        // This prevents the redirect loop when switching portals.
        const isStaffLogin = location.pathname === '/admin/login';
        const isVendorLogin = location.pathname === '/login' || location.pathname === '/';

        if (isStaffLogin && role === 'VENDOR') return children ? <>{children}</> : <Outlet />;
        if (isVendorLogin && (role === 'ADMIN' || role === 'EMPLOYEE')) return children ? <>{children}</> : <Outlet />;

        // Otherwise, send to appropriate dashboard
        if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'EMPLOYEE') return <Navigate to="/employee" replace />;
        return <Navigate to="/vendor/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
