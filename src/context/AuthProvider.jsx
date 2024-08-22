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
        
        if (token) {
            const decodedJwt = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded JWT on load:", decodedJwt);

            setAuthState({
                isAuthenticated: true,
                user: {
                    id: decodedJwt.id,
                    username: decodedJwt.user,
                    email: decodedJwt.email,
                    avatar: decodedJwt.avatar,
                }
            });
        } else {
            console.log("No token found in sessionStorage.");
        }
    }, []);

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
                console.log("Decoded JWT after login:", decodedJwt);

                sessionStorage.setItem('token', data.token);

                setAuthState({
                    isAuthenticated: true,
                    user: {
                        id: decodedJwt.id,
                        username: decodedJwt.user,
                        email: decodedJwt.email,
                        avatar: decodedJwt.avatar,
                    }
                });

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
