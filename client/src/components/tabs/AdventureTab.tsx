import { useState } from 'react';
import { Direction } from '@/types/game';

interface AdventureTabProps {
  currentZone: string;
  onMove: (direction: Direction) => void;
  onInteract: () => void;
}

export function AdventureTab({ currentZone, onMove, onInteract }: AdventureTabProps) {
  const [gameStatus, setGameStatus] = useState('Welcome to Geminus! Use the controls to explore and battle creatures.');
  const [combatLog, setCombatLog] = useState(['Ready for combat...']);
  const [currentEnemy, setCurrentEnemy] = useState<any>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyPress = (key: string, action: () => void) => {
    setPressedKeys(prev => new Set([...prev, key]));
    action();
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 150);
  };

  const handleMove = (direction: Direction) => {
    setGameStatus(`Moving ${direction}...`);
    onMove(direction);
  };

  const handleInteract = () => {
    setGameStatus('Searching area...');
    onInteract();
  };

  const addToCombatLog = (message: string) => {
    setCombatLog(prev => [...prev, message]);
  };

  const handleAttack = () => {
    addToCombatLog('You attack the enemy!');
  };

  const handleDefend = () => {
    addToCombatLog('You raise your guard.');
  };

  const handleSpell = () => {
    addToCombatLog('You cast a spell!');
  };

  const handleFlee = () => {
    addToCombatLog('You attempt to flee!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Game Area */}
      <div className="glass-panel p-4 rounded-lg">
        <h2 className="font-orbitron text-lg mb-3">
          Current Zone: <span style={{ color: 'var(--color-text-location)' }}>
            {currentZone.replace('-', ' ')}
          </span>
        </h2>
        
        {/* Game Status */}
        <div className="mb-4 p-3 bg-black bg-opacity-30 rounded-lg">
          <div className="text-sm">
            {gameStatus}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-between items-end mt-4">
          <div id="d-pad-controls">
            <div 
              className={`game-key move-key ${pressedKeys.has('up') ? 'pressed' : ''}`}
              id="key-up"
              onMouseDown={() => handleKeyPress('up', () => handleMove('up'))}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyPress('up', () => handleMove('up'));
              }}
            >
              ↑
            </div>
            <div 
              className={`game-key move-key ${pressedKeys.has('left') ? 'pressed' : ''}`}
              id="key-left"
              onMouseDown={() => handleKeyPress('left', () => handleMove('left'))}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyPress('left', () => handleMove('left'));
              }}
            >
              ←
            </div>
            <div 
              className={`game-key move-key ${pressedKeys.has('down') ? 'pressed' : ''}`}
              id="key-down"
              onMouseDown={() => handleKeyPress('down', () => handleMove('down'))}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyPress('down', () => handleMove('down'));
              }}
            >
              ↓
            </div>
            <div 
              className={`game-key move-key ${pressedKeys.has('right') ? 'pressed' : ''}`}
              id="key-right"
              onMouseDown={() => handleKeyPress('right', () => handleMove('right'))}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyPress('right', () => handleMove('right'));
              }}
            >
              →
            </div>
          </div>
          <div 
            className={`game-key ${pressedKeys.has('interact') ? 'pressed' : ''}`}
            id="key-interact"
            onMouseDown={() => handleKeyPress('interact', handleInteract)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleKeyPress('interact', handleInteract);
            }}
          >
            INTERACT
          </div>
        </div>
      </div>

      {/* Combat Area */}
      <div className="glass-panel p-4 rounded-lg combat-ui">
        <h2 className="font-orbitron text-lg mb-3">Combat</h2>
        
        {/* Enemy Display */}
        <div className="enemy-container p-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-orbitron mb-2">
              {currentEnemy ? currentEnemy.name : 'No Enemy'}
            </div>
            <div className="progress-bar-track h-3 mb-2">
              <div 
                className="progress-bar-fill h-full bg-red-500" 
                style={{ width: currentEnemy ? `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` : '0%' }}
              />
            </div>
            <div className="text-sm">
              {currentEnemy ? `${currentEnemy.health}/${currentEnemy.maxHealth}` : '-/-'}
            </div>
          </div>
        </div>

        {/* Combat Actions */}
        <div className="combat-actions mb-4">
          <button className="glass-button p-3 rounded-lg" onClick={handleAttack}>
            ATTACK
          </button>
          <button className="glass-button p-3 rounded-lg" onClick={handleDefend}>
            DEFEND
          </button>
          <button className="glass-button p-3 rounded-lg" onClick={handleSpell}>
            SPELL
          </button>
          <button className="glass-button p-3 rounded-lg" onClick={handleFlee}>
            FLEE
          </button>
        </div>

        {/* Combat Log */}
        <div className="combat-log p-3 bg-black bg-opacity-30 rounded-lg custom-scrollbar">
          <div>
            {combatLog.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
