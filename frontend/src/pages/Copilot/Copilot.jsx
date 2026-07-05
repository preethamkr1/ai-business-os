import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import './Copilot.css';

const Copilot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const processedQuery = useRef(false);
  
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('copilot_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Why did CTR drop?",
    "Which campaigns are underspending?",
    "Summarize this week.",
    "Biggest risk?",
    "Best opportunity?",
    "Growth forecast?"
  ];

  useEffect(() => {
    sessionStorage.setItem('copilot_chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (location.state?.autoQuery && !processedQuery.current) {
      processedQuery.current = true;
      const query = location.state.autoQuery;
      navigate(location.pathname, { replace: true, state: {} });
      handleSend(query);
    }
  }, [location.state, navigate]);

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('copilot_chat');
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const tenant_id = sessionStorage.getItem('tenant_id');
      const response = await api.post('/copilot/chat', { message: text, tenant_id });
      const aiMsg = { role: 'assistant', content: response.response || response.message || "No response" };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="copilot-container">
      <div className="copilot-header">
        <h2>AI Growth Copilot</h2>
        {messages.length > 0 && (
          <button className="clear-chat-btn" onClick={clearChat} title="Clear Chat">
            <Trash2 size={16} /> Clear Chat
          </button>
        )}
      </div>
      
      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <Bot size={48} className="empty-icon" />
            <h2>How can I help you grow today?</h2>
            <div className="suggestions">
              {suggestedPrompts.map((prompt, i) => (
                <button key={i} className="suggestion-btn" onClick={() => handleSend(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant loading">
                <div className="message-avatar"><Bot size={18} /></div>
                <div className="message-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="input-area">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask Copilot anything about your business..." 
        />
        <button className="send-btn" onClick={() => handleSend(input)} disabled={!input.trim() || loading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Copilot;
