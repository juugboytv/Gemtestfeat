/**
 * Server-side Game Logic
 * This handles all game state management, combat, and zone systems
 */

import { ZONE_BLUEPRINTS } from '../shared/zoneBlueprints.js';
import { COMPLETE_ZONE_DATA, getCompleteZoneData } from '../shared/completeZoneData.js';
import { db } from './storage.js';
import { zones, monsters } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

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

  // Initialize all zones from complete zone data
  private initializeZones(): Record<string, ZoneState> {
    const zoneStates: Record<string, ZoneState> = {};
    
    COMPLETE_ZONE_DATA.forEach(zoneData => {
      zoneStates[zoneData.zoneId.toString()] = {
        id: zoneData.zoneId,
        name: zoneData.name,
        gridSize: zoneData.gridSize,
        features: zoneData.features.map(f => ({
          q: f.q,
          r: f.r,
          type: f.type,
          name: f.name
        })),
        currentMonsters: zoneData.monsters.map(m => ({
          id: m.monsterId,
          hp: m.health,
          maxHp: m.health,
          name: m.name
        }))
      };
    });

    return zoneStates;
  }

  // Get zone data from database
  async getZoneFromDatabase(zoneId: number) {
    try {
      const zone = await db.select().from(zones).where(eq(zones.zoneId, zoneId));
      const zoneMonsters = await db.select().from(monsters).where(eq(monsters.zoneId, zoneId));
      
      if (zone.length > 0) {
        return {
          zone: zone[0],
          monsters: zoneMonsters
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching zone from database:', error);
      return null;
    }
  }

  // Get player's current game state
  getGameState(playerId: string): GameState | null {
    return this.gameStates.get(playerId) || null;
  }

  // Handle zone teleportation (prioritize database data)
  async teleportToZone(playerId: string, zoneId: number): Promise<{ success: boolean; message: string; zoneData?: ZoneState }> {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) {
      return { success: false, message: "Player not found" };
    }

    // Get fresh zone data from database
    const dbZoneData = await this.getZoneFromDatabase(zoneId);
    if (!dbZoneData) {
      return { success: false, message: "Zone not found in database" };
    }

    // Convert database zone data to ZoneState format with all 6 buildings
    const targetZone: ZoneState = {
      id: dbZoneData.zone.zoneId,
      name: dbZoneData.zone.name,
      gridSize: dbZoneData.zone.gridSize,
      features: dbZoneData.zone.features as Array<{ q: number; r: number; type: string; name?: string }>,
      currentMonsters: dbZoneData.monsters.map(m => ({
        id: m.monsterId,
        hp: m.health,
        maxHp: m.health,
        name: m.name
      }))
    };

    // Update player's current zone and reset position
    gameState.player.currentZoneId = zoneId;
    gameState.player.position = { q: 0, r: 0 };
    
    // Update memory cache with fresh database data
    gameState.zones[zoneId.toString()] = targetZone;

    console.log(`Teleport: Zone ${zoneId} has ${targetZone.features.length} features:`, 
                targetZone.features.map(f => f.type).join(', '));

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

  // Get available zones from database
  async getAvailableZones(playerId: string): Promise<Array<{ id: number; name: string; levelReq: number; unlocked: boolean }>> {
    try {
      const allZones = await db.select().from(zones).orderBy(zones.zoneId);
      return allZones.map(zone => ({
        id: zone.zoneId,
        name: zone.name,
        levelReq: zone.levelRequirement,
        unlocked: true // All zones unlocked for testing
      }));
    } catch (error) {
      console.error('Error fetching zones from database:', error);
      return [];
    }
  }

  // Get current zone data (prioritize database over memory)
  async getCurrentZone(playerId: string): Promise<ZoneState | null> {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) return null;

    const currentZoneId = gameState.player.currentZoneId;
    
    // Try to get fresh data from database first
    const dbZoneData = await this.getZoneFromDatabase(currentZoneId);
    if (dbZoneData) {
      // Convert database zone data to ZoneState format
      const zoneState: ZoneState = {
        id: dbZoneData.zone.zoneId,
        name: dbZoneData.zone.name,
        gridSize: dbZoneData.zone.gridSize,
        features: dbZoneData.zone.features as Array<{ q: number; r: number; type: string; name?: string }>,
        currentMonsters: dbZoneData.monsters.map(m => ({
          id: m.monsterId,
          hp: m.health,
          maxHp: m.health,
          name: m.name
        }))
      };
      
      // Update memory cache
      gameState.zones[currentZoneId.toString()] = zoneState;
      return zoneState;
    }

    // Fallback to memory cache
    return gameState.zones[currentZoneId.toString()] || null;
  }
}

// Singleton instance
export const gameLogic = new GameLogicManager();