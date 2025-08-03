import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ZoneHexMap from '../components/ZoneHexMap';
import { apiRequest } from '../lib/queryClient';

interface Zone {
  id: number;
  name: string;
  gridSize: number;
  hexColor: string;
  features: Array<{
    q: number;
    r: number;
    type: string;
    name: string;
    icon: string;
  }>;
  buildingCount: number;
  missingBuildings: string[];
}

interface Player {
  id: string;
  level: number;
  health: number;
  maxHealth: number;
  experience: number;
  gold: number;
  currentZoneId: number;
  position: { q: number; r: number };
}

interface GameState {
  player: Player;
  currentZone: Zone;
}

const ZonePage: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ q: 0, r: 0 });
  const [currentZoneId, setCurrentZoneId] = useState(1);
  const queryClient = useQueryClient();

  // Fetch current zone data
  const { data: gameData, isLoading, error } = useQuery({
    queryKey: ['/api/game/current-zone', currentZoneId, playerPosition.q, playerPosition.r],
    queryFn: async () => {
      const response = await fetch(`/api/game/current-zone?zoneId=${currentZoneId}&q=${playerPosition.q}&r=${playerPosition.r}`);
      if (!response.ok) throw new Error('Failed to fetch zone data');
      const data = await response.json();
      return data.gameState as GameState;
    }
  });

  // Movement mutation
  const moveMutation = useMutation({
    mutationFn: async ({ dq, dr }: { dq: number; dr: number }) => {
      return apiRequest('POST', '/api/game/move', { dq, dr });
    },
    onSuccess: () => {
      // Invalidate and refetch zone data
      queryClient.invalidateQueries({ queryKey: ['/api/game/current-zone'] });
    }
  });

  // Zone teleport mutation
  const teleportMutation = useMutation({
    mutationFn: async (zoneId: number) => {
      return apiRequest('POST', '/api/game/teleport', { zoneId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/current-zone'] });
    }
  });

  // Update player position when movement is successful
  useEffect(() => {
    if (gameData?.player) {
      setPlayerPosition(gameData.player.position);
      setCurrentZoneId(gameData.player.currentZoneId);
    }
  }, [gameData]);

  const handleMove = (deltaQ: number, deltaR: number) => {
    if (moveMutation.isPending) return;
    
    const newPosition = {
      q: playerPosition.q + deltaQ,
      r: playerPosition.r + deltaR
    };
    
    // Update position immediately for responsiveness
    setPlayerPosition(newPosition);
    
    // Send movement to server
    moveMutation.mutate({ dq: deltaQ, dr: deltaR });
  };

  const handleInteract = () => {
    if (!gameData?.currentZone) return;
    
    // Find feature at current position
    const currentFeature = gameData.currentZone.features.find(
      f => f.q === playerPosition.q && f.r === playerPosition.r
    );
    
    if (currentFeature) {
      // Handle different building types
      switch (currentFeature.type) {
        case 'Sanctuary':
          alert('🆘 Sanctuary: Full heal! (Not implemented yet)');
          break;
        case 'Armory':
          alert('⚔️ Armory: Weapons & armor for sale! (Not implemented yet)');
          break;
        case 'Arcanum':
          alert('🔮 Arcanum: Magic items and spells! (Not implemented yet)');
          break;
        case 'AetheriumConduit':
          alert('💎 Aetherium Conduit: Bank services! (Not implemented yet)');
          break;
        case 'Teleporter':
          alert('🌀 Teleporter: Fast travel to other zones! (Not implemented yet)');
          break;
        case 'GemCrucible':
          alert('🏧 Gem Crucible: Socket gems into equipment! (Not implemented yet)');
          break;
        default:
          alert('👹 Monster Zone: Prepare for battle!');
      }
    } else {
      alert('👹 Monster Zone: No special buildings here, just monsters!');
    }
  };

  const handleZoneChange = (newZoneId: number) => {
    if (teleportMutation.isPending) return;
    
    setCurrentZoneId(newZoneId);
    setPlayerPosition({ q: 0, r: 0 }); // Reset position when changing zones
    
    teleportMutation.mutate(newZoneId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading zone data...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading zone data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-orbitron text-orange-500 mb-2">
            Geminus - Zone Explorer
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>Player Level: <span className="text-blue-400">{gameData.player.level}</span></span>
            <span>Health: <span className="text-red-400">{gameData.player.health}/{gameData.player.maxHealth}</span></span>
            <span>Gold: <span className="text-yellow-400">{gameData.player.gold.toLocaleString()}</span></span>
            <span>Position: <span className="text-green-400">({playerPosition.q}, {playerPosition.r})</span></span>
          </div>
        </div>

        {/* Zone Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quick Zone Switch:</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(zoneId => (
              <button
                key={zoneId}
                onClick={() => handleZoneChange(zoneId)}
                disabled={teleportMutation.isPending}
                className={`px-3 py-1 rounded text-xs border transition-colors ${
                  currentZoneId === zoneId 
                    ? 'bg-orange-500 border-orange-400' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                } ${teleportMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Zone {zoneId}
              </button>
            ))}
          </div>
        </div>

        {/* Main Zone Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone Map */}
          <div className="lg:col-span-2">
            <ZoneHexMap
              currentZone={gameData.currentZone}
              playerPosition={playerPosition}
              onMove={handleMove}
              onInteract={handleInteract}
            />
            
            {/* Movement status */}
            {moveMutation.isPending && (
              <div className="mt-2 text-center text-sm text-orange-400">
                Moving...
              </div>
            )}
          </div>

          {/* Zone Info Panel */}
          <div className="space-y-4">
            {/* Zone Details */}
            <div className="bg-gray-900 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Zone Information</h3>
              <div className="space-y-2 text-sm">
                <div>Name: <span className="text-white">{gameData.currentZone.name}</span></div>
                <div>Grid Size: <span className="text-white">{gameData.currentZone.gridSize}x{gameData.currentZone.gridSize}</span></div>
                <div>Buildings: <span className="text-green-400">{gameData.currentZone.buildingCount}/6</span></div>
                {gameData.currentZone.missingBuildings.length > 0 && (
                  <div className="text-red-400">
                    Missing: {gameData.currentZone.missingBuildings.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Building Legend */}
            <div className="bg-gray-900 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Building Legend</h3>
              <div className="space-y-2 text-sm">
                <div>🆘 Sanctuary - Healing</div>
                <div>⚔️ Armory - Weapons & Armor</div>
                <div>🔮 Arcanum - Magic & Spells</div>
                <div>💎 Aetherium Conduit - Banking</div>
                <div>🌀 Teleporter - Fast Travel</div>
                <div>🏧 Gem Crucible - Gem Socketing</div>
                <div>👹 Monster Zone - Combat</div>
                <div>🟠 You - Player Position</div>
              </div>
            </div>

            {/* Controls Help */}
            <div className="bg-gray-900 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Controls</h3>
              <div className="space-y-1 text-sm">
                <div>Use arrow buttons to move</div>
                <div>⚡ Interact with buildings</div>
                <div>Click zone buttons to teleport</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonePage;