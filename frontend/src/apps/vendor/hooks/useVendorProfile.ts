import { useState, useEffect, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorApi } from '@/shared/api/vendorApi';
import { useAuth } from '@/shared/context/AuthContext';

export function useVendorProfile() {
    const { login } = useAuth();
    const queryClient = useQueryClient();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['vendorProfile'],
        queryFn: vendorApi.getProfile
    });

    const [formData, setFormData] = useState({
        businessName: '',
        businessDescription: '',
        contactNumber: '',
        address: '',
        logoUrl: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                businessName: profile.businessName || '',
                businessDescription: profile.businessDescription || '',
                contactNumber: profile.contactNumber || '',
                address: profile.address || '',
                logoUrl: profile.logoUrl || ''
            });
        }
    }, [profile]);

    const updateMutation = useMutation({
        mutationFn: vendorApi.updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['vendorProfile'], updatedUser);
            const token = localStorage.getItem('token');
            if (token) {
                login(token, updatedUser);
            }
            setSuccess(true);
            setError(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (err: any) => {
            setError(err.message || 'Failed to update profile');
            setSuccess(false);
        }
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);

        const payload = {
            ...formData,
            categories: profile?.categories || []
        };

        updateMutation.mutate(payload);
    };

    return {
        formData,
        setFormData,
        profile,
        isLoading,
        isUpdating: updateMutation.isPending,
        success,
        error,
        handleSubmit
    };
}
