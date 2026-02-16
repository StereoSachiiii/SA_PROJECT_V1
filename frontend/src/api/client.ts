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

// Global Error Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extracts the specific error message from the backend response
        const message = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    }
);

export default api