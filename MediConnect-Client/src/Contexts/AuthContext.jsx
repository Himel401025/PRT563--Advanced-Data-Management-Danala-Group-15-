import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success && response.data.user) {
            setUser(response.data.user);
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.user) {
            setUser(response.data.user);
        }
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    const isPatient = user?.role === 'patient';
    const isDoctor = user?.role === 'doctor';
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            register,
            logout,
            refreshUser,
            isPatient,
            isDoctor,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
