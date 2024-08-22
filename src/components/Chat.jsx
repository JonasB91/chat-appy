import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; 
import '../css/Chat.css';

const Chat = () => {
    const { authState, fetchCsrfToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [fakeChat] = useState([
        {
            "text": "Tja tja, hur mår du?",
            "avatar": "https://i.pravatar.cc/100?img=14",
            "username": "Johnny",
            "conversationId": null
        },
        {
            "text": "Hallå!! Svara då!!",
            "avatar": "https://i.pravatar.cc/100?img=14",
            "username": "Johnny",
            "conversationId": null
        },
        {
            "text": "Sover du eller?! 😴",
            "avatar": "https://i.pravatar.cc/100?img=14",
            "username": "Johnny",
            "conversationId": null
        }
    ]);

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
                body: JSON.stringify({
                    text: sanitizedMessage,
                    username: authState.user.username,
                    avatar: authState.user.avatar 
                })
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

    return (
        <div className='chat-container'>
            <div className='messages'>
                {fakeChat.map((msg, index) => (
                    <div key={index} className="message other">
                        <img src={msg.avatar} alt="avatar" className="avatar" />
                        <div className="message-content">
                            <p className="username">{msg.username}</p>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {messages.map((msg, index) => {
                    const isOwnMessage = msg.userId === authState.user.id;
                    return (
                        <div
                            key={msg.id || index}
                            className={`message ${isOwnMessage ? 'own' : 'other'}`}
                        >
                            <img src={isOwnMessage ? authState.user.avatar : msg.avatar} alt="avatar" className="avatar" />
                            <div className="message-content">
                                <p className="username">{isOwnMessage ? authState.user.username : msg.username}</p>
                                <p>{msg.text}</p>
                                {isOwnMessage && (
                                    <button onClick={() => deleteMessage(msg.id)} className="delete-btn">Delete</button>
                                )}
                            </div>
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
