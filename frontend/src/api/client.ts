import axios from 'axios'

/**
 * Axios instance configured for the backend API
 * The Vite dev server proxies /api to localhost:8080
 */
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor: Injects the token into every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global Response Interceptor
// Global Error Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extracts the specific error message from the backend response
        const message = error.response?.data?.message || 'An unexpected error occurred';

        // Auto-logout on 401 (Unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        return Promise.reject(new Error(message));
    }
);

export default api