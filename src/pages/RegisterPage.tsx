import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { publisherApi } from '../api'
import type { PublisherRequest } from '../types'

/**
 * Registration Page
 * 
 * TODO [FRONTEND DEV 1]:
 * - Add form validation
 * - Add loading spinner during submission
 * - Style the form with Tailwind
 * - Store publisherId in localStorage/context after registration
 */
function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState<PublisherRequest>({
        businessName: '',
        email: '',
        contactPerson: '',
    })

    const mutation = useMutation({
        mutationFn: publisherApi.register,
        onSuccess: (data) => {
            // TODO: Store publisher ID for later use
            localStorage.setItem('publisherId', String(data.id))
            navigate('/stalls')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate(form)
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Publisher Registration</h1>

                {/* TODO: Add proper styling */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Business Name</label>
                    <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Contact Person</label>
                    <input
                        type="text"
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Registering...' : 'Register & Continue'}
                </button>

                {mutation.isError && (
                    <p className="text-red-500 text-sm mt-2">Error: {mutation.error.message}</p>
                )}
            </form>
        </div>
    )
}

export default RegisterPage
