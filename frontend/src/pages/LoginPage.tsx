import { useState } from 'react'
import { useNavigate, Link, Form } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import type { LoginRequest } from '../api/authApi'
import FormField from '../Components/FormField'

/**
 * Login Page
 */
function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState<LoginRequest>({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState<Partial<LoginRequest>>({})

    const validate = () => {
        const newErrors: Partial<LoginRequest> = {}
        if (!form.username) newErrors.username = 'Username is required'
        if (!form.password) newErrors.password = 'Password is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const mutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            if (data.user.role !== 'VENDOR') {
                setErrors({ username: 'Access Denied: Staff accounts must use the authorized staff portal.' })
                return
            }
            // data is AuthResponse { token, user }
            login(data.token, data.user)
            navigate('/vendor/dashboard');
        },
        onError: (err: any) => {
            setErrors({ username: err.message || 'Login failed' })
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validForm = new FormData(e.target as HTMLFormElement)

        if (validate()) {
            mutation.mutate(validForm as unknown as LoginRequest)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Sign in to manage your stall reservations
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                        label="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        error={errors.username}
                        placeholder="Enter your username"
                    />

                    <FormField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        error={errors.password}
                        placeholder="Enter your password"
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-black text-white font-medium py-3 rounded-lg 
                                 hover:bg-gray-800 transition duration-200 
                                 disabled:opacity-50"
                    >
                        {mutation.isPending ? "Signing in..." : "Login"}
                    </button>

                    {mutation.isError && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-red-100 p-1.5 rounded-full">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold">{errors.username || 'An unexpected error occurred'}</span>
                        </div>
                    )}

                    <p className="text-center text-sm text-gray-500 pt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/"
                            className="text-black font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;
