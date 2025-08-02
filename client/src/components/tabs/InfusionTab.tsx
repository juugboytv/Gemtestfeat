import { useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { BASE_ITEMS } from '@/../../shared/gameData';

interface InfusionTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function InfusionTab({ gameState, updateGameState }: InfusionTabProps) {
  const [selectedInfusion, setSelectedInfusion] = useState('power');
  const [infusionLevel, setInfusionLevel] = useState(1);

  const infusionTypes = [
    {
      id: 'power',
      name: 'Power Infusion',
      description: 'Increases weapon damage',
      cost: 100,
      icon: '⚡',
      color: 'text-yellow-400'
    },
    {
      id: 'vitality',
      name: 'Vitality Infusion',
      description: 'Increases maximum health',
      cost: 150,
      icon: '❤️',
      color: 'text-red-400'
    },
    {
      id: 'defense',
      name: 'Defense Infusion',
      description: 'Increases armor rating',
      cost: 125,
      icon: '🛡️',
      color: 'text-blue-400'
    },
    {
      id: 'speed',
      name: 'Speed Infusion',
      description: 'Increases movement speed',
      cost: 75,
      icon: '💨',
      color: 'text-green-400'
    }
  ];

  const handleInfusion = () => {
    const infusion = infusionTypes.find(i => i.id === selectedInfusion);
    if (infusion) {
      const totalCost = infusion.cost * infusionLevel;
      
      if (gameState.player.gold >= totalCost) {
        updateGameState({
          player: {
            ...gameState.player,
            gold: gameState.player.gold - totalCost
          }
        });
        
        console.log(`Applied ${infusion.name} level ${infusionLevel}`);
      } else {
        console.log('Not enough gold for infusion');
      }
    }
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Molten Core Infusion</h2>
      
      {/* Infusion Chamber */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Infusion Chamber</h3>
        <div className="text-center mb-4">
          <div className="w-24 h-24 mx-auto border-2 border-orange-500 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-red-500/20">
            <div className="text-4xl animate-pulse">🔥</div>
          </div>
          <div className="mt-2 text-sm text-gray-400">Molten Core Active</div>
        </div>
      </div>

      {/* Infusion Selection */}
      <div className="mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Select Infusion</h3>
        <div className="grid grid-cols-2 gap-2">
          {infusionTypes.map((infusion) => (
            <div
              key={infusion.id}
              className={`glass-panel p-3 rounded-lg cursor-pointer transition-all ${
                selectedInfusion === infusion.id 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'hover:border-orange-500/50'
              }`}
              onClick={() => setSelectedInfusion(infusion.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{infusion.icon}</div>
                <h4 className={`font-orbitron text-sm ${infusion.color}`}>{infusion.name}</h4>
                <div className="text-xs text-gray-400 mt-1">{infusion.description}</div>
                <div className="text-xs text-yellow-400 mt-1">{infusion.cost}g per level</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infusion Level */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Infusion Level</h3>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setInfusionLevel(Math.max(1, infusionLevel - 1))}
            className="glass-button px-4 py-2 rounded-md font-orbitron"
          >
            -
          </button>
          <div className="text-center">
            <div className="text-2xl font-orbitron text-orange-400">{infusionLevel}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
          <button
            onClick={() => setInfusionLevel(Math.min(10, infusionLevel + 1))}
            className="glass-button px-4 py-2 rounded-md font-orbitron"
          >
            +
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-lg text-yellow-400 mb-2">
            Total Cost: {infusionTypes.find(i => i.id === selectedInfusion)?.cost! * infusionLevel}g
          </div>
          <button
            onClick={handleInfusion}
            className="glass-button px-6 py-3 rounded-md font-orbitron"
            disabled={gameState.player.gold < (infusionTypes.find(i => i.id === selectedInfusion)?.cost! * infusionLevel)}
          >
            Apply Infusion
          </button>
        </div>
      </div>

      {/* Active Infusions */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Active Infusions</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Power:</span>
            <span className="text-yellow-400">Level 0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vitality:</span>
            <span className="text-red-400">Level 0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Defense:</span>
            <span className="text-blue-400">Level 0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Speed:</span>
            <span className="text-green-400">Level 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}