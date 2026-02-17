import api from './client'
import type { User, UserRequest } from '../types'

export const userApi = {
    register: async (data: UserRequest): Promise<User> => {
        const response = await api.post<User>('/auth/register', data)
        return response.data
    },

    login: async (data: any): Promise<any> => {
        const response = await api.post<any>('/auth/login', data)
        return response.data
    },

    getById: async (id: number): Promise<User> => {
        if (!id) throw new Error("User ID is required");
        const response = await api.get<User>(`/users/${id}`)
        return response.data
    },

    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users')
        return response.data
    },
}