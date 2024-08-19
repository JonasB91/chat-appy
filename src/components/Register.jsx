import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { fetchCsrfToken } = useAuth();

    // Validate input fields
    const validateInputs = () => {
        if (username.trim() === '' || email.trim() === '' || password.trim() === '' || avatar.trim() === '') {
            setMessage('All fields are required!');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address');
            return false;
        }
        return true;
    };

    // Register new user
    const RegisterNewUser = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const csrfToken = await fetchCsrfToken();
            const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, avatar, csrfToken }),
            });
            const data = await response.json();
            console.log('CSRF Token:', csrfToken);
            if (response.ok) {
                setMessage('Registration is successful!');
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            } else {
                if (response.status === 409) {
                    setMessage('User already exists!')
                }
                setMessage(data.message || 'Registration error/failed');
            }
        } catch (error) {
            setMessage('Registration Failed!');
        }
    };

    return (
        <form onSubmit={RegisterNewUser}>
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
            <input
                type='text'
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder='Avatar URL'
                required
            />
            <button type='submit'>Register</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Register;
