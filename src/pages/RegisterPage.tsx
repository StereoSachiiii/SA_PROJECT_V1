import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { publisherApi } from '../api'
import type { PublisherRequest } from '../types'
import Input from '../components/Input'
import './RegisterPage.css'

function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState<PublisherRequest>({
        businessName: '',
        email: '',
        contactPerson: '',
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const mutation = useMutation({
        mutationFn: publisherApi.register,
        onSuccess: (data) => {
            // Save publisherId to localStorage for StallMapPage access
            localStorage.setItem('publisherId', String(data.id))
            navigate('/stalls')
        },
    })

    const validate = () => {
        const newErrors: { [key: string]: string } = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!form.businessName.trim()) newErrors.businessName = 'Business name is required'
        if (!form.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required'
        if (!form.email || !emailRegex.test(form.email)) newErrors.email = 'Valid email is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) mutation.mutate(form)
    }

    const handleChange = (field: keyof PublisherRequest, value: string) => {
        setForm({ ...form, [field]: value })
        if (errors[field]) setErrors({ ...errors, [field]: '' })
    }

    return (
        <div className="registration-container">
            <div className="registration-card">
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900">Registration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Bookfair Stall Reservation</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Business Name"
                        placeholder="e.g. Penguin Books"
                        value={form.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        error={errors.businessName}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="contact@publisher.com"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                    />

                    <Input
                        label="Contact Person"
                        placeholder="Your full name"
                        value={form.contactPerson}
                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                        error={errors.contactPerson}
                    />

                    <button type="submit" disabled={mutation.isPending} className="submit-button">
                        {mutation.isPending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Registering...</span>
                            </>
                        ) : 'Register & Continue'}
                    </button>

                    {mutation.isError && (
                        <div className="error-toast">
                            <span className="font-bold">Error:</span> 
                            {(mutation.error as any)?.response?.data?.message || mutation.error.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default RegisterPage