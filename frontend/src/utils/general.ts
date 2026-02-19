import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Centralized logout handler to be used across the application.
 * This function can be imported and used in any component that needs to trigger a logout,
 */
export  const handleLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
        logout();
        navigate('/');

    };