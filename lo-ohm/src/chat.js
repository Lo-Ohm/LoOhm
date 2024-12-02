import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './LoOhmWh.png';
import './chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [recipient, setRecipient] = useState('');

  // Fetch existing messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getmsg');
      // Process and set messages
      const messageData = response.data;
      const processedMessages = Object.entries(messageData).flatMap(([sender, messages]) => {
        const processedSenderMessages = [];
        for (let i = 0; i < messages.length; i += 3) {
          processedSenderMessages.push({
            sender: sender,
            recipient: messages[i],
            text: messages[i + 1]
          });
        }
        return processedSenderMessages;
      });
      setMessages(processedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post('http://localhost:5000/sendmsg', {
        sendee: recipient,
        sender: currentUser,
        messages: newMessage
      });

      // Clear input and refresh messages
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <header className="cat-header">
        <div className="header-content">
          <div className="header-logo">
            <img 
              src={logo}
              alt="Company Logo" 
              className="logo-image"
            />
          </div>
          <nav className="header-nav">
            <button className="header-btn">Profile</button>
            <button className="header-btn">Products</button>
            <button className="header-btn">Categories</button>
            <button className="header-btn">Cart</button>
          </nav>
        </div>
      </header>

      <div className="chat-window">
        <div className="chat-header">
          <h2>Chat</h2>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}
            >
              <span className="message-sender">{msg.sender}</span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Username"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recipient"
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
  );
}

export default Chat;