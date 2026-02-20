import { Routes, Route } from 'react-router-dom'

// Route Modules
import AdminRoutes from '@/apps/admin/AdminRoutes'
import VendorRoutes from '@/apps/vendor/VendorRoutes'
import EmployeeRoutes from '@/apps/employee/EmployeeRoutes'

// Public Pages
import HomePage from '@/apps/public/pages/HomePage'
import LoginPage from '@/apps/public/pages/LoginPage'
import RegisterPage from '@/apps/public/pages/RegisterPage'
import ForgotPasswordPage from '@/apps/public/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/apps/public/pages/ResetPasswordPage'
import EventsPage from '@/apps/public/pages/EventsPage'
import EventDetailsPage from '@/apps/public/pages/EventDetailsPage'
import StallMapPage from '@/apps/public/pages/StallMapPage'
import { CheckoutPage } from '@/apps/vendor/pages/CheckoutPage' // Shared/Vendor
import NotFoundPage from '@/apps/public/pages/NotFoundPage'

// Auth Pages
import AdminLoginPage from '@/apps/admin/pages/AdminLoginPage'
import { EmployeeLoginPage } from '@/apps/employee/pages/EmployeeLogin'

// Shared Components
import Layout from '@/shared/components/Layout'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import PublicRoute from '@/shared/components/PublicRoute'

function App() {
    return (
        <Routes>
            {/* --- Public Access --- */}
            <Route path="/" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
            <Route path="/employee/login" element={<PublicRoute><EmployeeLoginPage /></PublicRoute>} />

            {/* --- Main App Layout (Shared/Public/Vendor) --- */}
            <Route element={<Layout />}>
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
                <Route path="/events/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />

                {/* Vendor Module Routes */}
                <Route path="/vendor/*" element={<VendorRoutes />} />

                {/* Stalls & Checkout (Top-level due to current linking structure) */}
                <Route path="/stalls/:eventId" element={
                    <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}><StallMapPage /></ProtectedRoute>
                } />
                <Route path="/checkout/:id" element={
                    <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}><CheckoutPage /></ProtectedRoute>
                } />
            </Route>

            {/* --- Employee Portal Module --- */}
            <Route path="/employee/*" element={<EmployeeRoutes />} />

            {/* --- Admin Portal Module --- */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default App
