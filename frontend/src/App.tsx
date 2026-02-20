import { Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from "./pages/EmployeePortalPage"; 
import StallMapPage from './pages/StallMapPage'
import HomePage from './pages/HomePage'
import EmployeePortalPage from './pages/EmployeePortalPage'
import Layout from './types/Layout'
import EmployeeLayout from './types/EmployeeLayout'
import { useAuth } from './context/AuthContext'

// ...existing code...

/**
 * Protected Route: Only for authenticated users
 */
function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

/**
 * Public Route: Only for unauthenticated users (Register/Login)
 * Redirects to /home if already logged in.
 */
function PublicRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }
    return children;
}

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={
                <PublicRoute><RegisterPage /></PublicRoute>
            } />
            <Route path="/login" element={
                <PublicRoute><LoginPage /></PublicRoute>
            } />

            {/* Main App Layout */}
            <Route element={<Layout />}>
                <Route path="/home" element={
                    <ProtectedRoute><HomePage /></ProtectedRoute>
                } />
                <Route path="/stalls" element={
                    <ProtectedRoute><StallMapPage /></ProtectedRoute>
                } />
            </Route>

            {/* Employee Portal Layout */}
            <Route element={<EmployeeLayout />}>
                <Route path="/employee" element={
                    <ProtectedRoute><EmployeePortalPage /></ProtectedRoute>
                } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
