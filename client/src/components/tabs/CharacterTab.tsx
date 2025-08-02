import { useState } from 'react';
import { Player } from '@shared/schema';
import { AttributeType } from '@/types/game';

interface CharacterTabProps {
  player: Player;
  onAttributeIncrease: (attribute: AttributeType) => void;
}

export function CharacterTab({ player, onAttributeIncrease }: CharacterTabProps) {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.clear(); // Close all others
        newSet.add(id);
      }
      return newSet;
    });
  };

  const hasAvailablePoints = player.availablePoints > 0;

  const calculateAttackPower = () => {
    return Math.floor(player.attributes.strength * 1.5) + 5;
  };

  const calculateDefense = () => {
    return Math.floor(player.attributes.vitality * 1.2) + 5;
  };

  const calculateMaxHealth = () => {
    return Math.floor(player.attributes.vitality * 10) + 50;
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Character Info */}
        <div className="glass-panel p-4 rounded-lg">
          <h2 className="font-orbitron text-lg mb-4">Character Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="font-orbitron" style={{ color: 'var(--highlight-orange)' }}>
                {player.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="font-orbitron">{player.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Experience:</span>
              <span style={{ color: 'var(--color-text-exp)' }}>{player.experience}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold:</span>
              <span style={{ color: 'var(--color-text-gold)' }}>{player.gold}</span>
            </div>
            <div className="flex justify-between">
              <span>Available Points:</span>
              <span style={{ color: 'var(--color-text-next-level)' }}>{player.availablePoints}</span>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="glass-panel p-4 rounded-lg">
          <h2 className="font-orbitron text-lg mb-4">Attributes</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Strength:</span>
              <div className="flex items-center gap-2">
                <span>{player.attributes.strength}</span>
                <button 
                  className="attr-btn"
                  disabled={!hasAvailablePoints}
                  onClick={() => onAttributeIncrease('strength')}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Agility:</span>
              <div className="flex items-center gap-2">
                <span>{player.attributes.agility}</span>
                <button 
                  className="attr-btn"
                  disabled={!hasAvailablePoints}
                  onClick={() => onAttributeIncrease('agility')}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Intelligence:</span>
              <div className="flex items-center gap-2">
                <span>{player.attributes.intelligence}</span>
                <button 
                  className="attr-btn"
                  disabled={!hasAvailablePoints}
                  onClick={() => onAttributeIncrease('intelligence')}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Vitality:</span>
              <div className="flex items-center gap-2">
                <span>{player.attributes.vitality}</span>
                <button 
                  className="attr-btn"
                  disabled={!hasAvailablePoints}
                  onClick={() => onAttributeIncrease('vitality')}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="mt-4">
        <div className={`stat-accordion-item ${openAccordions.has('combat') ? 'open' : ''}`}>
          <button 
            className="stat-accordion-header w-full text-left"
            onClick={() => toggleAccordion('combat')}
          >
            <h3>Combat Stats</h3>
            <span className="accordion-arrow">▶</span>
          </button>
          <div className="stat-accordion-content">
            <div className="stat-line">
              <span className="stat-icon">⚔️</span>
              <span className="stat-name">Attack Power</span>
              <span className="stat-value">{calculateAttackPower()}</span>
            </div>
            <div className="stat-line">
              <span className="stat-icon">🛡️</span>
              <span className="stat-name">Defense</span>
              <span className="stat-value">{calculateDefense()}</span>
            </div>
            <div className="stat-line">
              <span className="stat-icon">❤️</span>
              <span className="stat-name">Max Health</span>
              <span className="stat-value">{calculateMaxHealth()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
