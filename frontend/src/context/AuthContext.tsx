import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Authentication Context Type Definition
 */
interface AuthContextType {
    /** The currently authenticated user object */
    user: any | null; // Replace 'any' with User type when available
    /** The JWT authentication token */
    token: string | null;
    /**
     * Function to log in a user
     * @param token - The JWT token received from the backend
     * @param user - The user object received from the backend
     */
    login: (token: string, user: any) => void;
    /** Function to log out the current user */
    logout: () => void;
    /** Boolean indicating if a user is currently authenticated */
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Manages the global authentication state of the application.
 * Handles token storage in localStorage and provides login/logout functionality
 * to all child components.
 * 
 * @param children - The child components to wrap
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        // Hydrate user from localStorage if token exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    /**
     * Logs in the user and persists session data.
     */
    const login = (newToken: string, newUser: any) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        // Force reload to apply interceptor immediately? 
        // No, client.ts handles it dynamically if we implement it right.
    };

    /**
     * Logs out the user and clears session data.
     * Redirects to the login page.
     */
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Redirect to login
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access the Authentication Context.
 * 
 * @throws {Error} If used outside of an AuthProvider
 * @returns {AuthContextType} The authentication context value
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
