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

  // Simple seeded random number generator for consistent zone layouts
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate unique hexagonal coordinates for a feature type within grid bounds using seeded randomness
  private generateUniqueCoordinates(gridSize: number, usedCoordinates: Set<string>, seed: number, attempts: number = 50): { q: number; r: number } {
    // First collect all valid hexagonal coordinates within bounds
    const validCoords: Array<{ q: number; r: number }> = [];
    for (let q = -gridSize; q <= gridSize; q++) {
      for (let r = -gridSize; r <= gridSize; r++) {
        const s = -q - r;
        // Proper hexagonal bounds check: all three coordinates must be within gridSize
        if (Math.abs(q) <= gridSize && Math.abs(r) <= gridSize && Math.abs(s) <= gridSize) {
          validCoords.push({ q, r });
        }
      }
    }
    
    // Try seeded random selection from valid coordinates
    for (let attempt = 0; attempt < attempts; attempt++) {
      const randomIndex = Math.floor(this.seededRandom(seed + attempt * 13) * validCoords.length);
      const { q, r } = validCoords[randomIndex];
      const coordKey = `${q},${r}`;
      
      if (!usedCoordinates.has(coordKey)) {
        usedCoordinates.add(coordKey);
        return { q, r };
      }
    }
    
    // Final fallback - find first available coordinate
    for (const { q, r } of validCoords) {
      const coordKey = `${q},${r}`;
      if (!usedCoordinates.has(coordKey)) {
        usedCoordinates.add(coordKey);
        return { q, r };
      }
    }
    
    // Absolute fallback
    return { q: 0, r: 0 };
  }

  // Generate structured layout for each zone with consistent patterns
  private generateUniqueZoneLayout(zoneId: number): { gridSize: number; features: Array<{ q: number; r: number; type: string; name?: string }> } {
    // Determine grid size and color based on 5-zone repeating pattern
    let gridSize: number;
    let zoneColor: string;
    
    const patternIndex = ((zoneId - 1) % 5) + 1; // Gets 1-5 pattern that repeats
    
    switch (patternIndex) {
      case 1: // Red zones (1, 6, 11, 16... etc)
        gridSize = 4;
        zoneColor = 'red';
        break;
      case 2: // Blue zones (2, 7, 12, 17... etc)
        gridSize = 5;
        zoneColor = 'blue';
        break;
      case 3: // Green zones (3, 8, 13, 18... etc)
        gridSize = 6;
        zoneColor = 'green';
        break;
      case 4: // Yellow zones (4, 9, 14, 19... etc)
        gridSize = 7;
        zoneColor = 'yellow';
        break;
      case 5: // Purple zones (5, 10, 15, 20... etc)
        gridSize = 8;
        zoneColor = 'purple';
        break;
      default:
        gridSize = 4;
        zoneColor = 'red';
    }
    
    // Fixed feature positions that scale with grid size for consistent layouts
    const features: Array<{ q: number; r: number; type: string; name?: string }> = [];
    
    // Core feature types with consistent positions across ALL zones
    // 5 essential features that provide the core gameplay experience
    const coreFeatures = [
      { type: 'Armory', position: { q: Math.min(2, gridSize - 1), r: 0 } }, // East - Weapon/Armor Shop
      { type: 'Arcanum', position: { q: -Math.min(2, gridSize - 1), r: 0 } }, // West - Spell Shop  
      { type: 'Revive Station', position: { q: 0, r: Math.min(2, gridSize - 1) } }, // South - SOS/Revival
      { type: 'Teleporter', position: { q: -Math.min(1, gridSize - 2), r: Math.min(1, gridSize - 2) } }, // Southwest - Zone Travel
      { type: 'Bank', position: { q: 0, r: -Math.min(2, gridSize - 1) } } // North - ATM/Banking
    ];

    // Add all core features to the zone with proper bounds checking
    for (const feature of coreFeatures) {
      // Ensure coordinates are within hexagonal bounds
      const q = Math.max(-gridSize, Math.min(gridSize, feature.position.q));
      const r = Math.max(-gridSize, Math.min(gridSize, feature.position.r));
      const s = -q - r;
      
      // Validate hexagonal bounds (all three coordinates must be within gridSize)
      if (Math.abs(q) <= gridSize && Math.abs(r) <= gridSize && Math.abs(s) <= gridSize) {
        features.push({
          q: q,
          r: r,
          type: feature.type
        });
      }
    }

    console.log(`Zone ${zoneId} (${zoneColor} ${gridSize}x${gridSize}) generated with ${features.length} features:`, features.map(f => f.type));
    return { gridSize, features };
  }

  // Initialize all zones from blueprints and generate missing ones
  private initializeZones(): Record<string, ZoneState> {
    const zones: Record<string, ZoneState> = {};
    
    // Load zones from blueprints first (these have hand-crafted layouts)
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

    // Generate unique layouts for ALL zones to ensure they have all 6 core features
    for (let i = 1; i <= 101; i++) {
      const zoneId = i.toString();
      const layout = this.generateUniqueZoneLayout(i);
      zones[zoneId] = {
        id: i,
        name: `Zone ${i}`, // This will be overridden by getAvailableZones with proper names
        gridSize: layout.gridSize,
        features: layout.features,
        currentMonsters: []
      };
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

    // Advanced zones 25-101 with correct level requirements from provided data
    const zoneData = [
      // Z25-Z34
      { name: "Echoing Chasms", level: 100 },
      { name: "Starfall Deserts", level: 110 },
      { name: "The Weeping Mire", level: 121 },
      { name: "Frozen Spirelands", level: 135 },
      { name: "Living Mountain", level: 149 },
      { name: "Chrono-Distorted Fields", level: 166 },
      { name: "Whisperwind Peaks", level: 184 },
      { name: "Corrupted Jungles", level: 205 },
      { name: "Acidic Fens", level: 227 },
      { name: "Bone Deserts", level: 253 },
      
      // Z35-Z44
      { name: "The Maw", level: 281 },
      { name: "Poisonbloom Meadows", level: 312 },
      { name: "Storm-Wrenched Coast", level: 347 },
      { name: "The Rusting Wastes", level: 386 },
      { name: "Webbed Caverns", level: 429 },
      { name: "The Scarred Peaks", level: 477 },
      { name: "Fungal Undergrowth", level: 530 },
      { name: "Obsidian Flats", level: 589 },
      { name: "Quicksand Dunes", level: 655 },
      { name: "Floating Islands", level: 728 },
      
      // Z45-Z51
      { name: "Glass Sea", level: 809 },
      { name: "Upside-Down Forest", level: 899 },
      { name: "Singing Sands", level: 1000 },
      { name: "Aurora Borealis Caverns", level: 1000 },
      { name: "Gloom-Shrouded Peaks", level: 1000 },
      { name: "Sunken Spire City", level: 1000 },
      { name: "Giant Mushroom Forests", level: 1000 },
      
      // Z52-Z58
      { name: "Living Stone Gardens", level: 1643 },
      { name: "The Whispering Wastes", level: 2286 },
      { name: "Mirage Deserts", level: 2929 },
      { name: "Gravity Wells", level: 3571 },
      { name: "Chromatic Reefs", level: 4214 },
      { name: "The Endless Bridge", level: 4857 },
      { name: "Sky-Whale Graveyard", level: 5500 },
      
      // Z59-Z65
      { name: "The Weaving Caves", level: 6143 },
      { name: "Echoing Valley of the Giants", level: 6786 },
      { name: "The Glimmering Shore", level: 7429 },
      { name: "The Whispering Canyon", level: 8071 },
      { name: "Floating River", level: 8714 },
      { name: "The Cloud Sea", level: 9357 },
      
      // Z66-Z76
      { name: "The Bloodfang Jungle", level: 13636 },
      { name: "Sunstone Deserts", level: 17272 },
      { name: "The Whispering Gardens", level: 20908 },
      { name: "Glass Peaks", level: 24544 },
      { name: "Phantom Forests", level: 28180 },
      { name: "The Shrouded Isles", level: 31816 },
      { name: "Gravity-Defying Rapids", level: 35452 },
      { name: "The Azure Depths", level: 39088 },
      { name: "Crystalline Spires", level: 42724 },
      { name: "The Void Scar", level: 46360 },
      { name: "Living Labyrinth", level: 50000 },
      
      // Z77-Z81
      { name: "The Silent Sands", level: 61111 },
      { name: "Acoustic Caves", level: 72222 },
      { name: "The Glittering Grottos", level: 83333 },
      { name: "Timeworn Badlands", level: 94444 },
      { name: "The Canopy Kingdom", level: 105555 },
      
      // Z82-Z101
      { name: "The Sunken Library", level: 116666 },
      { name: "Chromatic Geysers", level: 127777 },
      { name: "The Whispering City", level: 138888 },
      { name: "The Labyrinthine Mangroves", level: 150000 },
      { name: "The Frozen Heart of the World", level: 161111 },
      { name: "Gelatinous Jungles", level: 172222 },
      { name: "The Petrified Ocean", level: 183333 },
      { name: "The Symphony Springs", level: 194444 },
      { name: "The Whispering Cliffs", level: 205555 },
      { name: "The Bioluminescent Bog", level: 216666 },
      { name: "The Stone Giant's Graveyard", level: 227777 },
      { name: "The Maze of Roots", level: 238888 },
      { name: "The Endless Plains of Glass", level: 250000 },
      { name: "The Whispering Temple Ruins", level: 267857 },
      { name: "The Crystal Ocean", level: 285714 },
      { name: "The Sunken Palace of the Sea King", level: 303571 },
      { name: "The Land of Shifting Colors", level: 321428 },
      { name: "The Cloud Forest of the Sky Serpents", level: 339285 },
      { name: "The Singing Rivers", level: 357142 },
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