// src/store/store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  messages: [{ role: 'assistant', content: 'Hello! How can I help you explore ocean data today?' }],
  mapData: null,
  chartData: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMapData: (data) => set({ mapData: data }),
  setChartData: (data) => set({ chartData: data }),
  clearChartData: () => set({ chartData: null }),
}));