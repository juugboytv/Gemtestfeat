import { useState } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export default function ChatSystem() {
  const [activeChannel, setActiveChannel] = useState('main');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to Geminus! Use the movement controls to explore.',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const channels = [
    { id: 'main', label: 'Main' },
    { id: 'sales', label: 'Sales' },
    { id: 'clan', label: 'Clan' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Auto-reply for demonstration
      setTimeout(() => {
        const systemReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Your message has been received.',
          sender: 'system',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemReply]);
      }, 1000);
    }
  };

  return (
    <div id="footer-chat-container" className="glass-panel w-full p-2 rounded-lg flex flex-col">
      <div className="flex-shrink-0 flex flex-wrap gap-1 mb-2">
        {channels.map((channel) => (
          <button 
            key={channel.id}
            data-channel={channel.id}
            className={`footer-tab-button glass-button text-xs px-3 py-1 rounded-md flex-grow ${
              activeChannel === channel.id ? 'active' : ''
            }`}
            onClick={() => setActiveChannel(channel.id)}
          >
            {channel.label}
          </button>
        ))}
        <button 
          id="open-chat-modal-btn" 
          className="glass-button text-xs px-2 py-1 rounded-md" 
          title="Open Full Chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
          </svg>
        </button>
      </div>
      
      <div 
        id="footer-chat-content-wrapper" 
        className="text-xs space-y-1 overflow-y-auto custom-scrollbar flex-grow" 
        style={{ height: '70px' }}
      >
        {messages.map((message) => (
          <div key={message.id} className={`text-xs p-2 rounded ${
            message.sender === 'user' 
              ? 'chat-bubble chat-bubble-user text-orange-300' 
              : 'chat-bubble chat-bubble-other text-gray-300'
          }`}>
            <span className="font-bold">
              {message.sender === 'user' ? 'You' : 'System'}:
            </span>{' '}
            {message.text}
          </div>
        ))}
      </div>
      
      <form id="footer-message-form" className="flex-shrink-0 flex gap-2 mt-2" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          id="footer-message-input" 
          className="footer-chat-input flex-grow w-full px-2 py-1 text-xs rounded-md" 
          placeholder="Type a message..." 
          autoComplete="off"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button 
          type="submit" 
          id="footer-send-button" 
          className="glass-button text-xs px-3 py-1 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}