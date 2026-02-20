import axios, { AxiosError } from 'axios'
import { ApiError, ErrorDetails } from '../types/api'
import { APP_CONFIG } from '@/config'

/**
 * Axios instance configured for the backend API
 * The Vite dev server proxies /api/v1 to localhost:8080
 */
const api = axios.create({
    baseURL: APP_CONFIG.API_BASE_URL,
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
api.interceptors.response.use(
    (response) => {
        // V4.5: Unwrap "content" from PageEnvelope if it exists
        if (response.data && response.data.content && Array.isArray(response.data.content)) {
            // We attach the pagination metadata to the array if needed, but for now just return the content
            // or return the full envelope if the caller expects pagination info.
            // Strategy: Return data as is, let specific API calls handle unwrapping or use the raw envelope.
            return response;
        }
        return response;
    },
    (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const apiError = error.response?.data;

        // Offline / Network Check
        if (error.code === 'ERR_NETWORK' || !error.response) {
            return Promise.reject(new Error("Unable to connect to the server. Please check your internet connection."));
        }



        // Auto-logout on 401
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if this was NOT a login attempt
            if (!error.config?.url?.includes('/auth/login')) {
                const isAdmin = window.location.pathname.startsWith('/admin');
                window.location.href = isAdmin ? '/admin/login' : '/login';
                return Promise.reject(new Error("Session expired. Please login again."));
            }
        }

        // V4.5: Structured Error Handling
        if (apiError && apiError.message) {
            // Dictionary of User-Friendly Messages
            const errorMap: Record<string, string> = {
                'LIMIT_EXCEEDED': 'You have reached the maximum booking limit (3 stalls).',
                'TAXONOMY_DENIED': 'Your business category is not allowed in this specific hall/zone.',
                'RESOURCE_CONFLICT': 'One or more selected stalls have just been booked by another user. Please refresh.',
                'DUPLICATE_SCAN': 'This ticket has already been used/checked-in.',
                'NOT_PAID': 'This reservation is PENDING PAYMENT. Please collect payment first.',
                'INVALID_QR': 'The QR code is invalid or does not belong to this event.',
                'EVENT_CLOSED': 'Booking for this event is currently closed.',
                'ILLEGAL_STATE': 'This action is not allowed in the current state.',
                'BAD_CREDENTIALS': 'Invalid username or password.',
                'ACCOUNT_LOCKED': 'Your account has been locked due to too many failed attempts.',
                'NETWORK_ERROR': 'Unable to connect to server. Please check your internet.'
            };

            let friendlyMessage = errorMap[apiError.code] || apiError.message;

            // Append details if useful (e.g. which stall caused the conflict)
            if (apiError.code === 'TAXONOMY_DENIED' && apiError.details?.allowed) {
                friendlyMessage += ` (Allowed: ${apiError.details.allowed})`;
            }

            // Attach the full error object for UI components to read 'details'
            interface EnhancedError extends Error {
                details?: ErrorDetails;
                code?: string;
            }
            const enhancedError = new Error(friendlyMessage) as EnhancedError;
            enhancedError.details = apiError.details;
            enhancedError.code = apiError.code;
            return Promise.reject(enhancedError);
        }

        return Promise.reject(new Error(error.message || 'An unexpected network error occurred'));
    }
);

export default api
