import api from './client';
import { DocumentResponse } from '../types/api';

export const documentApi = {
    upload: async (file: File): Promise<DocumentResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<DocumentResponse>('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getDocuments: async (): Promise<DocumentResponse[]> => {
        const response = await api.get<DocumentResponse[]>('/documents');
        return response.data;
    },

    download: async (id: number): Promise<Blob> => {
        const response = await api.get(`/documents/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/documents/${id}`);
    }
};
