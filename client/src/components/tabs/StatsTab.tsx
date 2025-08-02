import { GameState } from '@/../../shared/schema';

interface StatsTabProps {
  gameState: GameState;
}

export default function StatsTab({ gameState }: StatsTabProps) {
  const calculateLevelUpCost = (currentLevel: number) => {
    return Math.floor(100 * Math.pow(1.1, currentLevel - 1));
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Character Stats</h2>
      
      {/* Core Stats */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Core Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-white font-orbitron">{gameState.player.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-red-400">{gameState.player.health}/{gameState.player.maxHealth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Experience:</span>
              <span className="text-green-400">{gameState.player.experience}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Gold:</span>
              <span className="text-yellow-400">{gameState.player.gold}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Zone:</span>
              <span className="text-purple-400">Zone {gameState.player.currentZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quest Streak:</span>
              <span className="text-blue-400">{gameState.player.questStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Progress</h3>
        
        {/* Health Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400">Health</span>
            <span className="text-red-400">{gameState.player.health}/{gameState.player.maxHealth}</span>
          </div>
          <div className="progress-bar-track h-3">
            <div 
              className="progress-bar-fill bg-red-500" 
              style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
            />
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400">Experience</span>
            <span className="text-green-400">{gameState.player.experience}</span>
          </div>
          <div className="progress-bar-track h-3">
            <div 
              className="progress-bar-fill bg-green-500" 
              style={{ width: `${Math.min(100, (gameState.player.experience / calculateLevelUpCost(gameState.player.level)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Equipment Summary */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Equipment Overview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Items Equipped:</span>
              <span className="text-white">{Object.values(gameState.equipment).filter(Boolean).length}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inventory:</span>
              <span className="text-white">{gameState.inventory.length}/25</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gems:</span>
              <span className="text-purple-400">{gameState.gemPouch.length}/20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Quests:</span>
              <span className="text-blue-400">{gameState.player.activeQuests.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Character Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="glass-button py-2 rounded-md font-orbitron text-sm">
            Rest (+50 Health)
          </button>
          <button className="glass-button py-2 rounded-md font-orbitron text-sm">
            Meditate (+Mana)
          </button>
          <button 
            className="glass-button py-2 rounded-md font-orbitron text-sm"
            disabled={gameState.player.experience < calculateLevelUpCost(gameState.player.level)}
          >
            Level Up
          </button>
          <button className="glass-button py-2 rounded-md font-orbitron text-sm">
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
}