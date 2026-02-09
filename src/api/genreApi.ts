import api from './client'
import type { Genre, GenreRequest } from '../types'

/**
 * Genre API calls
 * 
 * TODO [FRONTEND DEV 3]: Add bulk creation
 */
export const genreApi = {
    add: async (data: GenreRequest): Promise<Genre> => {
        const response = await api.post<Genre>('/genres', data)
        return response.data
    },

    getByPublisher: async (publisherId: number): Promise<Genre[]> => {
        const response = await api.get<Genre[]>(`/genres/publisher/${publisherId}`)
        return response.data
    },
}
