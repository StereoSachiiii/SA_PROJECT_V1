import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { userApi } from '../api'
import type { UserRequest } from '../types'

/**
 * Registration Page
 */
function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState<UserRequest>({
        username: '',
        password: '',
        businessName: '',
        email: '',
        contactNumber: '',
    })
    const [errors, setErrors] = useState<Partial<UserRequest>>({})

    const validate = () => {
        const newErrors: Partial<UserRequest> = {}
        if (!form.username) newErrors.username = 'Username is required'
        if (!form.password) newErrors.password = 'Password is required'
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (!form.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'
        if (!form.businessName) newErrors.businessName = 'Business Name is required'
        if (!form.contactNumber) newErrors.contactNumber = 'Contact Number is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const mutation = useMutation({
        mutationFn: userApi.register,
        onSuccess: () => {
            navigate('/stalls')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            mutation.mutate(form)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">User Registration</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Business Name</label>
                    <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.businessName ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        value={form.contactNumber}
                        onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.contactNumber ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    />
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex justify-center items-center"
                >
                    {mutation.isPending ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </>
                    ) : 'Register & Continue'}
                </button>

                {mutation.isError && (
                    <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded">
                        Error: {mutation.error.message}
                    </p>
                )}
            </form>
        </div>
    )
}

export default RegisterPage
