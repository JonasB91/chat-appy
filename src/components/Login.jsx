import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import '../css/Login.css'; 

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
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
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
                {message && <p className="message">{message}</p>}
            </form>
            <div className="login-prompt">
                <p>Har du inget konto? <Link to="/register">Registrera dig här</Link></p>
            </div>
        </div>
    );
};

export default Login;
