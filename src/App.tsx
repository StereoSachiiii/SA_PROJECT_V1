import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import StallMapPage from './pages/StallMapPage'
import HomePage from './pages/HomePage'
import EmployeePortalPage from './pages/EmployeePortalPage'

/**
 * Main App Component
 * 
 * Routes:
 * /           - Registration page (entry point)
 * /stalls     - Stall map for reservation
 * /home       - Home page after reservation (add genres)
 * /employee   - Employee portal
 */
function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route path="/" element={<RegisterPage />} />
                <Route path="/stalls" element={<StallMapPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/employee" element={<EmployeePortalPage />} />
            </Routes>
        </div>
    )
}

export default App
