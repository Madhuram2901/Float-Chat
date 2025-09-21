// src/components/ChatWindow.jsx
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useStore } from '../store/store';

export function ChatWindow() {
  const [input, setInput] = useState('');
  const { messages } = useStore();
  const { sendMessage, isLoading } = useChat();

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 p-3 rounded-lg ${
            msg.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
          } max-w-xs`}>
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-700 p-3 rounded-lg max-w-xs">
            <p className="text-sm text-gray-400 animate-pulse">Thinking...</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ocean data..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-cyan-600 text-white font-bold p-2 rounded-r-md hover:bg-cyan-700 disabled:bg-gray-500"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}