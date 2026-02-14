import api from './client'
import type { User, UserRequest } from '../types'

/**
 * User API calls (Auth & User Management)
 */
export const userApi = {
    register: async (data: UserRequest): Promise<any> => {
        const response = await api.post<any>('/auth/register', data)
        return response.data
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`)
        return response.data
    },

    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users')
        return response.data
    },
}
