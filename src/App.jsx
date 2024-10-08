import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import SideNav from './components/SideNav';
import UserInfo from './components/UserInfo';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/chat" element={
                            <ProtectedRoute>
                                <div className="main-layout">
                                    <SideNav />
                                    <UserInfo />
                                    <Chat />
                                </div>
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
