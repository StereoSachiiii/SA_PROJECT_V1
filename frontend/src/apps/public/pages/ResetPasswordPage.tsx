import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/authApi';
import FormField from '@/shared/components/FormField';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: () => {
            alert('Password reset successfully! You can now login.');
            navigate('/login');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        mutation.mutate({ token, newPassword: password });
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-sm">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
                    <p className="text-gray-500 mb-6 font-medium">This reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" title="Request New Link" className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Enter your new password below to regain access.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <FormField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                    >
                        {mutation.isPending ? "Resetting..." : "Reset Password"}
                    </button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600 text-sm font-semibold">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
