import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/shared/context/AuthContext'

// Helper component that exposes auth state for testing
function AuthConsumer({ onRender }: { onRender: (auth: ReturnType<typeof useAuth>) => void }) {
    const auth = useAuth()
    onRender(auth)
    return (
        <div>
            <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
            <span data-testid="role">{auth.role ?? 'none'}</span>
            <span data-testid="username">{auth.user?.username ?? 'none'}</span>
        </div>
    )
}

// Wrap component in AuthProvider
function renderWithAuth(onRender: (auth: ReturnType<typeof useAuth>) => void) {
    return render(
        <AuthProvider>
            <AuthConsumer onRender={onRender} />
        </AuthProvider>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear()
        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: '', pathname: '/' },
        })
    })

    // ─── Hydration ───────────────────────────────────────────

    it('initializes as unauthenticated when localStorage is empty', async () => {
        renderWithAuth(() => { })

        await waitFor(() => {
            expect(screen.getByTestId('authenticated').textContent).toBe('false')
            expect(screen.getByTestId('role').textContent).toBe('none')
        })
    })

    it('hydrates user from localStorage on mount', async () => {
        const mockUser = {
            id: 1, username: 'vendor1', email: 'v@test.com', role: 'VENDOR' as const,
            categories: [],
        }
        localStorage.setItem('token', 'jwt-test-token')
        localStorage.setItem('user', JSON.stringify(mockUser))

        renderWithAuth(() => { })

        await waitFor(() => {
            expect(screen.getByTestId('authenticated').textContent).toBe('true')
            expect(screen.getByTestId('username').textContent).toBe('vendor1')
            expect(screen.getByTestId('role').textContent).toBe('VENDOR')
        })
    })

    it('clears broken user JSON gracefully', async () => {
        localStorage.setItem('token', 'some-token')
        localStorage.setItem('user', 'NOT_VALID_JSON')

        renderWithAuth(() => { })

        await waitFor(() => {
            // Should not crash — broken JSON is cleared
            expect(localStorage.getItem('user')).toBeNull()
        })
    })

    it('clears "undefined" string user', async () => {
        localStorage.setItem('token', 'some-token')
        localStorage.setItem('user', 'undefined')

        // Mock vendorApi to fail so it logs out
        vi.doMock('@/shared/api/vendorApi', () => ({
            vendorApi: {
                getProfile: vi.fn().mockRejectedValue(new Error('fail')),
            },
        }))

        renderWithAuth(() => { })

        await waitFor(() => {
            // Should attempt to clear broken session
            expect(screen.getByTestId('authenticated').textContent).toBe('false')
        }, { timeout: 3000 })
    })

    // ─── Login ───────────────────────────────────────────────

    it('login() stores token and user in state and localStorage', async () => {
        const mockUser = {
            id: 5, username: 'admin', email: 'admin@test.com', role: 'ADMIN' as const,
            categories: [],
        }

        function LoginTester() {
            const auth = useAuth()
            return (
                <div>
                    <span data-testid="auth">{String(auth.isAuthenticated)}</span>
                    <button data-testid="login-btn" onClick={() => auth.login('new-jwt', mockUser as any)}>
                        Login
                    </button>
                </div>
            )
        }

        render(
            <AuthProvider>
                <LoginTester />
            </AuthProvider>
        )

        const user = userEvent.setup()
        await user.click(screen.getByTestId('login-btn'))

        expect(localStorage.getItem('token')).toBe('new-jwt')
        expect(JSON.parse(localStorage.getItem('user')!).username).toBe('admin')
        expect(screen.getByTestId('auth').textContent).toBe('true')
    })

    // ─── Logout ──────────────────────────────────────────────

    it('logout() clears localStorage and redirects', async () => {
        localStorage.setItem('token', 'old-token')
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'u', role: 'VENDOR' }))

        function LogoutTester() {
            const auth = useAuth()
            return (
                <button data-testid="logout-btn" onClick={() => auth.logout()}>
                    Logout
                </button>
            )
        }

        render(
            <AuthProvider>
                <LogoutTester />
            </AuthProvider>
        )

        const user = userEvent.setup()
        await user.click(screen.getByTestId('logout-btn'))

        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
        expect(window.location.href).toBe('/login')
    })

    it('logout() redirects to custom path when provided', async () => {
        localStorage.setItem('token', 'tok')
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'u', role: 'ADMIN' }))

        function LogoutTester() {
            const auth = useAuth()
            return (
                <button data-testid="logout-btn" onClick={() => auth.logout('/admin/login')}>
                    Logout
                </button>
            )
        }

        render(
            <AuthProvider>
                <LogoutTester />
            </AuthProvider>
        )

        const user = userEvent.setup()
        await user.click(screen.getByTestId('logout-btn'))

        expect(window.location.href).toBe('/admin/login')
    })

    // ─── Role helper ─────────────────────────────────────────

    it('role property reflects user role correctly', async () => {
        const mockUser = {
            id: 3, username: 'emp1', email: 'e@t.com', role: 'EMPLOYEE' as const,
            categories: [],
        }
        localStorage.setItem('token', 'jwt')
        localStorage.setItem('user', JSON.stringify(mockUser))

        renderWithAuth(() => { })

        await waitFor(() => {
            expect(screen.getByTestId('role').textContent).toBe('EMPLOYEE')
        })
    })

    // ─── useAuth outside provider ────────────────────────────

    it('useAuth throws when used outside AuthProvider', () => {
        function Orphan() {
            useAuth()
            return <div />
        }

        expect(() => render(<Orphan />)).toThrow('useAuth must be used within an AuthProvider')
    })
})
