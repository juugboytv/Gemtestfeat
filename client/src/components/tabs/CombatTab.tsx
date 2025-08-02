import { useState } from 'react';
import { GameState } from '@/../../shared/schema';

interface CombatTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function CombatTab({ gameState, updateGameState }: CombatTabProps) {
  const [selectedMonster, setSelectedMonster] = useState('goblin');
  const [enemyHp, setEnemyHp] = useState(100);
  const [maxEnemyHp, setMaxEnemyHp] = useState(100);
  const [combatLog, setCombatLog] = useState('Ready for combat!');

  const monsters = [
    { id: 'goblin', name: 'Goblin', hp: 50, damage: 10 },
    { id: 'orc', name: 'Orc', hp: 100, damage: 20 },
    { id: 'dragon', name: 'Dragon', hp: 500, damage: 100 },
  ];

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 30) + 10;
    const newHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newHp);
    
    if (newHp === 0) {
      setCombatLog(`You defeated the ${selectedMonster}! Gained 50 XP and 25 Gold.`);
      // Reset for next fight
      setTimeout(() => {
        setEnemyHp(maxEnemyHp);
        setCombatLog('Enemy respawned! Ready for combat!');
      }, 2000);
    } else {
      setCombatLog(`You dealt ${damage} damage! Enemy has ${newHp} HP remaining.`);
    }
  };

  const handleDefend = () => {
    setCombatLog('You defended and reduced incoming damage!');
  };

  const handleSpell = () => {
    const damage = Math.floor(Math.random() * 50) + 20;
    const newHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newHp);
    setCombatLog(`You cast a spell for ${damage} damage!`);
  };

  const handleFlee = () => {
    setCombatLog('You fled from combat!');
    setEnemyHp(maxEnemyHp);
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Combat</h2>
      
      {/* Monster Selection */}
      <div className="mb-4">
        <label className="block text-sm font-orbitron text-gray-300 mb-2">Select Enemy:</label>
        <select
          value={selectedMonster}
          onChange={(e) => {
            setSelectedMonster(e.target.value);
            const monster = monsters.find(m => m.id === e.target.value);
            if (monster) {
              setMaxEnemyHp(monster.hp);
              setEnemyHp(monster.hp);
            }
          }}
          className="glass-button px-3 py-2 rounded-md w-full"
        >
          {monsters.map(monster => (
            <option key={monster.id} value={monster.id}>
              {monster.name} (HP: {monster.hp})
            </option>
          ))}
        </select>
      </div>

      {/* Enemy Status */}
      <div className="enemy-container p-4 mb-4">
        <div className="text-center mb-3">
          <h3 className="font-orbitron text-lg text-red-400 capitalize">{selectedMonster}</h3>
          <div className="mt-2">
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}
              />
            </div>
            <div className="text-sm text-red-400 mt-1 font-bold">
              {enemyHp} / {maxEnemyHp}
            </div>
          </div>
        </div>
      </div>

      {/* Combat Actions */}
      <div className="combat-actions mb-4">
        <button
          onClick={handleAttack}
          className="glass-button px-4 py-3 rounded-md font-orbitron"
          disabled={enemyHp === 0}
        >
          ⚔️ Attack
        </button>
        <button
          onClick={handleDefend}
          className="glass-button px-4 py-3 rounded-md font-orbitron"
          disabled={enemyHp === 0}
        >
          🛡️ Defend
        </button>
        <button
          onClick={handleSpell}
          className="glass-button px-4 py-3 rounded-md font-orbitron"
          disabled={enemyHp === 0}
        >
          🔮 Spell
        </button>
        <button
          onClick={handleFlee}
          className="glass-button px-4 py-3 rounded-md font-orbitron"
        >
          🏃 Flee
        </button>
      </div>

      {/* Combat Log */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-2 text-orange-400">Combat Log</h3>
        <div className="combat-log">
          <div className="text-sm text-gray-300">{combatLog}</div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mt-4 glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Combat Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-purple-400">Zone {gameState.player.currentZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-blue-400">{gameState.player.health}/{gameState.player.maxHealth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-orange-400">{gameState.player.level}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Experience:</span>
              <span className="text-green-400">{gameState.player.experience.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gold:</span>
              <span className="text-yellow-400">{gameState.player.gold.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}