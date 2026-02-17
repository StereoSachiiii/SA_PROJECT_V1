import api from './client'
import type { Stall } from '../types'

/**
 * Stall API calls
 */
export const stallApi = {
    getAll: async (): Promise<Stall[]> => {
        const response = await api.get<Stall[]>('/stalls')
        return response.data
    },

    getAvailable: async (): Promise<Stall[]> => {
        const response = await api.get<Stall[]>('/stalls/available')
        return response.data
    },
}