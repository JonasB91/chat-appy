import React, { useState, useEffect } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = null //JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch('https://chatify-api.up.railway.app/messages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const sanitizeMessage = (message) => {
        const temp = document.createElement('div');
        temp.textContent = message;
        return temp.innerHTML;
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://chatify-api.up.railway.app/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: sanitizeMessage(newMessage) })
            });
            if (!response.ok) throw new Error('Failed to send message');
            const data = await response.json();
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
        }
    }

    const deleteMessage = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`https://chatify-api.up.railway.app/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='chat-container'>
            {loading && <p>Loading messages...</p>}
            {error && <p>Error: {error}</p>}
            <div className='messages'>
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.userId === user.id ? 'own' : ''}`}>
                        <p>{msg.content}</p>
                        {msg.userId === user.id && (
                            <button onClick={() => deleteMessage(msg.id)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type in a message'
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
}

export default Chat;
