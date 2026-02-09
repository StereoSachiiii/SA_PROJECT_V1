import api from './client'
import type { Stall } from '../types'

/**
 * Stall API calls
 * 
 * TODO [FRONTEND DEV 2]: Add loading states
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
