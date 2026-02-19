import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

/**
 * ProtectedRoute
 * 
 * Guards routes that require authentication.
 * Redirects to the appropriate login page based on role and path.
 */
interface ProtectedRouteProps {
    children?: ReactNode;
    allowedRoles?: ('ADMIN' | 'VENDOR' | 'EMPLOYEE')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    // Determine appropriate login page based on path
    const isStaffPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee');
    const loginPath = isStaffPath ? '/admin/login' : '/login';

    if (!isAuthenticated) {
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // If role doesn't match, redirect to corresponding portal's login page
        // as requested: "redir to whatever login page of what you were trying to access"
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
