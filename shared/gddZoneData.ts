// GDD-Compliant Zone Data - Exact Level Requirements
// This file contains the proper level requirements as specified in the Game Design Document

export interface GDDZoneData {
  zoneId: number;
  name: string;
  levelRequirement: number;
  gearTier: string;
  gemGrade: number;
}

// Exact GDD Zone Level Requirements Table
export const GDD_LEVEL_REQUIREMENTS: Record<number, number> = {
  // Starter zones (Z01-Z24) - All level 1
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1,
  11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1,
  21: 1, 22: 1, 23: 1, 24: 1,
  
  // Mid-tier zones with exponential progression
  25: 100,    // Echoing Chasms
  26: 110,    // Starfall Deserts
  27: 121,    // The Weeping Mire
  28: 133,    // Frozen Spirelands
  29: 146,    // Living Mountain
  30: 161,    // Chrono-Distorted Fields
  31: 177,    // Whisperwind Peaks
  32: 195,    // Corrupted Jungles
  33: 215,    // Acidic Fens
  34: 253,    // Bone Deserts (from GDD table)
  35: 278,
  36: 306,
  37: 337,
  38: 371,
  39: 408,
  40: 449,
  41: 494,
  42: 543,
  43: 597,
  44: 657,
  45: 723,
  46: 795,
  47: 875,
  48: 962,
  49: 1058,
  50: 1164,
  51: 1000,   // Giant Mushroom Forests (from GDD table)
  52: 1380,
  53: 1518,
  54: 1670,
  55: 1837,
  56: 2021,
  57: 2223,
  58: 2445,
  59: 6143,   // The Weaving Caves (from GDD table)
  60: 7500,
  61: 8250,
  62: 9075,
  63: 9983,
  64: 10981,
  65: 12079,
  66: 13636,  // The Bloodfang Jungle (from GDD table)
  67: 15000,
  68: 16500,
  69: 18150,
  70: 19965,
  71: 21962,
  72: 35452,  // Gravity-Defying Rapids (from GDD table)
  73: 39000,
  74: 42900,
  75: 47190,
  76: 51909,
  77: 57100,
  78: 62810,
  79: 83333,  // The Glittering Grottos (from GDD table)
  80: 91666,
  81: 100833,
  82: 110916,
  83: 122008,
  84: 134208,
  85: 147629,
  86: 162392,
  87: 172222, // Gelatinous Jungles (from GDD table)
  88: 189444,
  89: 208389,
  90: 229228,
  91: 252151,
  92: 277366,
  93: 305103,
  94: 335613,
  95: 369175,
  96: 406092,
  97: 446701,
  98: 491371,
  99: 540508,
  100: 594559,
  101: 400000  // The Echoing Gorge of Lost Souls (from GDD table)
};

// Generate proper level requirement for any zone
export function getZoneLevelRequirement(zoneId: number): number {
  return GDD_LEVEL_REQUIREMENTS[zoneId] || zoneId;
}

// Zone names mapping
export const ZONE_NAMES: Record<number, string> = {
  1: 'Crystal Caves (Dwarf)',
  2: 'Elvenwood (Elf)', 
  3: 'Shifting Maze (Halfling)',
  4: 'Arid Badlands (Human)',
  5: 'Glimmering Springs (Gnome)',
  6: 'Blazefire Wastes (Tiefling)',
  7: 'Shadowlands (Drow)',
  8: 'Frostlands (Orc)',
  9: 'Moonscape (Goblin)',
  10: 'Dragonspine (Dragonborn)',
  11: 'Coral Gardens (Triton)',
  12: 'Wildlands (Tabaxi)',
  13: 'Mist Realm (Kobold)',
  14: 'Emberfall (Phoenix)',
  15: 'Glimmering Glade (Unicorn)',
  16: 'Swamps (Baba Yaga)',
  17: 'Gravefrost Peaks (Draugr)',
  18: 'Sunken City of Atla (Atlantean)',
  19: 'Gloomwood (Vampire)',
  20: 'Corrupted Jungle (Shaman)',
  21: 'Primal Chasm (Barbarian)',
  22: 'SunkenCityofEldoria(Drow/Merfolk)',
  23: 'Blazefire Forge (Firenewt)',
  24: 'Heavenly Spires (Angel/Aasimar)',
  25: 'Echoing Chasms',
  26: 'Starfall Deserts',
  27: 'The Weeping Mire',
  28: 'Frozen Spirelands',
  29: 'Living Mountain',
  30: 'Chrono-Distorted Fields',
  31: 'Whisperwind Peaks',
  32: 'Corrupted Jungles',
  33: 'Acidic Fens',
  34: 'Bone Deserts',
  35: 'The Maw',
  36: 'Poisonbloom Meadows',
  37: 'Storm-Wrenched Coast',
  38: 'The Rusting Wastes',
  39: 'Webbed Caverns',
  40: 'The Scarred Peaks',
  41: 'Fungal Undergrowth',
  42: 'Obsidian Flats',
  43: 'Quicksand Dunes',
  44: 'Spectral Moorlands',
  45: 'Crystalline Caverns',
  46: 'The Sunken Citadel',
  47: 'Howling Wastelands',
  48: 'The Ember Fields',
  49: 'Writhing Depths',
  50: 'Astral Confluence',
  51: 'Giant Mushroom Forests',
  52: 'The Singing Stones',
  53: 'Voidtouched Realm',
  54: 'The Mirrored Lake',
  55: 'Thornwall Labyrinth',
  56: 'The Bleeding Cliffs',
  57: 'Shimmering Oasis',
  58: 'The Forgotten City',
  59: 'The Weaving Caves',
  60: 'Nightmare Gardens',
  61: 'The Screaming Gorge',
  62: 'Molten Core',
  63: 'The Drifting Isles',
  64: 'Shadowmere Depths',
  65: 'The Crystalline Spire',
  66: 'The Bloodfang Jungle',
  67: 'Wraithwind Valley',
  68: 'The Sunless Sea',
  69: 'Frostbitten Peaks',
  70: 'The Shattered Realm',
  71: 'Ethereal Meadows',
  72: 'Gravity-Defying Rapids',
  73: 'The Whispering Void',
  74: 'Crimson Badlands',
  75: 'The Floating Gardens',
  76: 'Temporal Rifts',
  77: 'The Infinite Library',
  78: 'Chaos Storms',
  79: 'The Glittering Grottos',
  80: 'Dimensional Nexus',
  81: 'The Singing Crystals',
  82: 'Vortex of Souls',
  83: 'The Luminous Depths',
  84: 'Reality\'s Edge',
  85: 'The Fractal Gardens',
  86: 'Planar Convergence',
  87: 'Gelatinous Jungles',
  88: 'The Quantum Fields',
  89: 'Stellar Graveyard',
  90: 'The Impossible Tower',
  91: 'Void Streams',
  92: 'The Dream Realm',
  93: 'Entropy\'s Heart',
  94: 'The Final Gate',
  95: 'Cosmic Winds',
  96: 'The Last Stand',
  97: 'Beyond Reality',
  98: 'The Ultimate Test',
  99: 'Edge of Existence',
  100: 'The Approaching End',
  101: 'The Echoing Gorge of Lost Souls'
};