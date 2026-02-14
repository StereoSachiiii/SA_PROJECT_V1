import axios from 'axios'

/**
 * Axios instance configured for the backend API
 * 
 * The Vite dev server proxies /api to localhost:8080
 * See vite.config.ts
 */
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
