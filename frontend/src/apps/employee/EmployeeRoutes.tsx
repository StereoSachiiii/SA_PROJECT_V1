import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import EmployeeLayout from './components/EmployeeLayout';

// Pages
import EmployeePortalPage from './pages/EmployeePortalPage';

const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route element={<EmployeeLayout />}>
                <Route path="/" element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}><EmployeePortalPage /></ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
};

export default EmployeeRoutes;
