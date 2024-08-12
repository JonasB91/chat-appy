import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            setMessage('Inloggningen misslyckades. Vänligen försök igen.');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Logga in</h2>
                <input 
                    type='text' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder='Användarnamn' 
                    required
                />
                <input 
                    type='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Lösenord' 
                    required
                />
                <button type='submit'>Logga in</button>
                {message && <p>{message}</p>}
            </form>
            <p>Har du inget konto? <Link to="/register">Registrera dig här</Link></p>
        </div>
    );
};

export default Login;
