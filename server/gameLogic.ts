/**
 * Server-side Game Logic
 * This handles all game state management, combat, and zone systems
 */

import { ZONE_BLUEPRINTS } from '../shared/zoneBlueprints.js';

export interface GameState {
  player: {
    id: string;
    level: number;
    health: number;
    maxHealth: number;
    experience: number;
    gold: number;
    currentZoneId: number;
    position: { q: number; r: number };
  };
  zones: Record<string, ZoneState>;
}

export interface ZoneState {
  id: number;
  name: string;
  gridSize: number;
  features: Array<{ q: number; r: number; type: string; name?: string }>;
  currentMonsters: Array<{ id: string; hp: number; maxHp: number; name: string }>;
}

export class GameLogicManager {
  private gameStates: Map<string, GameState> = new Map();

  // Initialize a new player game state
  initializePlayer(playerId: string): GameState {
    const gameState: GameState = {
      player: {
        id: playerId,
        level: 1,
        health: 200,
        maxHealth: 200,
        experience: 0,
        gold: 0,
        currentZoneId: 1,
        position: { q: 0, r: 0 }
      },
      zones: this.initializeZones()
    };

    this.gameStates.set(playerId, gameState);
    return gameState;
  }

  // Initialize all zones from blueprints
  private initializeZones(): Record<string, ZoneState> {
    const zones: Record<string, ZoneState> = {};
    
    Object.entries(ZONE_BLUEPRINTS).forEach(([zoneId, blueprint]) => {
      zones[zoneId] = {
        id: parseInt(zoneId),
        name: blueprint.name,
        gridSize: blueprint.gridSize,
        features: blueprint.features.map(f => ({
          q: f.q,
          r: f.r,
          type: f.type,
          name: f.name
        })),
        currentMonsters: []
      };
    });

    return zones;
  }

  // Get player's current game state
  getGameState(playerId: string): GameState | null {
    return this.gameStates.get(playerId) || null;
  }

  // Handle zone teleportation
  teleportToZone(playerId: string, zoneId: number): { success: boolean; message: string; zoneData?: ZoneState } {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) {
      return { success: false, message: "Player not found" };
    }

    const targetZone = gameState.zones[zoneId.toString()];
    if (!targetZone) {
      return { success: false, message: "Zone not found" };
    }

    // Update player's current zone and reset position
    gameState.player.currentZoneId = zoneId;
    gameState.player.position = { q: 0, r: 0 };

    return {
      success: true,
      message: `Teleported to ${targetZone.name} (${targetZone.gridSize}x${targetZone.gridSize})`,
      zoneData: targetZone
    };
  }

  // Handle player movement within a zone
  movePlayer(playerId: string, deltaQ: number, deltaR: number): { success: boolean; message: string; newPosition?: { q: number; r: number } } {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) {
      return { success: false, message: "Player not found" };
    }

    const currentZone = gameState.zones[gameState.player.currentZoneId.toString()];
    const newQ = gameState.player.position.q + deltaQ;
    const newR = gameState.player.position.r + deltaR;

    // Check if new position is within zone bounds
    const gridSize = currentZone.gridSize;
    const s = -newQ - newR;
    
    if (Math.abs(newQ) <= gridSize && Math.abs(newR) <= gridSize && Math.abs(s) <= gridSize) {
      gameState.player.position = { q: newQ, r: newR };
      return {
        success: true,
        message: "Movement successful",
        newPosition: { q: newQ, r: newR }
      };
    }

    return { success: false, message: "Cannot move outside zone boundaries" };
  }

  // Get available zones for teleportation
  getAvailableZones(playerId: string): Array<{ id: number; name: string; levelReq: number; unlocked: boolean }> {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) return [];

    return Object.entries(gameState.zones).map(([zoneId, zone]) => ({
      id: zone.id,
      name: zone.name,
      levelReq: 1, // All zones are level 1 for now
      unlocked: true // All zones unlocked for testing
    }));
  }

  // Get current zone data
  getCurrentZone(playerId: string): ZoneState | null {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) return null;

    return gameState.zones[gameState.player.currentZoneId.toString()] || null;
  }
}

// Singleton instance
export const gameLogic = new GameLogicManager();