import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/shared/api/authApi'
import { useAuth } from '@/shared/context/AuthContext'
import FormField from '@/shared/components/FormField'

/**
 * Admin / Employee Login Page
 * Strictly for internal staff. No registration link.
 */
export function EmployeeLoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const mutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            if (data.user.role === 'EMPLOYEE') {
                // Logic check failed
                alert("Access Denied: Vendors must use the public login.");
                return;
            }
            login(data.token, data.user)
            // Redirect based on role
            if (data.user.role === 'ADMIN') navigate('/admin/dashboard')
            else if (data.user.role === 'VENDOR') navigate('/VENDOR')
            else navigate('/home')
        }
    })


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.username || !form.password) {
            alert('Please enter both username and password');
            return
        }
        const cleaned = {
            username: form.username.trim().toLowerCase(),
            password: form.password.trim()
        }

        mutation.mutate(cleaned)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-blue-900 p-8 text-center">
                    <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
                    <p className="text-blue-200 text-sm mt-2">Authorized Access Only</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="System ID / Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            placeholder="Checking ID"
                        />

                        <FormField
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••"
                        />

                        {mutation.isError && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                <div className="bg-red-100 p-1.5 rounded-full">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold uppercase tracking-tight">{mutation.error?.message || 'Login failed'}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? "Authenticating..." : "Access System"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/login" className="text-sm text-gray-400 hover:text-gray-600">Return to Vendor Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeLoginPage
