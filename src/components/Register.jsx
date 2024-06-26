import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    // Setting state handling here.

    //Register new user and using fetchCsrfToken function 
    const RegisterNewUser = async (e) => {
        e.preventDefault();
        try {

        const csrfToken = await fetchCsrfToken();
        const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if(response.ok) {
            setMessage('Registration is successful');
            setTimeout(() => {
                navigate('/login')
            }, 2500);
        } else {
            setMessage(data.message || 'Registration error/failed');
        }
         } catch (error) {
            setMessage('Registration Failed!... Please try again!')
         }
    };


    //fetch csrfToken
    const fetchCsrfToken = async () => {
        try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
            method: 'PATCH',
            credentials: 'include'
        });
            if (!response.ok) {
                throw new Error('Failed to fetch CSRF Token!');
            }
            const data = await response.json();
                return data.csrfToken;
        } catch (error) {
            setMessage('Failed to fetch CSRF Token');
            throw error;
        }
    };



  return (
   <form onSubmit={RegisterNewUser}>
    <input 
    type='text' 
    value={username} 
    onChange={(e) => 
    setUsername(e.target.value)} 
    placeholder='Username' 
    required
    />

    <input 
    type='text' 
    value={email} 
    onChange={(e) => 
    setEmail(e.target.value)} 
    placeholder='Email' 
    required
    />

    <input 
    type='text' 
    value={password} 
    onChange={(e) => 
    setPassword(e.target.value)} 
    placeholder='Password' 
    required
    />

    <button type='submit'>Register</button>
    {message && <p>{message}</p>}
   </form>
  )
}

export default Register;