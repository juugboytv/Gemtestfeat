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

  // Initialize all zones from blueprints and generate missing ones
  private initializeZones(): Record<string, ZoneState> {
    const zones: Record<string, ZoneState> = {};
    
    // Load zones from blueprints first
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

    // Generate missing zones dynamically for complete 101 zone system
    const standardFeatures = [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "Bank", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Armory", q: -1, r: 1 },
      { type: "AetheriumConduit", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Monster Zone", q: 2, r: -2 },
      { type: "Monster Zone", q: -2, r: 2 },
      { type: "Boss Arena", q: 2, r: 0, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ];

    // Ensure all 101 zones exist
    for (let i = 1; i <= 101; i++) {
      const zoneId = i.toString();
      if (!zones[zoneId]) {
        // Determine grid size based on level requirements
        let gridSize = 4;
        if (i >= 25 && i <= 33) gridSize = 5; // Level 100 zones
        else if (i >= 34 && i <= 50) gridSize = 6; // Level 253 zones
        else if (i >= 51 && i <= 58) gridSize = 7; // Level 1000 zones
        else if (i >= 59 && i <= 66) gridSize = 8; // Level 6143 zones
        else if (i >= 67 && i <= 73) gridSize = 9; // Level 13636 zones
        else if (i >= 74 && i <= 78) gridSize = 10; // Level 35452 zones
        else if (i >= 79 && i <= 81) gridSize = 11; // Level 83333 zones
        else if (i >= 82 && i <= 100) gridSize = 11; // Level 172222 zones
        else if (i === 101) gridSize = 12; // Level 400000 zone

        zones[zoneId] = {
          id: i,
          name: `Zone ${i}`,
          gridSize,
          features: standardFeatures,
          currentMonsters: []
        };
      }
    }

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
  getAvailableZones(playerId: string): Array<{ id: string; name: string; levelReq: number; unlocked: boolean }> {
    const gameState = this.gameStates.get(playerId);
    if (!gameState) return [];

    // Generate all 101 zones with proper level requirements
    const allZones = [];
    
    // Starter zones 1-24 (Level 1)
    for (let i = 1; i <= 24; i++) {
      const raceNames = [
        "Crystal Caves (Dwarf)", "Elvenwood (Elf)", "Shifting Maze (Halfling)", "Arid Badlands (Human)",
        "Glimmering Springs (Gnome)", "Blazefire Wastes (Tiefling)", "Abyssal Fen (Swampfolk)", 
        "Moss-Covered Forest (Human/Fey)", "Cinder Barrens (Orc)", "Echo Mountain (Dwarf/Giant)",
        "Labyrinth (Minotaur)", "Steppe (Centaur)", "Cloud Peak (Griffin/Angel)", "Emberfall Cliffs (Phoenix)",
        "Tidal Pools (Merfolk)", "Shadowmere (Dark Elf)", "Ironhold (Dwarf Clan)", "Moongrove (Night Elf)",
        "Thornwood (Wild Elf)", "Mistral Heights (Air Genasi)", "Crimson Peaks (Fire Genasi)", 
        "Frostholm (Frost Giant)", "Verdant Vale (Earth Genasi)", "Starlight Sanctuary (Celestial)"
      ];
      allZones.push({
        id: i.toString(),
        name: raceNames[i-1] || `Starter Zone ${i}`,
        levelReq: 1,
        unlocked: true
      });
    }

    // Advanced zones 25-101 with proper level requirements
    const zoneData = [
      // Level 100 zones (25-33)
      { name: "Echoing Chasms", level: 100 },
      { name: "Starfall Deserts", level: 100 },
      { name: "The Weeping Mire", level: 100 },
      { name: "Frozen Spirelands", level: 100 },
      { name: "Living Mountain", level: 100 },
      { name: "Chrono-Distorted Fields", level: 100 },
      { name: "Whisperwind Peaks", level: 100 },
      { name: "Corrupted Jungles", level: 100 },
      { name: "Acidic Fens", level: 100 },
      
      // Level 253 zones (34-50)
      { name: "Bone Deserts", level: 253 },
      { name: "The Maw", level: 253 },
      { name: "Poisonbloom Meadows", level: 253 },
      { name: "Storm-Wrenched Coast", level: 253 },
      { name: "The Rusting Wastes", level: 253 },
      { name: "Webbed Caverns", level: 253 },
      { name: "The Scarred Peaks", level: 253 },
      { name: "Fungal Undergrowth", level: 253 },
      { name: "Obsidian Flats", level: 253 },
      { name: "Quicksand Dunes", level: 253 },
      { name: "Floating Islands", level: 253 },
      { name: "Glass Sea", level: 253 },
      { name: "Upside-Down Forest", level: 253 },
      { name: "Singing Sands", level: 253 },
      { name: "Aurora Borealis Caverns", level: 253 },
      { name: "Gloom-Shrouded Peaks", level: 253 },
      { name: "Sunken Spire City", level: 253 },
      
      // Level 1000 zones (51-58)
      { name: "Giant Mushroom Forests", level: 1000 },
      { name: "Living Stone Gardens", level: 1000 },
      { name: "The Whispering Wastes", level: 1000 },
      { name: "Mirage Deserts", level: 1000 },
      { name: "Gravity Wells", level: 1000 },
      { name: "Chromatic Reefs", level: 1000 },
      { name: "The Endless Bridge", level: 1000 },
      { name: "Sky-Whale Graveyard", level: 1000 },
      
      // Level 6143 zones (59-66)
      { name: "The Weaving Caves", level: 6143 },
      { name: "Echoing Valley of the Giants", level: 6143 },
      { name: "The Glimmering Shore", level: 6143 },
      { name: "The Whispering Canyon", level: 6143 },
      { name: "Floating River", level: 6143 },
      { name: "The Cloud Sea", level: 6143 },
      { name: "Obsidian Monolith Plains", level: 6143 },
      { name: "The Bloodfang Jungle", level: 6143 },
      
      // Level 13636 zones (67-73)
      { name: "Sunstone Deserts", level: 13636 },
      { name: "The Whispering Gardens", level: 13636 },
      { name: "Glass Peaks", level: 13636 },
      { name: "Phantom Forests", level: 13636 },
      { name: "Elemental Crossroads", level: 13636 },
      { name: "The Shimmering Void", level: 13636 },
      { name: "Crimson Wastelands", level: 13636 },
      
      // Level 35452 zones (74-78)
      { name: "Temporal Anomaly Fields", level: 35452 },
      { name: "The Fractured Realms", level: 35452 },
      { name: "Gravity-Defying Rapids", level: 35452 },
      { name: "Crystal Mind Caves", level: 35452 },
      { name: "The Howling Expanse", level: 35452 },
      
      // Level 83333 zones (79-81)
      { name: "Nexus of Shadows", level: 83333 },
      { name: "The Glittering Grottos", level: 83333 },
      { name: "Abyssal Throne Room", level: 83333 },
      
      // Level 172222 zones (82-100)
      { name: "The Infinite Library", level: 172222 },
      { name: "Gelatinous Jungles", level: 172222 },
      { name: "The Screaming Peaks", level: 172222 },
      { name: "Molten Core Chambers", level: 172222 },
      { name: "The Weeping Void", level: 172222 },
      { name: "Crystalline Maze", level: 172222 },
      { name: "The Forgotten Realm", level: 172222 },
      { name: "Nightmare Landscapes", level: 172222 },
      { name: "The Eternal Storm", level: 172222 },
      { name: "Shattered Reality", level: 172222 },
      { name: "The Consuming Dark", level: 172222 },
      { name: "Prismatic Dimensions", level: 172222 },
      { name: "The Howling Abyss", level: 172222 },
      { name: "Spectral Battlegrounds", level: 172222 },
      { name: "The Twisted Sanctum", level: 172222 },
      { name: "Elemental Chaos", level: 172222 },
      { name: "The Final Threshold", level: 172222 },
      { name: "Apocalyptic Wasteland", level: 172222 },
      { name: "The Last Haven", level: 172222 },
      
      // Level 400000 zone (101)
      { name: "The Echoing Gorge of Lost Souls", level: 400000 }
    ];

    // Add advanced zones
    zoneData.forEach((zone, index) => {
      allZones.push({
        id: (25 + index).toString(),
        name: zone.name,
        levelReq: zone.level,
        unlocked: gameState.player.level >= zone.level
      });
    });

    return allZones;
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