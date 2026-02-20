import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

// Pages
import VendorDashboardPage from './pages/VendorDashboardPage';
import VendorProfilePage from './pages/VendorProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import VendorReservationDetailPage from './pages/VendorReservationDetailPage';

const VendorRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']} />}>
                <Route path="dashboard" element={<VendorDashboardPage />} />
                <Route path="profile" element={<VendorProfilePage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="reservations/:id" element={<VendorReservationDetailPage />} />
            </Route>
        </Routes>
    );
};

export default VendorRoutes;
