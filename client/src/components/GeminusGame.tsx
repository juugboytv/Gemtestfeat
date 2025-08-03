import React, { useState } from 'react';
import ZonePage from '../pages/ZonePage';

const GeminusGame: React.FC = () => {
  const [currentView, setCurrentView] = useState<'zone' | 'game'>('zone');

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <header className="bg-gray-900 border-b border-orange-500/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold font-orbitron text-orange-500">
            Geminus
          </h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setCurrentView('zone')}
              className={`px-4 py-2 rounded transition-colors ${
                currentView === 'zone' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Zone Explorer
            </button>
            <button
              onClick={() => setCurrentView('game')}
              className={`px-4 py-2 rounded transition-colors ${
                currentView === 'game' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Full Game
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'zone' && <ZonePage />}
        {currentView === 'game' && (
          <div className="min-h-screen text-white">
            {/* Embed the original game HTML */}
            <iframe 
              src="/original_game.html" 
              className="w-full h-screen border-0"
              title="Geminus Full Game"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default GeminusGame;