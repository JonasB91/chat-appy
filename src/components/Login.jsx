import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    //Login function and storing token and user in localstorage
    const LoginUser = async (e) => {
        e.preventDefault();
        const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setMessage('Login was Successful');
            setTimeout(() => {
                navigate('/chat');
            }, 2500);
        } else {
            setMessage(data.message || 'invalid credentials : error')
        }
    };


  return (
    <form onSubmit={LoginUser}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        <button type='submit'>Login</button>
        {message && <p>{message}</p>}
    </form>
  )
}

export default Login