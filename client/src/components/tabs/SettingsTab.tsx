import { useState } from 'react';
import { GameState } from '@/../../shared/schema';

interface SettingsTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function SettingsTab({ gameState, updateGameState }: SettingsTabProps) {
  const [volume, setVolume] = useState(75);
  const [autoSave, setAutoSave] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [combatAnimations, setCombatAnimations] = useState(true);

  const handleSaveGame = () => {
    // Save game logic
    localStorage.setItem('geminus-save', JSON.stringify(gameState));
    console.log('Game saved!');
  };

  const handleLoadGame = () => {
    const saved = localStorage.getItem('geminus-save');
    if (saved) {
      const loadedState = JSON.parse(saved);
      updateGameState(loadedState);
      console.log('Game loaded!');
    }
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      localStorage.removeItem('geminus-save');
      window.location.reload();
    }
  };

  const handleExportSave = () => {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geminus-save.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Game Settings</h2>
      
      {/* Game Controls */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Save & Load</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleSaveGame}
            className="glass-button px-4 py-2 rounded-md font-orbitron"
          >
            💾 Save Game
          </button>
          <button 
            onClick={handleLoadGame}
            className="glass-button px-4 py-2 rounded-md font-orbitron"
          >
            📁 Load Game
          </button>
          <button 
            onClick={handleExportSave}
            className="glass-button px-4 py-2 rounded-md font-orbitron"
          >
            📤 Export Save
          </button>
          <button 
            onClick={handleResetGame}
            className="glass-button px-4 py-2 rounded-md font-orbitron text-red-400 hover:text-red-300"
          >
            🗑️ Reset Game
          </button>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Audio</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Master Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{volume}%</div>
          </div>
        </div>
      </div>

      {/* Gameplay Settings */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Gameplay</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Auto-Save</span>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Chat Notifications</span>
            <input
              type="checkbox"
              checked={chatNotifications}
              onChange={(e) => setChatNotifications(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Combat Animations</span>
            <input
              type="checkbox"
              checked={combatAnimations}
              onChange={(e) => setCombatAnimations(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Controls Help */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Controls</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div>• <span className="text-orange-400">Arrow Keys / WASD</span> - Move character</div>
          <div>• <span className="text-orange-400">Enter / Space</span> - Interact / Attack</div>
          <div>• <span className="text-orange-400">Tab</span> - Switch between main tabs</div>
          <div>• <span className="text-orange-400">C</span> - Open chat</div>
          <div>• <span className="text-orange-400">M</span> - Open map</div>
          <div>• <span className="text-orange-400">I</span> - Open inventory</div>
          <div>• <span className="text-orange-400">P</span> - Open character stats</div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-4 glass-panel p-3 rounded-lg">
        <h3 className="font-orbitron text-sm mb-2 text-orange-400">Game Information</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <div>Version: 2.0.0</div>
          <div>Build: Replit Migration</div>
          <div>Last Save: {new Date().toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}