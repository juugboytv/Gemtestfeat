import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HexMap } from './HexMap';
import { useToast } from '@/hooks/use-toast';

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

interface Zone {
  id: number;
  name: string;
  gridSize: number;
  features: Array<{
    q: number;
    r: number;
    type: string;
    name?: string;
  }>;
  currentMonsters?: Array<{
    id: string;
    hp: number;
    maxHp: number;
    name: string;
  }>;
}

interface GameState {
  player: Player;
  currentZone: Zone;
}

export const GameMap: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current game state
  const { data: gameState, isLoading, error } = useQuery<{ success: boolean; gameState: GameState }>({
    queryKey: ['/api/game/current-zone'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Player movement mutation
  const moveMutation = useMutation({
    mutationFn: async ({ dq, dr }: { dq: number; dr: number }) => {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dq, dr }),
      });
      if (!response.ok) throw new Error('Movement failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game/current-zone'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Movement Failed",
        description: error.message,
      });
    },
  });

  // Handle player movement
  const handlePlayerMove = (dq: number, dr: number) => {
    if (!gameState?.gameState?.currentZone) return;
    
    const newQ = gameState.gameState.player.position.q + dq;
    const newR = gameState.gameState.player.position.r + dr;
    
    // Check if the destination hex exists in the current zone
    const hexExists = gameState.gameState.currentZone.features.some(f => 
      f.q === newQ && f.r === newR
    ) || isValidHex(newQ, newR, gameState.gameState.currentZone.gridSize);
    
    if (hexExists) {
      moveMutation.mutate({ dq, dr });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot Move",
        description: "You cannot move in that direction.",
      });
    }
  };

  // Check if hex coordinates are valid for the grid
  const isValidHex = (q: number, r: number, gridSize: number) => {
    const s = -q - r;
    return Math.abs(q) <= gridSize && Math.abs(r) <= gridSize && Math.abs(s) <= gridSize;
  };

  // Handle hex click/interaction
  const handleHexClick = (q: number, r: number) => {
    if (!gameState?.gameState) return;
    
    const { player, currentZone } = gameState.gameState;
    
    // If clicking on player's current position, trigger interaction
    if (q === player.position.q && r === player.position.r) {
      const currentFeature = currentZone.features.find(f => f.q === q && f.r === r);
      if (currentFeature) {
        handleInteraction(currentFeature.type);
      }
    } else {
      // Calculate movement needed
      const dq = q - player.position.q;
      const dr = r - player.position.r;
      
      // Only allow adjacent movement (distance 1)
      if (Math.abs(dq) <= 1 && Math.abs(dr) <= 1 && Math.abs(-dq - dr) <= 1) {
        handlePlayerMove(dq, dr);
      } else {
        toast({
          variant: "destructive",
          title: "Too Far",
          description: "You can only move to adjacent hexes.",
        });
      }
    }
  };

  // Handle feature interactions
  const handleInteraction = (featureType: string) => {
    switch (featureType) {
      case 'Sanctuary':
        toast({
          title: "Sanctuary",
          description: "You have been healed to full health!",
        });
        break;
      case 'Armory':
        toast({
          title: "Weapons Shop",
          description: "Opening armory shop...",
        });
        break;
      case 'Arcanum':
        toast({
          title: "Magic Shop",
          description: "Opening magic shop...",
        });
        break;
      case 'AetheriumConduit':
        toast({
          title: "Bank",
          description: "Opening bank interface...",
        });
        break;
      case 'Teleporter':
        toast({
          title: "Teleporter",
          description: "Opening teleportation menu...",
        });
        break;
      case 'GemCrucible':
        toast({
          title: "Gem Crucible",
          description: "Opening gem crafting interface...",
        });
        break;
      case 'Monster Zone':
        toast({
          title: "Monster Zone",
          description: "Entering combat...",
        });
        break;
      default:
        toast({
          title: "Unknown Location",
          description: "Nothing to interact with here.",
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-orange-400">Loading game map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading game map</div>
      </div>
    );
  }

  if (!gameState?.gameState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">No game state available</div>
      </div>
    );
  }

  const { player, currentZone } = gameState.gameState;

  return (
    <div className="game-map p-4">
      <HexMap
        currentZone={currentZone}
        playerPosition={player.position}
        onPlayerMove={handlePlayerMove}
        onHexClick={handleHexClick}
      />
      
      {/* Player Status */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-800 p-2 rounded border border-orange-500/30">
          <div className="text-orange-400">Health</div>
          <div className="text-white">{player.health}/{player.maxHealth}</div>
        </div>
        <div className="bg-gray-800 p-2 rounded border border-orange-500/30">
          <div className="text-orange-400">Level</div>
          <div className="text-white">{player.level}</div>
        </div>
        <div className="bg-gray-800 p-2 rounded border border-orange-500/30">
          <div className="text-orange-400">Gold</div>
          <div className="text-white">{player.gold}</div>
        </div>
        <div className="bg-gray-800 p-2 rounded border border-orange-500/30">
          <div className="text-orange-400">Zone</div>
          <div className="text-white">{currentZone.name}</div>
        </div>
      </div>
    </div>
  );
};