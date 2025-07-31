import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('chat-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0 || input !== '') {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages, input]);

  const handleBack = () => {
    if (!input && messages.length === 0) {
      navigate('/');
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-2">← Back</button>
      <div>
        {messages.map((msg, index) => (
          <CodeBlock key={index} code={msg} />
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your prompt..."
        className="w-full p-2 mt-4 text-black"
      />
    </div>
  );
}
