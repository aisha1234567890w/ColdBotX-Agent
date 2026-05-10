import { useState, useRef, useEffect } from 'react';

const N8N_CHAT_URL = 'https://bokafynaveed.app.n8n.cloud/webhook/7776c837-0ef5-4caf-a161-98dd1d341464/chat';

// Generate a stable session ID per browser session
const getSessionId = () => {
  let sid = sessionStorage.getItem('chat_session_id');
  if (!sid) {
    sid = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('chat_session_id', sid);
  }
  return sid;
};

export default function N8nChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! 👋 I\'m your AI assistant. How can I help you with a reservation today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(N8N_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: text,
          sessionId: getSessionId(),
        }),
      });

      console.log('[N8nChat] Response status:', response.status);
      if (!response.ok) {
        const errText = await response.text();
        console.error('[N8nChat] Error body:', errText);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[N8nChat] Response data:', data);

      // n8n Chat Trigger returns output in multiple possible formats
      const replyText =
        data?.output ||
        data?.text ||
        data?.message ||
        data?.reply ||
        data?.response ||
        (Array.isArray(data) && (data[0]?.output || data[0]?.text || data[0]?.message)) ||
        'Sorry, I didn\'t get a response. Please try again.';

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, something went wrong. Please try again or use another booking method.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(79,70,229,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
            </svg>
            {hasUnread && (
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '12px', height: '12px', background: '#ef4444',
                borderRadius: '50%', border: '2px solid white'
              }} />
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chat-window"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            zIndex: 9998,
            width: '360px',
            maxWidth: 'calc(100vw - 48px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: '24px',
            background: 'white',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideIn 0.25s ease',
          }}
        >
          <style>{`
            @keyframes chatSlideIn {
              from { opacity: 0; transform: translateY(16px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes dotPulse {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1); opacity: 1; }
            }
            .chat-msg-user { align-self: flex-end; background: linear-gradient(135deg,#4f46e5,#7c3aed); color: white; border-radius: 18px 18px 4px 18px; }
            .chat-msg-bot { align-self: flex-start; background: #f3f4f6; color: #111827; border-radius: 18px 18px 18px 4px; }
            .chat-scroll::-webkit-scrollbar { width: 4px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
          `}</style>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>🤖</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>Aifur AI Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online • Ready to help
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}
                style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="chat-msg-bot" style={{ padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#9ca3af', display: 'inline-block',
                    animation: `dotPulse 1.2s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
            background: 'white',
            flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              style={{
                flex: 1,
                border: '1.5px solid #e5e7eb',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.4',
                maxHeight: '80px',
                overflowY: 'auto',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                width: '42px', height: '42px', flexShrink: 0,
                borderRadius: '12px',
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg,#4f46e5,#7c3aed)'
                  : '#e5e7eb',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, transform 0.1s',
              }}
              onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isLoading ? 'white' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', padding: '8px', fontSize: '11px',
            color: '#9ca3af', background: 'white', flexShrink: 0,
          }}>
            Powered by AI • Press Enter to send
          </div>
        </div>
      )}
    </>
  );
}

// Export an imperative open function so the Reservations page button can open it
export const openN8nChat = () => {
  const btn = document.getElementById('chat-toggle-btn');
  const win = document.getElementById('chat-window');
  if (!win) btn?.click();
};
