import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import StallMapPage from './pages/StallMapPage'
import HomePage from './pages/HomePage'
import EmployeePortalPage from './pages/EmployeePortalPage'
import Navbar from './Components/Navbar'

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* ✅ Navbar added here */}
            <Navbar />

            <Routes>
                <Route path="/" element={<RegisterPage />} />
                <Route path="/stalls" element={<StallMapPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/employee" element={<EmployeePortalPage />} />
            </Routes>

        </div>
    )
}

export default App;
