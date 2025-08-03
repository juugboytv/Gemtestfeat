/**
 * Zone Blueprint System
 * Dynamic zone layouts using axial coordinate system (Q, R)
 * Each zone has unique features positioned at specific coordinates
 */

export interface ZoneFeature {
  type: 'Sanctuary' | 'Armory' | 'Arcanum' | 'AetheriumConduit' | 'Teleporter' | 'Monster Zone' | 'Resource Node' | 'Boss Arena';
  q: number; // Column (horizontal position) 
  r: number; // Row (diagonal position)
  name?: string; // Optional custom name for the feature
}

export interface ZoneBlueprint {
  name: string;
  gridSize: number; // Radius of the hex map
  features: ZoneFeature[];
  terrain?: string; // Future expansion for terrain types
  description?: string;
  difficulty?: number; // Zone difficulty level
}

export const ZONE_BLUEPRINTS: Record<string, ZoneBlueprint> = {
  // Starter Zones (1-5)
  "1": {
    name: "Crystal Caves",
    gridSize: 4,
    description: "A shimmering cavern filled with glowing crystals. Perfect for new adventurers.",
    difficulty: 1,
    features: [
      { type: "Sanctuary", q: -2, r: 0 },
      { type: "Armory", q: 1, r: -1 },
      { type: "Arcanum", q: 1, r: 1 },
      { type: "AetheriumConduit", q: 2, r: 0 },
      { type: "Teleporter", q: 0, r: 2 },
      { type: "Monster Zone", q: -1, r: -1 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Resource Node", q: -1, r: 2, name: "Crystal Deposit" }
    ]
  },
  
  "2": {
    name: "Whispering Woods",
    gridSize: 5,
    description: "Ancient trees that seem to murmur secrets to those who listen.",
    difficulty: 2,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "Armory", q: -2, r: 2 },
      { type: "Teleporter", q: 3, r: -1 },
      { type: "Monster Zone", q: -1, r: -2 },
      { type: "Monster Zone", q: 1, r: 1 },
      { type: "Monster Zone", q: 2, r: -2 },
      { type: "Resource Node", q: -3, r: 1, name: "Moonwell Spring" }
    ]
  },

  "3": {
    name: "Ember Peaks",
    gridSize: 4,
    description: "Volcanic peaks where the earth breathes fire and ash.",
    difficulty: 3,
    features: [
      { type: "Sanctuary", q: -1, r: -1 },
      { type: "Arcanum", q: 2, r: -1 },
      { type: "AetheriumConduit", q: 0, r: 2 },
      { type: "Teleporter", q: -2, r: 2 },
      { type: "Monster Zone", q: 1, r: 0 },
      { type: "Monster Zone", q: 0, r: -1 },
      { type: "Boss Arena", q: 1, r: 1, name: "Magma Lord's Chamber" }
    ]
  },

  "4": {
    name: "Frost Hollow",
    gridSize: 5,
    description: "An eternally frozen valley where ice spirits dance.",
    difficulty: 4,
    features: [
      { type: "Sanctuary", q: 2, r: -2 },
      { type: "Armory", q: -1, r: 0 },
      { type: "Teleporter", q: 0, r: 3 },
      { type: "Monster Zone", q: -2, r: 1 },
      { type: "Monster Zone", q: 1, r: -1 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Resource Node", q: -2, r: 3, name: "Eternal Ice" }
    ]
  },

  "5": {
    name: "Shadowmere",
    gridSize: 6,
    description: "A misty realm where shadows take physical form.",
    difficulty: 5,
    features: [
      { type: "Sanctuary", q: -3, r: 0 },
      { type: "Arcanum", q: 2, r: 1 },
      { type: "AetheriumConduit", q: 0, r: -3 },
      { type: "Teleporter", q: 3, r: -2 },
      { type: "Monster Zone", q: -1, r: 2 },
      { type: "Monster Zone", q: 1, r: -2 },
      { type: "Monster Zone", q: 0, r: 1 },
      { type: "Boss Arena", q: -1, r: -1, name: "Shadow Nexus" }
    ]
  },

  // Mid-tier Zones (25, 50)
  "25": {
    name: "Echoing Chasms",
    gridSize: 7,
    description: "Deep canyons where every sound returns as a haunting echo.",
    difficulty: 25,
    features: [
      { type: "Sanctuary", q: 5, r: -2 },
      { type: "AetheriumConduit", q: -4, r: 1 },
      { type: "Teleporter", q: 0, r: -5 },
      { type: "Monster Zone", q: -2, r: 3 },
      { type: "Monster Zone", q: 2, r: -3 },
      { type: "Monster Zone", q: -1, r: -2 },
      { type: "Monster Zone", q: 3, r: 1 },
      { type: "Boss Arena", q: 0, r: 0, name: "Echo Chamber" },
      { type: "Resource Node", q: -3, r: 4, name: "Resonance Crystal" }
    ]
  },

  "50": {
    name: "Astral Confluence",
    gridSize: 8,
    description: "Where multiple dimensions intersect, creating reality-bending phenomena.",
    difficulty: 50,
    features: [
      { type: "Sanctuary", q: -4, r: 2 },
      { type: "Arcanum", q: 3, r: -1 },
      { type: "AetheriumConduit", q: 0, r: 4 },
      { type: "Teleporter", q: -2, r: -4 },
      { type: "Monster Zone", q: 2, r: 2 },
      { type: "Monster Zone", q: -3, r: -1 },
      { type: "Monster Zone", q: 1, r: -3 },
      { type: "Monster Zone", q: -1, r: 3 },
      { type: "Boss Arena", q: 0, r: 0, name: "Dimensional Rift" },
      { type: "Resource Node", q: 4, r: -2, name: "Astral Essence" },
      { type: "Resource Node", q: -3, r: 5, name: "Void Fragment" }
    ]
  },

  // High-tier Zone (75)
  "75": {
    name: "Nexus of Eternity",
    gridSize: 9,
    description: "The heart of all magical energy, where time itself bends.",
    difficulty: 75,
    features: [
      { type: "Sanctuary", q: 6, r: -3 },
      { type: "Armory", q: -4, r: 2 },
      { type: "Arcanum", q: 2, r: 3 },
      { type: "AetheriumConduit", q: 0, r: -6 },
      { type: "Teleporter", q: -5, r: 4 },
      { type: "Monster Zone", q: 3, r: -2 },
      { type: "Monster Zone", q: -2, r: -3 },
      { type: "Monster Zone", q: 1, r: 4 },
      { type: "Monster Zone", q: -3, r: 1 },
      { type: "Monster Zone", q: 4, r: 1 },
      { type: "Boss Arena", q: 0, r: 0, name: "Temporal Core" },
      { type: "Resource Node", q: -5, r: 6, name: "Chronos Shard" },
      { type: "Resource Node", q: 5, r: -4, name: "Eternity Bloom" }
    ]
  },

  // Endgame Zone (101)
  "101": {
    name: "The Void Throne",
    gridSize: 10,
    description: "The ultimate destination where reality meets the infinite void.",
    difficulty: 101,
    features: [
      { type: "Sanctuary", q: -7, r: 3 },
      { type: "Armory", q: 4, r: -4 },
      { type: "Arcanum", q: -3, r: 6 },
      { type: "AetheriumConduit", q: 7, r: -2 },
      { type: "Teleporter", q: 0, r: 8 },
      { type: "Monster Zone", q: 2, r: -5 },
      { type: "Monster Zone", q: -4, r: -2 },
      { type: "Monster Zone", q: 5, r: 2 },
      { type: "Monster Zone", q: -2, r: 4 },
      { type: "Monster Zone", q: 3, r: 3 },
      { type: "Monster Zone", q: -5, r: -1 },
      { type: "Boss Arena", q: 0, r: 0, name: "The Void Throne" },
      { type: "Resource Node", q: -6, r: 7, name: "Void Heart" },
      { type: "Resource Node", q: 6, r: -5, name: "Reality Anchor" },
      { type: "Resource Node", q: 0, r: -7, name: "Primordial Essence" }
    ]
  }
};

