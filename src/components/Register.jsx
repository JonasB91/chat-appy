import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import '../css/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { fetchCsrfToken } = useAuth();

    const validateInputs = () => {
        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            setMessage('All fields are required!');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const RegisterNewUser = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const csrfToken = await fetchCsrfToken();
            const avatarUrl = 'https://i.pravatar.cc/200'; // Always use this default avatar URL
            const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, avatar: avatarUrl, csrfToken }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Registration is successful! - Redirecting to Login.....');
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            } else {
                if (response.status === 409) {
                    setMessage('User already exists!')
                }
                setMessage(data.message || 'Registration failed - Please try another username and password!');
            }
        } catch (error) {
            setMessage('Registration Failed!');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={RegisterNewUser} className="register-form">
                <h2>Register</h2>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    required
                />
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
                <button type='submit'>Register</button>
                {message && <p className="message">{message}</p>}
            </form>

        </div>
    );
};

export default Register;
