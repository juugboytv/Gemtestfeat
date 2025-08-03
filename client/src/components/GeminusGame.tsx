import React, { useEffect, useState } from 'react';
import { GameMap } from './GameMap';

declare global {
  interface Window {
    // Game globals from original script.js
    state: any;
    ui: any;
    WorldMapManager: any;
    loadGameData: () => Promise<void>;
    CreationManager: any;
  }
}

const GeminusGame: React.FC = () => {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [showReactMap, setShowReactMap] = useState(false);
  
  useEffect(() => {
    // Wait for the original game to initialize
    const checkGameReady = () => {
      if (window.state && window.WorldMapManager) {
        setGameLoaded(true);
        
        // Give user option to switch to React map after game loads
        setTimeout(() => {
          const switchButton = document.createElement('button');
          switchButton.id = 'switch-to-react-map';
          switchButton.className = 'glass-button px-3 py-2 text-sm absolute top-2 right-2 z-50';
          switchButton.textContent = 'Switch to Modern Map';
          switchButton.onclick = () => setShowReactMap(true);
          
          const gameContainer = document.getElementById('game-container');
          if (gameContainer) {
            gameContainer.appendChild(switchButton);
          }
        }, 3000);
      } else {
        setTimeout(checkGameReady, 500);
      }
    };
    
    checkGameReady();
  }, []);

  if (showReactMap) {
    return (
      <div className="modern-game-container h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-orange-500/30">
            <h1 className="text-2xl font-orbitron text-orange-400">Geminus</h1>
            <button 
              onClick={() => setShowReactMap(false)}
              className="glass-button px-3 py-2 text-sm"
            >
              Back to Original
            </button>
          </header>
          
          {/* Main Game Area */}
          <main className="flex-1 flex overflow-hidden">
            {/* Game Map */}
            <div className="flex-1 p-4">
              <GameMap />
            </div>
            
            {/* Game Interface Sidebar */}
            <div className="w-80 bg-gray-900 border-l border-orange-500/30 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="glass-panel p-3 rounded-lg">
                  <h3 className="text-lg font-orbitron text-orange-400 mb-2">Character</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="text-orange-400">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health:</span>
                      <span className="text-green-400">100/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="text-blue-400">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gold:</span>
                      <span className="text-yellow-400">100</span>
                    </div>
                  </div>
                </div>
                
                <div className="glass-panel p-3 rounded-lg">
                  <h3 className="text-lg font-orbitron text-orange-400 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full glass-button py-2 text-sm">Equipment</button>
                    <button className="w-full glass-button py-2 text-sm">Inventory</button>
                    <button className="w-full glass-button py-2 text-sm">Combat</button>
                    <button className="w-full glass-button py-2 text-sm">Settings</button>
                  </div>
                </div>
                
                <div className="glass-panel p-3 rounded-lg">
                  <h3 className="text-lg font-orbitron text-orange-400 mb-2">Zone Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full glass-button py-2 text-sm">🆘 Heal at Sanctuary</button>
                    <button className="w-full glass-button py-2 text-sm">⚔️ Visit Armory</button>
                    <button className="w-full glass-button py-2 text-sm">🔮 Visit Arcanum</button>
                    <button className="w-full glass-button py-2 text-sm">🏧 Access Bank</button>
                    <button className="w-full glass-button py-2 text-sm">🌀 Teleport</button>
                    <button className="w-full glass-button py-2 text-sm">💎 Gem Crucible</button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Return null to let the original HTML game run
  return null;
};

export default GeminusGame;