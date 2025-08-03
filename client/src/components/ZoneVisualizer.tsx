import React, { useState, useEffect } from 'react';

interface ZoneVisualizerProps {
  currentZoneId: number;
  playerPosition: { q: number; r: number };
  onPositionChange: (q: number, r: number) => void;
}

interface ZoneFeature {
  q: number;
  r: number;
  type: string;
  name: string;
}

interface ZoneData {
  id: number;
  name: string;
  gridSize: number;
  features: ZoneFeature[];
  buildingCount: number;
}

export const ZoneVisualizer: React.FC<ZoneVisualizerProps> = ({
  currentZoneId,
  playerPosition,
  onPositionChange
}) => {
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZoneData();
  }, [currentZoneId]);

  const fetchZoneData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/game/current-zone?zoneId=${currentZoneId}&q=${playerPosition.q}&r=${playerPosition.r}`);
      if (!response.ok) throw new Error('Failed to fetch zone data');
      
      const data = await response.json();
      if (data.success) {
        setZoneData(data.gameState.currentZone);
      }
    } catch (error) {
      console.error('Error fetching zone data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureIcon = (featureType: string): string => {
    const icons: Record<string, string> = {
      'Sanctuary': '🆘',
      'Armory': '⚔️',
      'Arcanum': '🔮', 
      'AetheriumConduit': '🏧',
      'Teleporter': '🌀',
      'GemCrucible': '💎',
      'Monster Zone': '👹'
    };
    return icons[featureType] || '◻️';
  };

  const getFeatureColor = (featureType: string): string => {
    const colors: Record<string, string> = {
      'Sanctuary': 'bg-green-600',
      'Armory': 'bg-red-600',
      'Arcanum': 'bg-purple-600',
      'AetheriumConduit': 'bg-blue-600', 
      'Teleporter': 'bg-cyan-600',
      'GemCrucible': 'bg-yellow-600',
      'Monster Zone': 'bg-gray-600'
    };
    return colors[featureType] || 'bg-gray-500';
  };

  const handleMove = async (dq: number, dr: number) => {
    const newQ = playerPosition.q + dq;
    const newR = playerPosition.r + dr;
    
    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dq, dr })
      });
      
      if (response.ok) {
        onPositionChange(newQ, newR);
        fetchZoneData(); // Refresh zone data after movement
      }
    } catch (error) {
      console.error('Movement failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="zone-visualizer glass-panel p-4 rounded-lg">
        <div className="text-center text-orange-400">Loading zone...</div>
      </div>
    );
  }

  if (!zoneData) {
    return (
      <div className="zone-visualizer glass-panel p-4 rounded-lg">
        <div className="text-center text-red-400">Failed to load zone data</div>
      </div>
    );
  }

  return (
    <div className="zone-visualizer glass-panel p-4 rounded-lg border border-orange-500/30">
      {/* Zone Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-orbitron text-orange-400 mb-1">{zoneData.name}</h3>
        <div className="text-sm text-gray-400">
          Grid: {zoneData.gridSize}x{zoneData.gridSize} | Buildings: {zoneData.buildingCount}/6
        </div>
      </div>

      {/* Movement Controls */}
      <div className="mb-4 flex justify-center">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button 
            onClick={() => handleMove(0, -1)}
            className="glass-button px-3 py-2 text-sm hover:bg-orange-500/20"
          >
            ↑ North
          </button>
          <div></div>
          
          <button 
            onClick={() => handleMove(-1, 0)}
            className="glass-button px-3 py-2 text-sm hover:bg-orange-500/20"
          >
            ← West
          </button>
          <div className="text-center text-orange-400 font-bold py-2">
            👤 Player
          </div>
          <button 
            onClick={() => handleMove(1, 0)}
            className="glass-button px-3 py-2 text-sm hover:bg-orange-500/20"
          >
            East →
          </button>
          
          <div></div>
          <button 
            onClick={() => handleMove(0, 1)}
            className="glass-button px-3 py-2 text-sm hover:bg-orange-500/20"
          >
            ↓ South
          </button>
          <div></div>
        </div>
      </div>

      {/* Current Position Info */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-400">
          Position: ({playerPosition.q}, {playerPosition.r})
        </div>
        {(() => {
          const currentFeature = zoneData.features.find(f => 
            f.q === playerPosition.q && f.r === playerPosition.r
          );
          if (currentFeature) {
            return (
              <div className="text-orange-400 font-semibold">
                {getFeatureIcon(currentFeature.type)} {currentFeature.name}
              </div>
            );
          }
          return <div className="text-gray-400">Monster Zone</div>;
        })()}
      </div>

      {/* Buildings List */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {zoneData.features
          .filter(f => f.type !== 'Monster Zone')
          .map((feature, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${getFeatureColor(feature.type)} bg-opacity-20 border border-current border-opacity-30`}
            >
              <div className="font-semibold">
                {getFeatureIcon(feature.type)} {feature.name}
              </div>
              <div className="text-gray-400">
                ({feature.q}, {feature.r})
              </div>
            </div>
          ))
        }
      </div>

      {/* Zone Stats */}
      <div className="mt-4 pt-3 border-t border-orange-500/30">
        <div className="text-xs text-gray-400 text-center">
          Total Features: {zoneData.features.length} | 
          Monster Zones: {zoneData.features.filter(f => f.type === 'Monster Zone').length}
        </div>
      </div>
    </div>
  );
};