// src/App.jsx
import { MapContainer } from './components/MapContainer';
import { ChatWindow } from './components/ChatWindow';
import { ChartPanel } from './components/ChartPanel';

function App() {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col md:flex-row overflow-hidden">
      <main className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md z-10">
          <h1 className="text-2xl font-bold text-cyan-400">FloatChat 🌊</h1>
          <p className="text-sm text-gray-400">AI-Powered Conversational Interface for ARGO Data</p>
        </header>
        <div className="flex-1 relative">
          <MapContainer />
          <ChartPanel />
        </div>
      </main>
      <aside className="w-full md:w-96 bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col h-1/3 md:h-full">
        <ChatWindow />
      </aside>
    </div>
  );
}

export default App;