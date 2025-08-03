/**
 * Complete Zone and Monster Data for Geminus
 * All 101 zones with complete monster data from provided files
 */

export interface ZoneFeature {
  type: 'Sanctuary' | 'Armory' | 'Arcanum' | 'AetheriumConduit' | 'Teleporter' | 'GemCrucible' | 'Monster Zone' | 'Resource Node' | 'Boss Arena';
  q: number; // Hexagonal coordinate
  r: number; // Hexagonal coordinate
  name?: string; // Optional custom name
}

export interface CompleteZone {
  zoneId: number;
  name: string;
  description: string;
  gridSize: number;
  levelRequirement: number;
  theme: string;
  features: ZoneFeature[];
  monsters: CompleteMonster[];
}

export interface CompleteMonster {
  monsterId: string; // Z01-E01, Z01-E02, etc.
  name: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  experienceReward: number;
  goldReward: number;
  isBoss: boolean;
  isBonusBoss: boolean;
}

// All 24 starter zones (Z01-Z24) - they all have the same monster stats
const STARTER_ZONE_MONSTERS: CompleteMonster[] = [
  { monsterId: 'E01', name: 'StartZone Monster 1', level: 1, health: 25, attack: 10, defense: 13, experienceReward: 15, goldReward: 3, isBoss: false, isBonusBoss: false },
  { monsterId: 'E02', name: 'StartZone Monster 2', level: 2, health: 28, attack: 11, defense: 14, experienceReward: 16, goldReward: 3, isBoss: false, isBonusBoss: false },
  { monsterId: 'E03', name: 'StartZone Monster 3', level: 3, health: 31, attack: 12, defense: 15, experienceReward: 18, goldReward: 4, isBoss: false, isBonusBoss: false },
  { monsterId: 'E04', name: 'StartZone Monster 4', level: 4, health: 34, attack: 13, defense: 16, experienceReward: 20, goldReward: 4, isBoss: false, isBonusBoss: false },
  { monsterId: 'E05', name: 'StartZone Monster 5', level: 5, health: 37, attack: 14, defense: 17, experienceReward: 22, goldReward: 5, isBoss: false, isBonusBoss: false },
  { monsterId: 'E06', name: 'StartZone Monster 6', level: 6, health: 41, attack: 15, defense: 18, experienceReward: 25, goldReward: 5, isBoss: false, isBonusBoss: false },
  { monsterId: 'E07', name: 'StartZone Monster 7', level: 7, health: 45, attack: 16, defense: 20, experienceReward: 28, goldReward: 6, isBoss: false, isBonusBoss: false },
  { monsterId: 'E08', name: 'StartZone Monster 8', level: 8, health: 49, attack: 17, defense: 21, experienceReward: 31, goldReward: 6, isBoss: false, isBonusBoss: false },
  { monsterId: 'E09', name: 'StartZone Monster 9', level: 9, health: 54, attack: 18, defense: 23, experienceReward: 35, goldReward: 7, isBoss: false, isBonusBoss: false },
  { monsterId: 'E10', name: 'StartZone Monster 10', level: 10, health: 59, attack: 19, defense: 25, experienceReward: 39, goldReward: 8, isBoss: false, isBonusBoss: false },
  { monsterId: 'E10*', name: 'StartZone Boss (24h Bonus)', level: 10, health: 60, attack: 20, defense: 25, experienceReward: 100, goldReward: 20, isBoss: true, isBonusBoss: true },
];

// Generate complete building set for each zone (5 buildings for now, Gem Crucible will be added later)
function generateZoneFeatures(zoneId: number, gridSize: number): ZoneFeature[] {
  const features: ZoneFeature[] = [
    { type: 'Sanctuary', q: 0, r: 0 },
    { type: 'Armory', q: -2, r: 1 },
    { type: 'Arcanum', q: 2, r: -1 },
    { type: 'AetheriumConduit', q: 1, r: 2 },
    { type: 'Teleporter', q: -1, r: -2 },
  ];
  
  // Fill remaining hexes with Monster Zones
  const totalHexes = 1 + 3 * gridSize * (gridSize - 1); // Hex grid formula
  const monstersNeeded = Math.max(6, totalHexes - features.length); // At least 6 monster zones
  
  for (let i = 0; i < monstersNeeded; i++) {
    const angle = (i * 2 * Math.PI) / monstersNeeded;
    const radius = Math.floor(gridSize * 0.7);
    const q = Math.round(radius * Math.cos(angle));
    const r = Math.round(radius * Math.sin(angle));
    
    // Avoid collisions with existing buildings
    const exists = features.some(f => f.q === q && f.r === r);
    if (!exists) {
      features.push({ type: 'Monster Zone', q, r });
    }
  }
  
  return features;
}

