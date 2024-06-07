import React, { useState, useEffect } from 'react'


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    //Setting state handling för messages

    //Parsing and getting user from localstorage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchMessages();
    }, []);


    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('https://chatify-api.up.railway.app/messages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json()
        setMessages(data)
    }

    //Message function
    const SendingMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await fetch('https://chatify-api.up.railway.app/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newMessage })
        });
        const data = await response.json();
        if (response.ok) {
            setMessages([...messages, data])
            setNewMessage('');
        }
    }

    //Delete Message function
        const DeleteMessages = async (id) => {
            const token = localStorage.getItem('token')
            await fetch(`https://chatify-api.up.railway.app/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setMessages(messages.filter(msg => msg.id !== id))
        };

  return (
   <div className='chat-container'>
    <div className='messages'>
        {messages.map(msg => (
         <div key={msg.id} className={`message ${msg.userId === user.id ? 'own' : ''}`}>   
            <p>{msg.content}</p>
            {msg.userId === user.id && (
                <button onClick={() => DeleteMessages(msg.id)}>Delete</button>
            )}
            </div>
        ))}
    </div>
    <form onSubmit={SendingMessage}>
        <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type in a message' />
        <button type='submit'>Send</button>
    </form>
   </div>
  )
}

export default Chat