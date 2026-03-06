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
        const isVendorLogin = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';

        // ALLOW Admin/Employee to access Public Login/Register IF they are not in their corresponding portal
        // This prevents them from being "trapped" if they want to browse as a customer
        // However, we should redirect them to THEIR dashboard if they are already in the right place

        const isStaffPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee');

        if (isStaffPage) {
            if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
            if (role === 'EMPLOYEE') return <Navigate to="/employee" replace />;
            return <Navigate to="/vendor/dashboard" replace />;
        } else if (isVendorLogin) {
            // Contextual Redirect for public login/root
            if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
            if (role === 'EMPLOYEE') return <Navigate to="/employee" replace />;
            return <Navigate to="/vendor/dashboard" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