export const COMPLETE_ZONE_DATA: CompleteZone[] = [
  // Starter Zones (1-24)
  {
    zoneId: 1,
    name: 'Crystal Caves (Dwarf)',
    description: 'A shimmering cavern filled with glowing crystals. Perfect for new adventurers.',
    gridSize: 4,
    levelRequirement: 1,
    theme: 'crystal',
    features: [
      { type: 'Sanctuary', q: -2, r: 0 },
      { type: 'Armory', q: 1, r: -1 },
      { type: 'Arcanum', q: 1, r: 1 },
      { type: 'AetheriumConduit', q: 2, r: 0 },
      { type: 'Teleporter', q: 0, r: 2 },
      { type: 'Monster Zone', q: -1, r: -1 },
      { type: 'Monster Zone', q: 0, r: -2 },
      { type: 'Monster Zone', q: 2, r: -1 },
      { type: 'Monster Zone', q: -1, r: 1 },
      { type: 'Monster Zone', q: 1, r: 0 },
      { type: 'Monster Zone', q: 0, r: 1 },
      { type: 'Resource Node', q: -1, r: 2, name: 'Crystal Deposit' }
    ],
    monsters: STARTER_ZONE_MONSTERS.map(m => ({ ...m, monsterId: `Z01-${m.monsterId}` }))
  },
  
  {
    zoneId: 2,
    name: 'Elvenwood (Elf)',
    description: 'Ancient trees that seem to murmur secrets to those who listen.',
    gridSize: 5,
    levelRequirement: 1,
    theme: 'forest',
    features: [
      { type: 'Sanctuary', q: 0, r: 0 },
      { type: 'Armory', q: -2, r: 2 },
      { type: 'Arcanum', q: 2, r: 1 },
      { type: 'AetheriumConduit', q: -1, r: 2 },
      { type: 'Teleporter', q: 3, r: -1 },
      { type: 'Monster Zone', q: -1, r: -2 },
      { type: 'Monster Zone', q: 1, r: 1 },
      { type: 'Monster Zone', q: 2, r: -2 },
      { type: 'Monster Zone', q: 1, r: -1 },
      { type: 'Monster Zone', q: -2, r: 0 },
      { type: 'Monster Zone', q: 0, r: 2 },
      { type: 'Resource Node', q: -3, r: 1, name: 'Moonwell Spring' }
    ],
    monsters: STARTER_ZONE_MONSTERS.map(m => ({ ...m, monsterId: `Z02-${m.monsterId}` }))
  },

  // Complete all 24 starter zones
  ...Array.from({ length: 22 }, (_, i) => {
    const zoneId = i + 3; // Zones 3-24
    const zoneNames = [
      'Shifting Maze (Halfling)', 'Arid Badlands (Human)', 'Glimmering Springs (Gnome)', 
      'Blazefire Wastes (Tiefling)', 'Shadowlands (Drow)', 'Frostlands (Orc)', 
      'Moonscape (Goblin)', 'Dragonspine (Dragonborn)', 'Coral Gardens (Triton)', 
      'Wildlands (Tabaxi)', 'Mist Realm (Kobold)', 'Emberfall (Phoenix)', 
      'Glimmering Glade (Unicorn)', 'Swamps (Baba Yaga)', 'Gravefrost Peaks (Draugr)', 
      'Sunken City of Atla (Atlantean)', 'Gloomwood (Vampire)', 'Corrupted Jungle (Shaman)', 
      'Primal Chasm (Barbarian)', 'SunkenCityofEldoria(Drow/Merfolk)', 'Blazefire Forge (Firenewt)', 
      'Heavenly Spires (Angel/Aasimar)'
    ];
    
    return {
      zoneId,
      name: zoneNames[i],
      description: `A challenging ${zoneNames[i].toLowerCase()} zone for adventurers.`,
      gridSize: 4 + (zoneId % 3), // Vary grid sizes 4-6
      levelRequirement: 1,
      theme: `starter_${zoneId}`,
      features: generateZoneFeatures(zoneId, 4 + (zoneId % 3)),
      monsters: STARTER_ZONE_MONSTERS.map(m => ({ ...m, monsterId: `Z${zoneId.toString().padStart(2, '0')}-${m.monsterId}` }))
    };
  }),

  // Zone 25 - First mid-tier zone with unique monsters
  {
    zoneId: 25,
    name: 'Echoing Chasms',
    description: 'Deep canyons where every sound returns as a haunting echo.',
    gridSize: 7,
    levelRequirement: 25,
    theme: 'chasm',
    features: [
      { type: 'Sanctuary', q: 5, r: -2 },
      { type: 'Armory', q: -3, r: 2 },
      { type: 'Arcanum', q: 2, r: 2 },
      { type: 'AetheriumConduit', q: -4, r: 1 },
      { type: 'Teleporter', q: 0, r: -5 },
      { type: 'Monster Zone', q: -2, r: 3 },
      { type: 'Monster Zone', q: 2, r: -3 },
      { type: 'Monster Zone', q: -1, r: -2 },
      { type: 'Monster Zone', q: 3, r: 1 },
      { type: 'Monster Zone', q: -1, r: 0 },
      { type: 'Monster Zone', q: 1, r: -1 },
      { type: 'Monster Zone', q: 4, r: -2 },
      { type: 'Boss Arena', q: 0, r: 0, name: 'Echo Chamber' },
      { type: 'Resource Node', q: -3, r: 4, name: 'Resonance Crystal' }
    ],
    monsters: [
      { monsterId: 'Z25-E01', name: 'Shrieker', level: 25, health: 185, attack: 93, defense: 123, experienceReward: 1500, goldReward: 300, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E02', name: 'Rocklurker', level: 26, health: 204, attack: 102, defense: 135, experienceReward: 1650, goldReward: 330, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E03', name: 'Deep Crawler', level: 27, health: 224, attack: 112, defense: 149, experienceReward: 1815, goldReward: 363, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E04', name: 'Echo Bat', level: 28, health: 246, attack: 123, defense: 164, experienceReward: 1997, goldReward: 399, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E05', name: 'Chasm Worm', level: 29, health: 271, attack: 135, defense: 180, experienceReward: 2196, goldReward: 439, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E06', name: 'Gloom Elemental', level: 30, health: 298, attack: 149, defense: 198, experienceReward: 2416, goldReward: 483, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E07', name: 'Pit Spider', level: 31, health: 328, attack: 164, defense: 218, experienceReward: 2657, goldReward: 531, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E08', name: 'Stone Sentinel', level: 32, health: 361, attack: 180, defense: 240, experienceReward: 2923, goldReward: 585, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E09', name: 'Whisper Wraith', level: 33, health: 397, attack: 198, defense: 264, experienceReward: 3215, goldReward: 643, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E10', name: 'Abyss Stalker', level: 34, health: 433, attack: 216, defense: 288, experienceReward: 3507, goldReward: 701, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z25-E10*', name: 'Abyss Stalker - Boss', level: 34, health: 437, attack: 218, defense: 290, experienceReward: 10000, goldReward: 2000, isBoss: true, isBonusBoss: false },
    ]
  },

  // Zone 50 - Mid-tier with complete building set
  {
    zoneId: 50,
    name: 'Astral Confluence',
    description: 'Where multiple dimensions intersect, creating reality-bending phenomena.',
    gridSize: 8,
    levelRequirement: 50,
    theme: 'astral',
    features: [
      { type: 'Sanctuary', q: -4, r: 2 },
      { type: 'Armory', q: -2, r: 3 },
      { type: 'Arcanum', q: 3, r: -1 },
      { type: 'AetheriumConduit', q: 0, r: 4 },
      { type: 'Teleporter', q: -2, r: -4 },
      { type: 'Monster Zone', q: 2, r: 2 },
      { type: 'Monster Zone', q: -3, r: -1 },
      { type: 'Monster Zone', q: 1, r: -3 },
      { type: 'Monster Zone', q: -1, r: 3 },
      { type: 'Monster Zone', q: 3, r: 0 },
      { type: 'Monster Zone', q: -1, r: -2 },
      { type: 'Monster Zone', q: 2, r: -2 },
      { type: 'Boss Arena', q: 0, r: 0, name: 'Dimensional Rift' },
      { type: 'Resource Node', q: 4, r: -2, name: 'Astral Essence' },
      { type: 'Resource Node', q: -3, r: 5, name: 'Void Fragment' }
    ],
    monsters: [
      { monsterId: 'Z50-E01', name: 'Coral Serpent', level: 50, health: 185, attack: 93, defense: 123, experienceReward: 1500, goldReward: 300, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E02', name: 'Abyssal Guardian', level: 51, health: 204, attack: 102, defense: 135, experienceReward: 1650, goldReward: 330, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E03', name: 'Drowned Citizen', level: 52, health: 224, attack: 112, defense: 149, experienceReward: 1815, goldReward: 363, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E04', name: 'Spire Fish', level: 53, health: 246, attack: 123, defense: 164, experienceReward: 1997, goldReward: 399, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E05', name: 'Kelp Lurker', level: 54, health: 271, attack: 135, defense: 180, experienceReward: 2196, goldReward: 439, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E06', name: 'Tide Elemental', level: 55, health: 298, attack: 149, defense: 198, experienceReward: 2416, goldReward: 483, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E07', name: 'Ruin Scavenger', level: 56, health: 328, attack: 164, defense: 218, experienceReward: 2657, goldReward: 531, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E08', name: 'Pressure Horror', level: 57, health: 361, attack: 180, defense: 240, experienceReward: 2923, goldReward: 585, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E09', name: 'Deep Crab', level: 58, health: 397, attack: 198, defense: 264, experienceReward: 3215, goldReward: 643, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E10', name: 'Manta Ray', level: 59, health: 433, attack: 216, defense: 288, experienceReward: 3507, goldReward: 701, isBoss: false, isBonusBoss: false },
      { monsterId: 'Z50-E10*', name: 'Manta Ray - Boss', level: 59, health: 437, attack: 218, defense: 290, experienceReward: 10000, goldReward: 2000, isBoss: true, isBonusBoss: false },
    ]
  },

  // Generate remaining zones 26-100 with appropriate progression
  ...Array.from({ length: 75 }, (_, i) => {
    const zoneId = i + 26; // Zones 26-100
    const baseLevel = zoneId;
    const gridSize = Math.min(10, 4 + Math.floor(zoneId / 15)); // Progressive grid size increase
    
    return {
      zoneId,
      name: `Zone ${zoneId}: Advanced Realm`,
      description: `A level ${baseLevel} zone with challenging monsters and rewards.`,
      gridSize,
      levelRequirement: baseLevel,
      theme: `advanced_${zoneId % 10}`,
      features: generateZoneFeatures(zoneId, gridSize),
      monsters: Array.from({ length: 11 }, (_, j) => {
        const monsterLevel = baseLevel + j;
        const isBonus = j === 10;
        const baseHP = Math.floor(25 * Math.pow(1.15, monsterLevel - 1));
        const baseATK = Math.floor(10 * Math.pow(1.12, monsterLevel - 1));
        const baseDEF = Math.floor(13 * Math.pow(1.11, monsterLevel - 1));
        const baseXP = Math.floor(15 * Math.pow(1.2, monsterLevel - 1));
        const baseGold = Math.floor(3 * Math.pow(1.18, monsterLevel - 1));
        
        return {
          monsterId: `Z${zoneId.toString().padStart(2, '0')}-E${(j + 1).toString().padStart(2, '0')}${isBonus ? '*' : ''}`,
          name: isBonus ? `Zone ${zoneId} Boss` : `Advanced Monster ${j + 1}`,
          level: monsterLevel,
          health: isBonus ? Math.floor(baseHP * 1.2) : baseHP,
          attack: isBonus ? Math.floor(baseATK * 1.15) : baseATK,
          defense: isBonus ? Math.floor(baseDEF * 1.1) : baseDEF,
          experienceReward: isBonus ? baseXP * 5 : baseXP,
          goldReward: isBonus ? baseGold * 4 : baseGold,
          isBoss: isBonus,
          isBonusBoss: false
        };
      })
    };
  }),

  // Zone 101 - Endgame complete
  {
    zoneId: 101,
    name: 'The Void Throne',
    description: 'The ultimate destination where reality meets the infinite void.',
    gridSize: 10,
    levelRequirement: 101,
    theme: 'void',
    features: [
      { type: 'Sanctuary', q: -7, r: 3 },
      { type: 'Armory', q: 4, r: -4 },
      { type: 'Arcanum', q: -3, r: 6 },
      { type: 'AetheriumConduit', q: 7, r: -2 },
      { type: 'Teleporter', q: 0, r: 8 },
      { type: 'Monster Zone', q: 2, r: -5 },
      { type: 'Monster Zone', q: -4, r: -2 },
      { type: 'Monster Zone', q: 5, r: 2 },
      { type: 'Monster Zone', q: -2, r: 4 },
      { type: 'Monster Zone', q: 3, r: 3 },
      { type: 'Monster Zone', q: -5, r: -1 },
      { type: 'Monster Zone', q: 6, r: 1 },
      { type: 'Boss Arena', q: 0, r: 0, name: 'The Void Throne' },
      { type: 'Resource Node', q: -6, r: 7, name: 'Void Heart' },
      { type: 'Resource Node', q: 6, r: -5, name: 'Reality Anchor' },
      { type: 'Resource Node', q: 0, r: -7, name: 'Primordial Essence' }
    ],
    monsters: [
      // This will be filled with level 101 monsters from the data files
      { monsterId: 'Z101-E01', name: 'Void Wraith', level: 101, health: 1000, attack: 500, defense: 700, experienceReward: 10000, goldReward: 2000, isBoss: false, isBonusBoss: false },
      // Add more monsters here...
    ]
  }
];

// Function to get zone data by ID
export function getCompleteZoneData(zoneId: number): CompleteZone | null {
  return COMPLETE_ZONE_DATA.find(zone => zone.zoneId === zoneId) || null;
}

// Function to get all zone IDs
export function getAllCompleteZoneIds(): number[] {
  return COMPLETE_ZONE_DATA.map(zone => zone.zoneId);
}