// Utility functions for zone management
export function getZoneBlueprint(zoneId: string | number): ZoneBlueprint | null {
  const id = String(zoneId);
  return ZONE_BLUEPRINTS[id] || null;
}

export function getAllZoneIds(): string[] {
  return Object.keys(ZONE_BLUEPRINTS);
}

export function getZonesByDifficulty(minDifficulty: number, maxDifficulty: number): ZoneBlueprint[] {
  return Object.values(ZONE_BLUEPRINTS).filter(
    zone => zone.difficulty && zone.difficulty >= minDifficulty && zone.difficulty <= maxDifficulty
  );
}

// Generate missing zone blueprints (placeholder function for now)
export function generateMissingZoneBlueprints(): void {
  const existingIds = new Set(Object.keys(ZONE_BLUEPRINTS));
  
  for (let i = 1; i <= 101; i++) {
    const id = String(i);
    if (!existingIds.has(id)) {
      // Generate basic blueprint for missing zones
      ZONE_BLUEPRINTS[id] = {
        name: `Zone ${i}`,
        gridSize: Math.floor(4 + (i / 20)), // Gradually increase size
        difficulty: i,
        description: `Auto-generated zone ${i}`,
        features: [
          { type: "Sanctuary", q: 0, r: 0 },
          { type: "Teleporter", q: 2, r: -1 },
          { type: "Monster Zone", q: -1, r: 1 },
          { type: "Monster Zone", q: 1, r: -1 }
        ]
      };
    }
  }
}