import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.unreadCount || 0);
            } else if (Array.isArray(response.data)) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Socket implementation
    useEffect(() => {
        if (user) {
            const socketUrl = import.meta.env.VITE_SERVER_URL || 'https://medicon-gamma.vercel.app';
            const newSocket = io(socketUrl, {
                withCredentials: true
            });

            newSocket.on('connect', () => {
                const userId = user._id || user.id;
                if (userId) {
                    newSocket.emit('join', userId);
                }
            });

            newSocket.on('new_notification', (notification) => {
                setNotifications(prev => [notification, ...(Array.isArray(prev) ? prev : [])]);
                setUnreadCount(prev => (prev || 0) + 1);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => {
                if (!Array.isArray(prev)) return [];
                return prev.map(n => n._id === id ? { ...n, isRead: true } : n);
            });
            setUnreadCount(prev => Math.max(0, (prev || 0) - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => {
                if (!Array.isArray(prev)) return [];
                return prev.map(n => ({ ...n, isRead: true }));
            });
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
