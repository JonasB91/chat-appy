import React, { useState } from 'react';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    // Setting state handling here.

    //Register new user and using fetchCsrfToken function 
    const RegisterNewUser = async (e) => {
        e.preventDefault();
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
                window.location.href = '/login';
            }, 2500);
        } else {
            setMessage(data.message || 'Registration error/failed');
        }
    };


    //fetch csrfToken
    const fetchCsrfToken = async () => {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
            method: 'PATCH',
            credentials: 'include'
        });
            const data = await response.json();
                return data.csrfToken;
    };



  return (
   <form onSubmit={RegisterNewUser}>
    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
    <button type='submit'>Register</button>
    {message && <p>{message}</p>}
   </form>
  )
}

export default Register;