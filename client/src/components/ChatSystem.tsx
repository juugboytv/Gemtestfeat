import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export default function ChatSystem() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to Geminus! Use the movement controls to explore.',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="glass-panel rounded-lg p-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-orbitron text-sm text-orange-400">Game Chat</h3>
        <div className="text-xs text-gray-400">
          {messages.length} messages
        </div>
      </div>
      
      <div className="h-20 overflow-y-auto custom-scrollbar mb-2 space-y-1">
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
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-2 py-1 text-sm bg-black/50 border border-orange-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={handleSendMessage}
          className="glass-button px-2 py-1 rounded text-orange-400 hover:text-orange-300"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}