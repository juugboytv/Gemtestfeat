import React, { useState, useEffect } from 'react';

interface HexFeature {
  q: number;
  r: number;
  type: string;
  name: string;
  icon: string;
}

interface Zone {
  id: number;
  name: string;
  gridSize: number;
  features: HexFeature[];
  hexColor: string;
}

interface ZoneHexMapProps {
  currentZone: Zone;
  playerPosition: { q: number; r: number };
  onMove: (deltaQ: number, deltaR: number) => void;
  onInteract: () => void;
}

const BUILDING_ICONS = {
  'Sanctuary': '🆘',
  'Armory': '⚔️', 
  'Arcanum': '🔮',
  'AetheriumConduit': '🏧',  // Bank/ATM
  'Teleporter': '🌀',
  'GemCrucible': '💎',       // Gem/Diamond
  'MonsterZone': '👹'
};

const ZoneHexMap: React.FC<ZoneHexMapProps> = ({ 
  currentZone, 
  playerPosition, 
  onMove, 
  onInteract 
}) => {
  const [hexSize, setHexSize] = useState(25);
  
  useEffect(() => {
    // Adjust hex size based on grid size for optimal fit
    const baseSize = Math.max(15, Math.min(35, 400 / currentZone.gridSize));
    setHexSize(baseSize);
  }, [currentZone.gridSize]);

  // Convert hex coordinates to pixel coordinates
  const hexToPixel = (q: number, r: number) => {
    const x = hexSize * (3/2 * q);
    const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
  };

  // Generate all hexes in the grid
  const generateHexGrid = () => {
    const hexes = [];
    const radius = Math.floor(currentZone.gridSize / 2);
    
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const s = -q - r;
        if (Math.abs(s) <= radius) {
          // Find if this hex has a feature
          const feature = currentZone.features.find(f => f.q === q && f.r === r);
          const hexType = feature ? feature.type : 'MonsterZone';
          const icon = BUILDING_ICONS[hexType as keyof typeof BUILDING_ICONS] || '👹';
          
          hexes.push({
            q, r, s,
            type: hexType,
            icon: icon,
            isPlayer: q === playerPosition.q && r === playerPosition.r
          });
        }
      }
    }
    return hexes;
  };

  const hexes = generateHexGrid();
  const centerX = 250;
  const centerY = 200;

  return (
    <div className="zone-hex-map w-full h-96 relative overflow-hidden bg-black rounded-lg border border-orange-500/30">
      <svg
        width="500"
        height="400"
        viewBox="0 0 500 400"
        className="w-full h-full"
      >
        {/* Zone background */}
        <defs>
          <radialGradient id="zoneGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={`${currentZone.hexColor}20`} />
            <stop offset="100%" stopColor="#00000040" />
          </radialGradient>
        </defs>
        <rect width="500" height="400" fill="url(#zoneGradient)" />
        
        {/* Render hexes */}
        {hexes.map((hex) => {
          const { x, y } = hexToPixel(hex.q - playerPosition.q, hex.r - playerPosition.r);
          const pixelX = centerX + x;
          const pixelY = centerY + y;
          
          // Create hex path
          const hexPath = [];
          for (let i = 0; i < 6; i++) {
            const angle = 2 * Math.PI / 6 * (i + 0.5);
            const hx = pixelX + hexSize * 0.8 * Math.cos(angle);
            const hy = pixelY + hexSize * 0.8 * Math.sin(angle);
            if (i === 0) hexPath.push(`M ${hx} ${hy}`);
            else hexPath.push(`L ${hx} ${hy}`);
          }
          hexPath.push('Z');
          
          return (
            <g key={`${hex.q},${hex.r}`}>
              {/* Hex background */}
              <path
                d={hexPath.join(' ')}
                fill={hex.isPlayer ? '#f97316' : currentZone.hexColor || '#334155'}
                stroke={hex.isPlayer ? '#ea580c' : '#f97316'}
                strokeWidth={hex.isPlayer ? 3 : 1}
                opacity={hex.isPlayer ? 0.9 : 0.6}
                className="transition-all duration-200 hover:opacity-80"
              />
              
              {/* Feature icon */}
              <text
                x={pixelX}
                y={pixelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={hexSize * (hex.isPlayer ? 1.2 : 0.8)}
                className="pointer-events-none select-none"
              >
                {hex.isPlayer ? '🟠' : hex.icon}
              </text>
            </g>
          );
        })}
        
        {/* Zone info overlay */}
        <text
          x="10"
          y="25"
          fill="#f97316"
          fontSize="14"
          fontWeight="bold"
          className="font-orbitron"
        >
          {currentZone.name}
        </text>
        <text
          x="10"
          y="45"
          fill="#a0a0a0"
          fontSize="11"
        >
          Grid: {currentZone.gridSize}x{currentZone.gridSize} | Buildings: {currentZone.features.length}
        </text>
      </svg>
      
      {/* Navigation controls */}
      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-1">
        <div></div>
        <button
          onClick={() => onMove(0, -1)}
          className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 rounded text-white text-xs transition-colors"
          title="North"
        >
          ↑
        </button>
        <div></div>
        
        <button
          onClick={() => onMove(-1, 0)}
          className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 rounded text-white text-xs transition-colors"
          title="West"
        >
          ←
        </button>
        <button
          onClick={onInteract}
          className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded text-white text-xs transition-colors font-bold"
          title="Interact"
        >
          ⚡
        </button>
        <button
          onClick={() => onMove(1, 0)}
          className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 rounded text-white text-xs transition-colors"
          title="East"
        >
          →
        </button>
        
        <div></div>
        <button
          onClick={() => onMove(0, 1)}
          className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/50 rounded text-white text-xs transition-colors"
          title="South"
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default ZoneHexMap;