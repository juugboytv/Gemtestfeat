import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Feature {
  q: number;
  r: number;
  type: string;
  name?: string;
}

interface Zone {
  id: number;
  name: string;
  gridSize: number;
  features: Feature[];
}

interface HexMapProps {
  currentZone: Zone;
  playerPosition: { q: number; r: number };
  onPlayerMove: (dq: number, dr: number) => void;
  onHexClick: (q: number, r: number) => void;
}

// Hex coordinate to pixel conversion
const hexToPixel = (q: number, r: number, hexSize: number) => {
  const x = hexSize * (3/2 * q);
  const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
  return { x, y };
};

// Feature type to display mapping
const getFeatureDisplay = (featureType: string) => {
  const featureMap: Record<string, { name: string; icon: string; color: string }> = {
    'Sanctuary': { name: 'Sanctuary', icon: '🆘', color: 'bg-green-600' },
    'Armory': { name: 'Weapons/Combat Shop', icon: '⚔️', color: 'bg-red-600' },
    'Arcanum': { name: 'Magic/Accessories Shop', icon: '🔮', color: 'bg-purple-600' },
    'AetheriumConduit': { name: 'Bank', icon: '🏧', color: 'bg-blue-600' },
    'Teleporter': { name: 'Teleport Zone', icon: '🌀', color: 'bg-cyan-600' },
    'GemCrucible': { name: 'Gem Crucible', icon: '💎', color: 'bg-yellow-600' },
    'Monster Zone': { name: 'Monster Zone', icon: '◻️', color: 'bg-gray-600' },
    'Resource Node': { name: 'Resource Node', icon: '⛏️', color: 'bg-orange-600' },
    'Boss Arena': { name: 'Boss Arena', icon: '👑', color: 'bg-red-800' }
  };
  return featureMap[featureType] || { name: featureType, icon: '❓', color: 'bg-gray-500' };
};

export const HexMap: React.FC<HexMapProps> = ({ 
  currentZone, 
  playerPosition, 
  onPlayerMove, 
  onHexClick 
}) => {
  const hexSize = 30;
  const gridSize = currentZone.gridSize;
  
  // Generate hex grid
  const hexes = [];
  for (let q = -gridSize; q <= gridSize; q++) {
    for (let r = -gridSize; r <= gridSize; r++) {
      const s = -q - r;
      if (s >= -gridSize && s <= gridSize) {
        hexes.push({ q, r, s });
      }
    }
  }

  // Find feature for each hex
  const getHexFeature = (q: number, r: number) => {
    return currentZone.features.find(f => f.q === q && f.r === r);
  };

  // Calculate viewport size
  const viewportWidth = (gridSize * 2 + 1) * hexSize * 1.5;
  const viewportHeight = (gridSize * 2 + 1) * hexSize * Math.sqrt(3);

  return (
    <div className="hex-map-container bg-gray-900 rounded-lg p-4 border border-orange-500/30">
      <div className="text-center mb-4">
        <h3 className="text-lg font-orbitron text-orange-400">
          {currentZone.name} ({currentZone.gridSize}x{currentZone.gridSize})
        </h3>
      </div>
      
      {/* Navigation Controls */}
      <div className="mb-4 flex justify-center">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button 
            onClick={() => onPlayerMove(0, -1)}
            className="glass-button px-3 py-2 text-sm"
          >
            ↑ North
          </button>
          <div></div>
          
          <button 
            onClick={() => onPlayerMove(-1, 0)}
            className="glass-button px-3 py-2 text-sm"
          >
            ← West
          </button>
          <div className="text-center text-orange-400 font-bold">
            Player
          </div>
          <button 
            onClick={() => onPlayerMove(1, 0)}
            className="glass-button px-3 py-2 text-sm"
          >
            East →
          </button>
          
          <div></div>
          <button 
            onClick={() => onPlayerMove(0, 1)}
            className="glass-button px-3 py-2 text-sm"
          >
            ↓ South
          </button>
          <div></div>
        </div>
      </div>

      {/* SVG Hex Grid */}
      <div className="flex justify-center">
        <svg 
          width={viewportWidth} 
          height={viewportHeight}
          className="border border-orange-500/20 bg-black/30 rounded"
          viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
        >
          {hexes.map(({ q, r }) => {
            const { x, y } = hexToPixel(q, r, hexSize);
            const centerX = viewportWidth / 2 + x;
            const centerY = viewportHeight / 2 + y;
            
            const feature = getHexFeature(q, r);
            const featureDisplay = feature ? getFeatureDisplay(feature.type) : getFeatureDisplay('Monster Zone');
            
            const isPlayer = q === playerPosition.q && r === playerPosition.r;
            
            // Hexagon path
            const hexPath = [];
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const hx = centerX + hexSize * 0.8 * Math.cos(angle);
              const hy = centerY + hexSize * 0.8 * Math.sin(angle);
              if (i === 0) hexPath.push(`M ${hx} ${hy}`);
              else hexPath.push(`L ${hx} ${hy}`);
            }
            hexPath.push('Z');
            
            return (
              <g key={`${q}-${r}`}>
                {/* Hex background */}
                <path
                  d={hexPath.join(' ')}
                  fill={isPlayer ? '#f97316' : feature ? '#374151' : '#1f2937'}
                  stroke={isPlayer ? '#ea580c' : '#6b7280'}
                  strokeWidth="1"
                  className="cursor-pointer hover:fill-orange-600/50"
                  onClick={() => onHexClick(q, r)}
                />
                
                {/* Feature icon */}
                <text
                  x={centerX}
                  y={centerY + 5}
                  textAnchor="middle"
                  fontSize="16"
                  fill="white"
                  className="pointer-events-none select-none"
                >
                  {isPlayer ? '👤' : featureDisplay.icon}
                </text>
                
                {/* Coordinates (debug) */}
                <text
                  x={centerX}
                  y={centerY - 15}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#666"
                  className="pointer-events-none select-none"
                >
                  {q},{r}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Current Location Info */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Position: ({playerPosition.q}, {playerPosition.r})
        </div>
        {(() => {
          const currentFeature = getHexFeature(playerPosition.q, playerPosition.r);
          if (currentFeature) {
            const display = getFeatureDisplay(currentFeature.type);
            return (
              <div className="text-orange-400 font-semibold">
                {display.icon} {display.name}
              </div>
            );
          }
          return <div className="text-gray-400">Monster Zone</div>;
        })()}
      </div>
    </div>
  );
};