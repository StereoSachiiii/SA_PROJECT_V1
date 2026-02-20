import api from './client'
import type { User, UserRequest, LoginRequest } from '@/shared/types/api'

/**
 * User API calls (Auth & User Management)
 */
export const userApi = {
    register: async (data: UserRequest): Promise<{ token: string; user: User }> => {
        const response = await api.post<{ token: string; user: User }>('/auth/register', data)
        return response.data
    },

    login: async (data: LoginRequest): Promise<{ token: string; user: User }> => {
        const response = await api.post<{ token: string; user: User }>('/auth/login', data)
        return response.data
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/vendor/profile/${id}`)
        return response.data
    },

    getAll: async (): Promise<User[]> => {
        // This might need Admin privilege or specific vendor list
        const response = await api.get<User[]>('/admin/users')
        return response.data
    },
}
