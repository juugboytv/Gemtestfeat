import React, { useState, useEffect } from 'react';

interface ZoneDisplayProps {
  currentZoneId: number;
  onZoneChange: (newZoneId: number) => void;
}

interface ZoneFeature {
  q: number;
  r: number;
  type: string;
  name?: string;
}

interface ZoneData {
  id: number;
  name: string;
  gridSize: number;
  features: ZoneFeature[];
  buildingCount: number;
}

export const ZoneDisplay: React.FC<ZoneDisplayProps> = ({ currentZoneId, onZoneChange }) => {
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZoneData();
  }, [currentZoneId]);

  const fetchZoneData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/game/current-zone?zoneId=${currentZoneId}`);
      if (!response.ok) throw new Error('Failed to fetch zone data');
      
      const data = await response.json();
      if (data.success && data.gameState && data.gameState.currentZone) {
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
      'Sanctuary': 'bg-green-600/20 border-green-500/30',
      'Armory': 'bg-red-600/20 border-red-500/30',
      'Arcanum': 'bg-purple-600/20 border-purple-500/30',
      'AetheriumConduit': 'bg-blue-600/20 border-blue-500/30',
      'Teleporter': 'bg-cyan-600/20 border-cyan-500/30',
      'GemCrucible': 'bg-yellow-600/20 border-yellow-500/30',
      'Monster Zone': 'bg-gray-600/20 border-gray-500/30'
    };
    return colors[featureType] || 'bg-gray-500/20';
  };

  if (loading) {
    return (
      <div className="zone-display p-3 glass-panel rounded-lg border border-orange-500/30">
        <div className="text-center text-orange-400">Loading zone...</div>
      </div>
    );
  }

  if (!zoneData) {
    return (
      <div className="zone-display p-3 glass-panel rounded-lg border border-orange-500/30">
        <div className="text-center text-red-400">Failed to load zone</div>
      </div>
    );
  }

  return (
    <div className="zone-display p-3 glass-panel rounded-lg border border-orange-500/30">
      {/* Zone Header */}
      <div className="text-center mb-3">
        <h3 className="text-sm font-orbitron text-orange-400 mb-1">{zoneData.name}</h3>
        <div className="text-xs text-gray-400">
          Grid: {zoneData.gridSize}x{zoneData.gridSize} | Buildings: {zoneData.buildingCount}/6
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {zoneData.features
          .filter(f => f.type !== 'Monster Zone')
          .map((feature, index) => (
            <div 
              key={index}
              className={`p-2 rounded text-center ${getFeatureColor(feature.type)} border`}
            >
              <div className="text-lg mb-1">{getFeatureIcon(feature.type)}</div>
              <div className="text-xs font-semibold text-white">
                {feature.name || feature.type}
              </div>
              <div className="text-xs text-gray-400">
                ({feature.q}, {feature.r})
              </div>
            </div>
          ))
        }
      </div>

      {/* Zone Layout Preview */}
      <div className="bg-black/30 rounded p-2">
        <div className="text-xs text-gray-400 text-center mb-1">Zone Layout</div>
        <div className="grid grid-cols-4 gap-1">
          {zoneData.features.slice(0, 16).map((feature, index) => (
            <div 
              key={index}
              className={`aspect-square flex items-center justify-center text-xs rounded ${
                feature.type !== 'Monster Zone' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-600 bg-gray-500/10'
              }`}
              title={feature.name || feature.type}
            >
              {getFeatureIcon(feature.type)}
            </div>
          ))}
        </div>
      </div>

      {/* Zone Stats */}
      <div className="mt-3 pt-2 border-t border-orange-500/30 text-xs text-gray-400 text-center">
        Total Features: {zoneData.features.length} | 
        Monster Zones: {zoneData.features.filter(f => f.type === 'Monster Zone').length}
      </div>
    </div>
  );
};