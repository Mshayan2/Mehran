import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await authAPI.verify();
                    if (res.data.valid) {
                        setUser(res.data.user);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error("Token verification failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    const login = async (username, password) => {
        try {
            const res = await authAPI.login({ username, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, password) => {
        try {
            const res = await authAPI.register({ username, password });
            // After register, automatically login
            const loginRes = await authAPI.login({ username, password });
            localStorage.setItem('token', loginRes.data.token);
            setUser(loginRes.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
