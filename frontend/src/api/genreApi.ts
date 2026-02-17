import api from './client'
import type { Genre, GenreRequest } from '../types'

export const genreApi = {
    add: async (data: GenreRequest): Promise<Genre> => {
        if (!data.name.trim()) throw new Error("Genre name cannot be empty");
        const response = await api.post<Genre>('/genres', data)
        return response.data
    },

    getByUser: async (userId: number): Promise<Genre[]> => {
        // Prevents calling /genres/user/NaN if localStorage is empty
        if (!userId || isNaN(userId)) return []; 
        
        const response = await api.get<Genre[]>(`/genres/user/${userId}`)
        return response.data
    },
}