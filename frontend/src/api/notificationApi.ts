import api from './client';
import { NotificationResponse } from '../types/api';

export const notificationApi = {
    getNotifications: async (): Promise<NotificationResponse[]> => {
        const response = await api.get('/notifications');
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/notifications/unread-count');
        return response.data.count;
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    }
};
