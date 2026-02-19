import { createContext, useContext, useState, useEffect, ReactNode, Context } from 'react';
import { User } from '../types/api';
// We might import authApi to validate token on load, but for now we trust localStorage until 401 interceptor hits.

/**
 * Authentication Context Type Definition
 */
interface AuthContextType {
    /** The currently authenticated user object */
    user: User | null;
    /** The JWT authentication token */
    token: string | null;
    /**
     * Function to log in a user
     * @param token - The JWT token received from the backend
     * @param user - The user object received from the backend
     */
    login: (token: string, user: User) => void;
    /** Function to log out the current user */
    logout: (redirectPath?: string) => void;
    /** Boolean indicating if a user is currently authenticated */
    isAuthenticated: boolean;
    /** Role helper */
    role: 'ADMIN' | 'VENDOR' | 'EMPLOYEE' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Manages the global authentication state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        const hydrate = async () => {
            if (storedToken) {
                // If we have token but user is missing or broken string "undefined"
                if (!storedUser || storedUser === 'undefined') {
                    try {
                        // Import dynamically to avoid circular dependency if any
                        const { vendorApi } = await import('../api/vendorApi');
                        const profile = await vendorApi.getProfile();
                        if (profile && profile.id) {
                            setUser(profile);
                            localStorage.setItem('user', JSON.stringify(profile));
                        } else {
                            throw new Error("Invalid profile response");
                        }
                    } catch (e) {
                        console.error("Session restoration failed:", e);
                        logout(); // Clear broken session
                    }
                } else {
                    try {
                        const parsed = JSON.parse(storedUser);
                        if (parsed && parsed.id) {
                            setUser(parsed);
                        } else {
                            localStorage.removeItem('user');
                        }
                    } catch (e) {
                        localStorage.removeItem('user');
                    }
                }
            }
            setIsLoading(false);
        };

        hydrate();
    }, []);

    /**
     * Logs in the user and persists session data.
     */
    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    /**
     * Logs out the user and clears session data.
     */
    const logout = (redirectPath?: string) => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = redirectPath || '/login';
    };

    const role = user?.role || null;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, role }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access the Authentication Context.
 * 
 * @returns {Context}
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
