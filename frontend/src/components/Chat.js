import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages from backend on mount and every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = () => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add message to backend and update state
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (trimmed) {
      const newMsg = {
        sender: 'You',
        avatar: '🙂',
        message: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      setInputMessage('');
      fetchMessages();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">💬 Divine Discussions</h2>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, idx) => (
              <div key={message._id || message.id || idx} className="message">
                <div className="message-avatar">{message.avatar}</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">{message.sender}</span>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              autoComplete="off"
            />
            <button type="submit" className="send-button">🕉️</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;