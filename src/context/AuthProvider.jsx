import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: !!sessionStorage.getItem('token'),
        user: JSON.parse(sessionStorage.getItem('user')) || null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const user = sessionStorage.getItem('user');
        if (token && user) {
            setAuthState({
                isAuthenticated: true,
                user: JSON.parse(user)
            });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                setAuthState({ isAuthenticated: true, user: data.user });
                navigate('/chat');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setAuthState({ isAuthenticated: false, user: null });
        navigate('/login');
    };

    const fetchCsrfToken = async () => {
        try {
            const response = await fetch('https://chatify-api.up.railway.app/csrf', {
                method: 'PATCH',
                //credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch CSRF Token!');
            const data = await response.json();
            return data.csrfToken;
        } catch (error) {
            console.error('CSRF Token fetch error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, fetchCsrfToken }}>
            {children}
        </AuthContext.Provider>
    );
};
