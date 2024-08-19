import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; 
import '../css/Chat.css'; // Antag att du har lagrat CSS:en i Chat.css

const Chat = () => {
    const { authState, fetchCsrfToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    useEffect(() => {
        if (authState.isAuthenticated) {
            fetchMessages();
        }
    }, [authState.isAuthenticated]);

    const fetchMessages = async () => {
        try {
            const response = await fetch('https://chatify-api.up.railway.app/messages', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sanitizeMessage = (message) => {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = message;
        return tempDiv.innerHTML;
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const sanitizedMessage = sanitizeMessage(newMessage); 
        const csrfToken = await fetchCsrfToken(); 
        try {
            const response = await fetch('https://chatify-api.up.railway.app/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ text: sanitizedMessage })
            });
            if (!response.ok) throw new Error('Failed to send message');
            const newMsg = await response.json();
            fetchMessages(); 
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (id) => {
        const csrfToken = await fetchCsrfToken();
        try {
            await fetch(`https://chatify-api.up.railway.app/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'CSRF-Token': csrfToken
                }
            });
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const handleSelectMessage = (id) => {
        setSelectedMessageId(id === selectedMessageId ? null : id);
    };

    return (
        <div className='chat-container'>
            <div className='messages'>
                {messages.map((msg, index) => {
                    const isOwnMessage = msg.userId === authState.user.id;
                    return (
                        <div
                            key={msg.id || index}
                            className={`message ${isOwnMessage ? 'own' : 'other'}`}
                            onClick={() => handleSelectMessage(msg.id)}
                        >
                            <p>{msg.text}</p>
                            {isOwnMessage && selectedMessageId === msg.id && (
                                <button onClick={() => deleteMessage(msg.id)} className="delete-btn">Delete</button>
                            )}
                        </div>
                    );
                })}
            </div>
            <form onSubmit={sendMessage}>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type in a message'
                    className="message-input"
                />
                <button type='submit' className="send-btn">Send</button>
            </form>
        </div>
    );
};

export default Chat;
