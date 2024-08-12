import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('token');

    // Om användaren inte är inloggad, omdirigera till inloggningssidan
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // Om användaren är inloggad, rendera barnkomponenter
    return children;
};

export default ProtectedRoute;
