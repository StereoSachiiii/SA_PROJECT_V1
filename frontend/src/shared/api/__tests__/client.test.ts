import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

/**
 * Tests for the API client interceptors.
 * Since the client module creates an axios instance with interceptors at import time,
 * we test the interceptor logic patterns directly using a mock adapter.
 */

// Re-create the interceptor logic in isolation for testing
function createTestClient() {
    const api = axios.create({ baseURL: '/api/v1' })

    // Request interceptor: inject token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    // Response interceptor: handle errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status

            if (status === 401 || status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                if (!error.config?.url?.includes('/auth/login')) {
                    window.location.href = '/login'
                }
            }

            const apiError = error.response?.data
            if (apiError?.message) {
                const errorMap: Record<string, string> = {
                    'BAD_CREDENTIALS': 'Invalid username or password.',
                    'LIMIT_EXCEEDED': 'You have reached the maximum booking limit (3 stalls).',
                    'RESOURCE_CONFLICT': 'One or more selected stalls have just been booked by another user. Please refresh.',
                }
                const friendlyMessage = errorMap[apiError.code] || apiError.message
                return Promise.reject(new Error(friendlyMessage))
            }

            if (!error.response) {
                return Promise.reject(new Error('Unable to connect to the server.'))
            }

            return Promise.reject(new Error(error.message || 'An unexpected error occurred'))
        }
    )

    return api
}

describe('API Client Interceptors', () => {
    let api: ReturnType<typeof createTestClient>
    let mock: MockAdapter

    beforeEach(() => {
        localStorage.clear()
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '', pathname: '/' },
        })
        api = createTestClient()
        mock = new MockAdapter(api)
    })

    afterEach(() => {
        mock.restore()
    })

    // ─── Request Interceptor ─────────────────────────────────

    it('attaches Bearer token when present in localStorage', async () => {
        localStorage.setItem('token', 'my-jwt-token')
        mock.onGet('/test').reply(200, { ok: true })

        const response = await api.get('/test')

        expect(response.config.headers.Authorization).toBe('Bearer my-jwt-token')
    })

    it('does not attach Authorization header when no token', async () => {
        mock.onGet('/test').reply(200, { ok: true })

        const response = await api.get('/test')

        expect(response.config.headers.Authorization).toBeUndefined()
    })

    // ─── 401 Unauthorized ────────────────────────────────────

    it('clears session and redirects on 401', async () => {
        localStorage.setItem('token', 'stale-token')
        localStorage.setItem('user', '{"id":1}')
        mock.onGet('/protected').reply(401, { message: 'Unauthorized' })

        await expect(api.get('/protected')).rejects.toThrow()

        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
        expect(window.location.href).toBe('/login')
    })

    it('does NOT redirect on 401 for /auth/login (prevents login loop)', async () => {
        localStorage.setItem('token', 'bad-token')
        mock.onPost('/auth/login').reply(401, { code: 'BAD_CREDENTIALS', message: 'Bad credentials' })

        await expect(api.post('/auth/login', {})).rejects.toThrow('Invalid username or password.')

        // Token cleared but no redirect (would cause infinite loop)
        expect(window.location.href).not.toBe('/login')
    })

    // ─── 403 Forbidden ───────────────────────────────────────

    it('clears session on 403', async () => {
        localStorage.setItem('token', 'vendor-token')
        localStorage.setItem('user', '{"id":2}')
        mock.onGet('/admin/stuff').reply(403, { message: 'Forbidden' })

        await expect(api.get('/admin/stuff')).rejects.toThrow()

        expect(localStorage.getItem('token')).toBeNull()
    })

    // ─── Error Code Mapping ──────────────────────────────────

    it('maps LIMIT_EXCEEDED to friendly message', async () => {
        mock.onPost('/reservations').reply(400, {
            code: 'LIMIT_EXCEEDED',
            message: 'Max reservations exceeded',
        })

        await expect(api.post('/reservations', {})).rejects.toThrow(
            'You have reached the maximum booking limit (3 stalls).'
        )
    })

    it('maps RESOURCE_CONFLICT to friendly message', async () => {
        mock.onPost('/reservations').reply(409, {
            code: 'RESOURCE_CONFLICT',
            message: 'Stall already booked',
        })

        await expect(api.post('/reservations', {})).rejects.toThrow(
            'One or more selected stalls have just been booked by another user. Please refresh.'
        )
    })

    it('passes through unknown error messages as-is', async () => {
        mock.onGet('/fail').reply(500, {
            code: 'UNKNOWN_CODE',
            message: 'Something weird happened',
        })

        await expect(api.get('/fail')).rejects.toThrow('Something weird happened')
    })

    // ─── Network Error ───────────────────────────────────────

    it('returns user-friendly message on network error', async () => {
        mock.onGet('/offline').networkError()

        await expect(api.get('/offline')).rejects.toThrow('Unable to connect to the server.')
    })
})
