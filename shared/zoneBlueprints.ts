/**
 * Zone Blueprint System
 * Dynamic zone layouts using axial coordinate system (Q, R)
 * Each zone has unique features positioned at specific coordinates
 */

export interface ZoneFeature {
  type: 'Sanctuary' | 'Bank' | 'Armory' | 'Arcanum' | 'AetheriumConduit' | 'Teleporter' | 'Monster Zone' | 'Resource Node' | 'Boss Arena' | 'Gem Node';
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

// Standardized starter zone features: All 24 starter zones have these core features
// 🆘 Sanctuary, 🏧 Bank, 🔮 Arcanum, ⚔️ Armory, 🌀 AetheriumConduit, 💎 Gem Node
const starterZoneFeatures: ZoneFeature[] = [
  { type: "Sanctuary", q: 0, r: 0 },      // 🆘 Center sanctuary for safety
  { type: "Bank", q: -1, r: -1 },         // 🏧 Bank for item storage
  { type: "Arcanum", q: 1, r: -1 },       // 🔮 Arcanum for magic services
  { type: "Armory", q: -1, r: 1 },        // ⚔️ Armory for equipment
  { type: "AetheriumConduit", q: 1, r: 1 }, // 🌀 AetheriumConduit for energy
  { type: "Gem Node", q: 0, r: 2 },       // 💎 Gem Node for gem collection
  { type: "Teleporter", q: 2, r: 0 },     // Portal for zone travel
  { type: "Monster Zone", q: -2, r: 0 },  // Monster areas for combat
  { type: "Monster Zone", q: 0, r: -2 }   // Additional monster area
];

export const ZONE_BLUEPRINTS: Record<string, ZoneBlueprint> = {
  // === STARTER ZONES (1-24) - All have standardized features ===
  "1": {
    name: "Crystal Caves (Dwarf)",
    gridSize: 4,
    description: "A shimmering cavern filled with glowing crystals. Perfect for new adventurers.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Crystal Deposit" }]
  },
  "2": {
    name: "Elvenwood (Elf)",
    gridSize: 4,
    description: "Ancient elven forest filled with magical energy.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Moonwell Spring" }]
  },
  "3": {
    name: "Shifting Maze (Halfling)",
    gridSize: 4,
    description: "A maze that changes its layout with each visit.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Maze Heart" }]
  },
  "4": {
    name: "Arid Badlands (Human)",
    gridSize: 4,
    description: "Sun-scorched lands where survival is key.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Oasis Well" }]
  },
  "5": {
    name: "Glimmering Springs (Gnome)",
    gridSize: 4,
    description: "Magical springs that glimmer with arcane energy.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Arcane Spring" }]
  },
  "6": {
    name: "Blazefire Wastes (Tiefling)",
    gridSize: 4,
    description: "Burning wastelands where fire elementals roam.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Flame Geyser" }]
  },
  "7": {
    name: "Abyssal Fen (Swampfolk)",
    gridSize: 4,
    description: "Dark swamplands shrouded in perpetual mist.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Bog Heart" }]
  },
  "8": {
    name: "Moss-Covered Forest (Human/Fey)",
    gridSize: 4,
    description: "Ancient forest where fey magic lingers.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Fey Circle" }]
  },
  "9": {
    name: "Cinder Barrens (Orc)",
    gridSize: 4,
    description: "Volcanic barrens where orcish tribes make their home.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Lava Pool" }]
  },
  "10": {
    name: "Echo Mountain (Dwarf/Giant)",
    gridSize: 4,
    description: "Towering peaks where echoes never fade.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Echo Chamber" }]
  },
  "11": {
    name: "Labyrinth (Minotaur)",
    gridSize: 4,
    description: "An ancient labyrinth guarded by minotaurs.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Minotaur Court" }]
  },
  "12": {
    name: "Steppe (Centaur)",
    gridSize: 4,
    description: "Endless grasslands where centaur herds roam.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Sacred Grove" }]
  },
  "13": {
    name: "Cloud Peak (Griffin/Angel)",
    gridSize: 4,
    description: "Sky-high peaks where celestial beings dwell.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Celestial Altar" }]
  },
  "14": {
    name: "Emberfall (Phoenix)",
    gridSize: 4,
    description: "Volcanic region where phoenixes nest.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Phoenix Roost" }]
  },
  "15": {
    name: "Glimmering Glade (Unicorn)",
    gridSize: 4,
    description: "Pristine glade where unicorns graze.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Unicorn Spring" }]
  },
  "16": {
    name: "Swamps (Baba Yaga)",
    gridSize: 4,
    description: "Dark swamps where the witch Baba Yaga dwells.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Baba Yaga's Hut" }]
  },
  "17": {
    name: "Gravefrost Peaks (Draugr)",
    gridSize: 4,
    description: "Frozen peaks haunted by the undead.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Frozen Tomb" }]
  },
  "18": {
    name: "Sunken City of Atla (Atlantean)",
    gridSize: 4,
    description: "Ancient underwater city ruins.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Atlantean Spire" }]
  },
  "19": {
    name: "Gloomwood (Vampire)",
    gridSize: 4,
    description: "Dark woods where vampires hunt.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Vampire Crypt" }]
  },
  "20": {
    name: "Corrupted Jungle (Shaman)",
    gridSize: 4,
    description: "Jungle twisted by dark shamanic magic.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Corruption Heart" }]
  },
  "21": {
    name: "Primal Chasm (Barbarian)",
    gridSize: 4,
    description: "Deep chasm where primal barbarians dwell.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Boss Arena", q: -1, r: 2, name: "Primal Arena" }]
  },
  "22": {
    name: "Sunken City of Eldoria (Drow/Merfolk)",
    gridSize: 4,
    description: "Underwater city shared by drow and merfolk.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Depths Altar" }]
  },
  "23": {
    name: "Blazefire Forge (Firenewt)",
    gridSize: 4,
    description: "Volcanic forge where firenewts craft weapons.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Forge Heart" }]
  },
  "24": {
    name: "Heavenly Spires (Angel/Aasimar)",
    gridSize: 4,
    description: "Divine spires where angels and aasimar reside.",
    difficulty: 1,
    features: [...starterZoneFeatures, { type: "Resource Node", q: -1, r: 2, name: "Divine Nexus" }]
  },

  // === HIGHER LEVEL ZONES (25-101) - ALL 77 ZONES ===
  "25": {
    name: "Echoing Chasms",
    gridSize: 5,
    description: "Deep canyons where every sound returns as a haunting echo. Level 100 required.",
    difficulty: 25,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "26": {
    name: "Starfall Deserts",
    gridSize: 5,
    description: "Desert sands that shimmer with fallen starlight. Level 100 required.",
    difficulty: 26,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "27": {
    name: "The Weeping Mire",
    gridSize: 5,
    description: "Sorrowful swamplands where ancient tears still fall. Level 100 required.",
    difficulty: 27,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "28": {
    name: "Frozen Spirelands",
    gridSize: 5,
    description: "Icy peaks that pierce the frozen sky. Level 100 required.",
    difficulty: 28,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "29": {
    name: "Living Mountain",
    gridSize: 5,
    description: "A mountain that breathes and moves with ancient life. Level 100 required.",
    difficulty: 29,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "30": {
    name: "Chrono-Distorted Fields",
    gridSize: 5,
    description: "Fields where time flows differently in each step. Level 100 required.",
    difficulty: 30,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "31": {
    name: "Whisperwind Peaks",
    gridSize: 5,
    description: "Mountain peaks where the wind carries ancient secrets. Level 100 required.",
    difficulty: 31,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "32": {
    name: "Corrupted Jungles",
    gridSize: 5,
    description: "Jungles twisted by dark magic and malevolent forces. Level 100 required.",
    difficulty: 32,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "33": {
    name: "Acidic Fens",
    gridSize: 5,
    description: "Toxic wetlands that dissolve all but the strongest materials. Level 100 required.",
    difficulty: 33,
    levelRequirement: 100,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
    ]
  },
  "34": {
    name: "Bone Deserts",
    gridSize: 5,
    description: "Vast deserts carpeted with the bones of fallen giants. Level 253 required.",
    difficulty: 34,
    levelRequirement: 253,
    features: [
      { type: "Sanctuary", q: 0, r: 0 },
      { type: "AetheriumConduit", q: -1, r: -1 },
      { type: "Arcanum", q: 1, r: -1 },
      { type: "Bank", q: -1, r: 1 },
      { type: "Armory", q: 1, r: 1 },
      { type: "Gem Node", q: 0, r: 2 },
      { type: "Teleporter", q: 2, r: 0 },
      { type: "Monster Zone", q: -2, r: 0 },
      { type: "Monster Zone", q: 0, r: -2 },
      { type: "Boss Arena", q: 1, r: 1, name: "Boss Chamber" },
      { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
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