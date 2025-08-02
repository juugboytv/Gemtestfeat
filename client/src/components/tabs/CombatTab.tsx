import { useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { ZONES } from '@/../../shared/gameData';

interface CombatTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function CombatTab({ gameState, updateGameState }: CombatTabProps) {
  const [selectedMonster, setSelectedMonster] = useState('goblin');
  const [enemyHp, setEnemyHp] = useState(100);
  const [maxEnemyHp, setMaxEnemyHp] = useState(100);
  const [isInCombat, setIsInCombat] = useState(false);

  const monsters = [
    { id: 'goblin', name: 'Goblin', hp: 50, damage: 10, level: 1 },
    { id: 'orc', name: 'Orc', hp: 100, damage: 20, level: 3 },
    { id: 'troll', name: 'Troll', hp: 200, damage: 35, level: 5 },
    { id: 'dragon', name: 'Dragon', hp: 500, damage: 100, level: 10 },
  ];

  const currentZone = ZONES[gameState.player.currentZone];

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 30) + 10;
    const newHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newHp);
    
    if (newHp === 0) {
      const expGained = 50;
      const goldGained = 25;
      
      updateGameState({
        player: {
          ...gameState.player,
          experience: gameState.player.experience + expGained,
          gold: gameState.player.gold + goldGained
        }
      });

      setIsInCombat(false);
      
      // Reset for next fight
      setTimeout(() => {
        setEnemyHp(maxEnemyHp);
      }, 1000);
    }
  };

  const startCombat = () => {
    setIsInCombat(true);
    const monster = monsters.find(m => m.id === selectedMonster);
    if (monster) {
      setMaxEnemyHp(monster.hp);
      setEnemyHp(monster.hp);
    }
  };

  const flee = () => {
    setIsInCombat(false);
    setEnemyHp(maxEnemyHp);
  };

  return (
    <div className="h-full">
      {/* Combat Stats Container - Exact match to original */}
      <div id="combat-stats-container">
        <div className="location-info">
          <div className="stats-label label-location">LOCATION</div>
          <div className="stats-value">{currentZone?.name || 'Unknown Zone'}</div>
        </div>
        
        <div className="stats-grid">
          <div className="stats-col">
            <div>
              <span className="stats-label label-health">HEALTH</span>
              <span className="stats-value">{gameState.player.health}</span>
            </div>
            <div>
              <span className="stats-label label-exp">EXP</span>
              <span className="stats-value">{gameState.player.experience.toLocaleString()}</span>
            </div>
            <div>
              <span className="stats-label label-next-level">NEXT LVL</span>
              <span className="stats-value">1000</span>
            </div>
          </div>
          
          <div className="stats-col">
            <div>
              <span className="stats-label label-drop">DROP</span>
              <span className="stats-value">25g</span>
            </div>
            <div>
              <span className="stats-label label-level">LEVEL</span>
              <span className="stats-value">{gameState.player.level}</span>
            </div>
            <div>
              <span className="stats-label label-gold">GOLD</span>
              <span className="stats-value" id="gold-value">{gameState.player.gold.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monster Selection */}
      <div className="combat-panel">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Select Enemy</h3>
        <select
          id="monsterSelect"
          value={selectedMonster}
          onChange={(e) => {
            setSelectedMonster(e.target.value);
            const monster = monsters.find(m => m.id === e.target.value);
            if (monster) {
              setMaxEnemyHp(monster.hp);
              setEnemyHp(monster.hp);
            }
          }}
          className="w-full mb-4"
        >
          {monsters.map(monster => (
            <option key={monster.id} value={monster.id}>
              {monster.name} (Lv.{monster.level} - HP: {monster.hp})
            </option>
          ))}
        </select>
      </div>

      {/* Enemy Status */}
      {isInCombat && (
        <div className="combat-panel">
          <div className="text-center">
            <h3 className="font-orbitron text-lg capitalize mb-2">{selectedMonster}</h3>
            <div className="monster-hp-bar">
              <div
                className="monster-hp-fill"
                style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}
              />
            </div>
            <div id="monster-hp-text" className="mt-2">
              {enemyHp} / {maxEnemyHp}
            </div>
            
            {enemyHp === 0 && (
              <div id="enemy-defeated-msg" className="mt-4" style={{ display: 'block' }}>
                ENEMY DEFEATED!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Combat Actions */}
      <div className="combat-panel">
        <div className="grid grid-cols-2 gap-2">
          {!isInCombat ? (
            <button
              onClick={startCombat}
              className="glass-button px-4 py-3 rounded-md font-orbitron col-span-2"
            >
              ⚔️ START COMBAT
            </button>
          ) : (
            <>
              <button
                onClick={handleAttack}
                className="glass-button px-4 py-3 rounded-md font-orbitron"
                disabled={enemyHp === 0}
              >
                ⚔️ Attack
              </button>
              <button
                onClick={() => {}}
                className="glass-button px-4 py-3 rounded-md font-orbitron"
                disabled={enemyHp === 0}
              >
                🛡️ Defend
              </button>
              <button
                onClick={() => {}}
                className="glass-button px-4 py-3 rounded-md font-orbitron"
                disabled={enemyHp === 0}
              >
                🔮 Spell
              </button>
              <button
                onClick={flee}
                className="glass-button px-4 py-3 rounded-md font-orbitron"
              >
                🏃 Flee
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}