import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { publisherApi } from '../api' // Re-enabled real API
import type { PublisherRequest } from '../types'

/**
 * RegisterPage.tsx - Production Version (Dev 1 Completed)
 * Includes: Form validation, Loading Spinner, Error handling, and LocalStorage persistence.
 */
function RegisterPage() {
    const navigate = useNavigate()
    
    // --- State Management ---
    const [form, setForm] = useState<PublisherRequest>({
        businessName: '',
        email: '',
        contactPerson: '',
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // --- Production Mutation ---
    const mutation = useMutation({
        mutationFn: publisherApi.register, // Reconnected to shared API
        onSuccess: (data) => {
            // Requirement: Store publisherId for downstream pages
            localStorage.setItem('publisherId', String(data.id))
            navigate('/stalls')
        },
    })

    // --- Validation Logic ---
    const validate = () => {
        const newErrors: { [key: string]: string } = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Requirement: email format validation

        if (!form.businessName.trim()) newErrors.businessName = 'Business name is required'
        if (!form.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required'
        
        if (!form.email) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            mutation.mutate(form)
        }
    }

    const handleChange = (field: keyof PublisherRequest, value: string) => {
        setForm({ ...form, [field]: value })
        // Clear field-specific error as the user types
        if (errors[field]) setErrors({ ...errors, [field]: '' })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
            >
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Bookfair Stall Reservation</p>
                </header>

                {/* Business Name Field */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
                    <input
                        type="text"
                        placeholder="Enter publisher name"
                        value={form.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 transition-all outline-none focus:ring-2 ${
                            errors.businessName ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
                        }`}
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.businessName}</p>}
                </div>

                {/* Email Field */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Email</label>
                    <input
                        type="email"
                        placeholder="contact@publisher.com"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 transition-all outline-none focus:ring-2 ${
                            errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
                        }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                </div>

                {/* Contact Person Field */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Person</label>
                    <input
                        type="text"
                        placeholder="Full name"
                        value={form.contactPerson}
                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 transition-all outline-none focus:ring-2 ${
                            errors.contactPerson ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
                        }`}
                    />
                    {errors.contactPerson && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.contactPerson}</p>}
                </div>

                {/* Submit Button with Loading Spinner */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {mutation.isPending ? (
                        <>
                            {/* Animated SVG Spinner */}
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </>
                    ) : 'Register & Continue'}
                </button>

                {/* Error Notification / Toast */}
                {mutation.isError && (
                    <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                        <span className="bg-red-500 text-white rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">!</span>
                        <div>
                            <span className="font-bold">Error:</span> 
                            <p className="mt-0.5 opacity-90">
                                {/* Handles 500 status code errors from the backend */}
                                {(mutation.error as any)?.response?.data?.message || mutation.error.message}
                            </p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default RegisterPage