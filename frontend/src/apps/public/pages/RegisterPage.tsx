import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/shared/api/authApi'
import { useAuth } from '@/shared/context/AuthContext'
import type { RegisterRequest } from '@/shared/api/authApi'
import FormField from '@/shared/components/FormField'

/**
 * Registration Page
 */
function RegisterPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState<RegisterRequest & { contactNumber: string }>({
        username: '',
        password: '',
        businessName: '',
        email: '',
        contactNumber: '',
        role: 'VENDOR'
    })
    // Note: The UI might have extra fields like contactNumber not in RegisterRequest yet?
    // Let's assume RegisterRequest in authApi needs to match this form or vice versa.
    // Checking authApi: 
    // export interface RegisterRequest { username, password, email, role, businessName?, businessDescription?, logoUrl?, category? }
    // It does NOT have contactNumber. I should probably ignore it or add it to the type if backend needs it.
    // For now, I will cast or just send what is in types.

    const [errors, setErrors] = useState<Partial<RegisterRequest & { contactNumber?: string }>>({})

    const validate = () => {
        const newErrors: any = {}
        if (!form.username) newErrors.username = 'Username is required'
        if (!form.password) newErrors.password = 'Password is required'
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (!form.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'

        // Custom fields validation
        if (!form.businessName) newErrors.businessName = 'Business Name is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const mutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            if (!data?.token) {
                return;
            }
            login(data.token, data.user)
            navigate('/home')
        },
        onError: (err: any) => {
            setErrors(prev => ({
                ...prev,
                // key 'form' isn't explicitly on the UI, using username/general or alerting 
                // actually we can put it in a general error or just alert for now if no specific field
                // simpler to just put it in a known field or a generic usage
                username: err.response?.data?.message || err.message || 'Registration failed'
            }));
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload: RegisterRequest = {
            username: form.username,
            password: form.password,
            email: form.email,
            role: form.role,
            businessName: form.businessName,
            contactNumber: form.contactNumber,
        }
        if (validate()) {
            mutation.mutate(payload)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Start managing your stalls today
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mutation.isError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                            {mutation.error?.message || "Registration failed. Please try again."}
                        </div>
                    )}

                    <FormField
                        label="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        error={errors.username}
                        placeholder="Choose a username"
                    />

                    <FormField
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        error={errors.password}
                        placeholder="Create a password"
                    />

                    <FormField
                        label="Business Name"
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        error={errors.businessName}
                        placeholder="Your business name"
                    />

                    <FormField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        error={errors.email}
                        placeholder="name@company.com"
                    />

                    <FormField
                        label="Contact Number"
                        value={form.contactNumber}
                        onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                        error={errors.contactNumber}
                        placeholder="+1 (555) 000-0000"
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-black text-white font-medium py-3 rounded-lg 
                               hover:bg-gray-800 transition duration-200 
                               disabled:opacity-50"
                    >
                        {mutation.isPending ? "Creating..." : "Register"}
                    </button>

                    {mutation.isError && (
                        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                            {mutation.error.message}
                        </div>
                    )}

                    <p className="text-center text-sm text-gray-500 pt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-black font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    )


}

export default RegisterPage
