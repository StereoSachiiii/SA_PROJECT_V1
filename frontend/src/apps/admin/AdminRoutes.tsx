import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import AdminLayout from './components/Layout/AdminLayout'; // Updated path

// Pages
import AdminDashboardPage from './pages/Dashboard';
import StallMapDesigner from './pages/StallMapDesigner';
import AdminReservationManager from './pages/AdminReservationManager';
import HallManagement from './pages/HallManagement';
import StallInventory from './pages/StallInventory';
import RefundsPage from './pages/Refunds';
import AuditLogsPage from './pages/AuditLogs';
import StallPricingPage from './pages/StallPricing';
import SystemHealthPage from './pages/SystemHealth';
import VendorDocuments from './pages/VendorDocuments';
import VendorReservationDetailPage from '../vendor/pages/VendorReservationDetailPage';
// Login is public/shared but we can stick it here if we want, 
// usually Login is outside the recursive structure if it has a different layout.
// In App.tsx, /admin/login is a PublicRoute. We should keep it there or in a PublicRoutes file.

/**
 * 
 * 
 * @returns 
 */
const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="designer" element={<StallMapDesigner />} />
                <Route path="reservations" element={<AdminReservationManager />} />
                <Route path="reservations/:id" element={<VendorReservationDetailPage />} />
                <Route path="halls" element={<HallManagement />} />
                <Route path="halls/:id/inventory" element={<StallInventory />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
                <Route path="health" element={<SystemHealthPage />} />
                <Route path="vendor-documents" element={<VendorDocuments />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
