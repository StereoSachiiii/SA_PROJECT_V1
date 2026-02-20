import { useState, useEffect, useRef } from 'react';
import { notificationApi } from '../api/notificationApi';
import { NotificationResponse } from '../types/api';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        try {
            const [list, count] = await Promise.all([
                notificationApi.getNotifications(),
                notificationApi.getUnreadCount()
            ]);
            setNotifications(list);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-scale-in">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-900 text-sm tracking-tight">Notifications</h3>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{unreadCount} Unread</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <span className="text-3xl block mb-2">🎈</span>
                                <p className="text-xs font-bold">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                        className={`p-5 transition-colors cursor-pointer hover:bg-slate-50 relative group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                                        <div className="flex gap-3">
                                            <span className="text-lg">
                                                {n.type === 'SUCCESS' ? '✅' : n.type === 'WARNING' ? '⚠️' : n.type === 'URGENT' ? '🚨' : 'ℹ️'}
                                            </span>
                                            <div className="flex-1">
                                                <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                                                    {n.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-2 block italic">
                                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100">
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                            View All History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
