// src/hooks/useChat.js
import { useState } from 'react';
import { useStore } from '../store/store';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, setMapData, setChartData } = useStore();

  const sendMessage = async (query) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: query });

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      addMessage({ role: 'assistant', content: data.chatMessage });

      if (data.response.type === 'MAP_DATA') {
        setMapData(data.response.data);
      } else if (data.response.type === 'CHART_DATA') {
        setChartData(data.response.data);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      addMessage({ role: 'assistant', content: "Sorry, I encountered an error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
}