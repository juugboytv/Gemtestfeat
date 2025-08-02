import { GameSettings } from '@shared/schema';

interface SettingsTabProps {
  settings: GameSettings;
  playerName: string;
  onSave: () => void;
  onLoad: () => void;
  onNewGame: () => void;
  onResetCharacter: () => void;
  onToggleAnimations: () => void;
  onToggleSounds: () => void;
  onNameChange: (name: string) => void;
}

export function SettingsTab({
  settings,
  playerName,
  onSave,
  onLoad,
  onNewGame,
  onResetCharacter,
  onToggleAnimations,
  onToggleSounds,
  onNameChange
}: SettingsTabProps) {
  return (
    <div className="glass-panel p-4 rounded-lg h-full">
      <h2 className="font-orbitron text-lg mb-4">Settings</h2>
      
      <div className="space-y-6">
        {/* Game Settings */}
        <div>
          <h3 className="font-orbitron text-base mb-3">Game Settings</h3>
          <div className="space-y-3">
            <button className="glass-button w-full p-3 rounded-lg" onClick={onSave}>
              💾 Save Game
            </button>
            <button className="glass-button w-full p-3 rounded-lg" onClick={onLoad}>
              📁 Load Game
            </button>
            <button className="glass-button w-full p-3 rounded-lg" onClick={onNewGame}>
              🆕 New Game
            </button>
          </div>
        </div>

        {/* Character Settings */}
        <div>
          <h3 className="font-orbitron text-base mb-3">Character</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Character Name:</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-lg bg-black bg-opacity-40 border border-gray-600 text-white"
                value={playerName}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <button className="glass-button w-full p-3 rounded-lg" onClick={onResetCharacter}>
              🔄 Reset Character
            </button>
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <h3 className="font-orbitron text-base mb-3">Display</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Animations:</span>
              <button className="glass-button px-4 py-2 rounded-lg" onClick={onToggleAnimations}>
                {settings.animations ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Sound Effects:</span>
              <button className="glass-button px-4 py-2 rounded-lg" onClick={onToggleSounds}>
                {settings.sounds ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
