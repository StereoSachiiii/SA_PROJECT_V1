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
        const isStaffLogin = location.pathname === '/admin/login' || location.pathname === '/employee/login';
        const isVendorLogin = location.pathname === '/login' || location.pathname === '/';

        if (isStaffLogin && role === 'VENDOR') return children ? <>{children}</> : <Outlet />;
        if (isVendorLogin && (role === 'ADMIN' || role === 'EMPLOYEE')) return children ? <>{children}</> : <Outlet />;

        // Contextual Redirect: Keep user in the portal they are trying to access
        const isStaffPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee');

        if (isStaffPage) {
            // If on a staff login page, send to staff dashboard
            if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
            if (role === 'EMPLOYEE') return <Navigate to="/employee" replace />;
            // If VENDOR is on staff login, they are technically unauthorized for this portal context
            // But since they are authenticated, we redirect them to THEIR portal (User Portal)
            return <Navigate to="/vendor/dashboard" replace />;
        } else {
            // If on a User/Vendor login page (/login or /), send to User Dashboard
            // Even if Admin, we "Treat them as a regular customer" for this context
            return <Navigate to="/vendor/dashboard" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
