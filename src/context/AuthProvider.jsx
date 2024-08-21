import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: !!sessionStorage.getItem('token'),
        user: null,
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

    const fetchUserData = async (userId, token) => {
        try {
            const response = await fetch(`https://chatify-api.up.railway.app/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('user', JSON.stringify(data));
                setAuthState({
                    isAuthenticated: true,
                    user: data
                });
            } else {
                console.error('Failed to fetch user data:', data.message);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const login = async (username, password) => {
        try {
            const csrfToken = await fetchCsrfToken();
            const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, csrfToken })
            });
            const data = await response.json();
            if (response.ok) {
                const decodedJwt = JSON.parse(atob(data.token.split('.')[1]));
                const userId = decodedJwt.userId; // Här antar vi att userId finns i JWT
                sessionStorage.setItem('token', data.token);
                
                // Hämta fullständig användarinformation
                await fetchUserData(userId, data.token);
                
                navigate('/chat');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid credentials');
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
