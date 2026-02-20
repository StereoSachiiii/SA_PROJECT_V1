import api from './client';
import { User, ForgotPasswordRequest, ResetPasswordRequest } from '../types/api';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    role: 'VENDOR' | 'EMPLOYEE'; // Admin cannot self-register usually
    businessName?: string;
    businessDescription?: string;
    logoUrl?: string;
    categories?: string[];
    contactNumber?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me'); // Assuming an endpoint exists or we use stored user
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await api.post('/auth/forgot-password', data);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await api.post('/auth/reset-password', data);
    }
};
