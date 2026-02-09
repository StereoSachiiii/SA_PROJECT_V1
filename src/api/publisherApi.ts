import api from './client'
import type { Publisher, PublisherRequest } from '../types'

/**
 * Publisher API calls
 * 
 * TODO [FRONTEND DEV 1]: Add error handling
 */
export const publisherApi = {
    register: async (data: PublisherRequest): Promise<Publisher> => {
        const response = await api.post<Publisher>('/publishers', data)
        return response.data
    },

    getById: async (id: number): Promise<Publisher> => {
        const response = await api.get<Publisher>(`/publishers/${id}`)
        return response.data
    },

    getAll: async (): Promise<Publisher[]> => {
        const response = await api.get<Publisher[]>('/publishers')
        return response.data
    },
}
