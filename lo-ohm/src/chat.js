import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './LoOhmWh.png';
import './chat.css';
import Header from './Header';  // Add this import

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [recipient, setRecipient] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/chat/conversations/${currentUser}`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !recipient) return;

    try {
      await axios.post('http://localhost:5000/chat/send', {
        sender: currentUser,
        recipient: recipient,
        content: newMessage
      });

      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
<div className="chat-container">
    <Header />
    <div className="chat-content">
        <div className="chat-window">
            <div className="chat-header">Chat</div>
            <div className="chat-messages">
                {conversations.length > 0 ? (
                    conversations.map((conv) =>
                        conv.messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}
                            >
                                <p>{msg.content}</p>
                                <small>
                                    {msg.sender} - {new Date(msg.timestamp).toLocaleString()}
                                </small>
                            </div>
                        ))
                    )
                ) : (
                    <p>No messages yet. Start a conversation!</p>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Your Username"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Recipient's Username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    </div>
</div>

  );
}

export default Chat;