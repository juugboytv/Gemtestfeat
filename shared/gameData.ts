// GDD Mathematical Balancing System for Geminus
// Implements the complete 400,000 level cap with 20 gear tiers

export interface GearTier {
  id: number;
  name: string;
  levelRequirement: number;
  statMultiplier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ascended';
}

export interface ZoneData {
  id: number;
  name: string;
  levelRange: { min: number; max: number };
  monsterMultiplier: number;
  xpMultiplier: number;
  goldMultiplier: number;
  unlockLevel: number;
}

export interface MonsterScaling {
  baseHP: number;
  baseAttack: number;
  baseDefense: number;
  baseXP: number;
  baseGold: number;
  levelMultiplier: number;
  bossMultiplier: number;
}

// 20 Gear Tiers with Mathematical Progression
export const GEAR_TIERS: GearTier[] = [
  { id: 1, name: 'Crude', levelRequirement: 1, statMultiplier: 1.0, rarity: 'common' },
  { id: 2, name: 'Rough', levelRequirement: 5, statMultiplier: 1.2, rarity: 'common' },
  { id: 3, name: 'Basic', levelRequirement: 10, statMultiplier: 1.5, rarity: 'common' },
  { id: 4, name: 'Sturdy', levelRequirement: 20, statMultiplier: 1.8, rarity: 'uncommon' },
  { id: 5, name: 'Quality', levelRequirement: 35, statMultiplier: 2.2, rarity: 'uncommon' },
  { id: 6, name: 'Superior', levelRequirement: 55, statMultiplier: 2.7, rarity: 'uncommon' },
  { id: 7, name: 'Refined', levelRequirement: 80, statMultiplier: 3.3, rarity: 'rare' },
  { id: 8, name: 'Masterwork', levelRequirement: 115, statMultiplier: 4.0, rarity: 'rare' },
  { id: 9, name: 'Exceptional', levelRequirement: 160, statMultiplier: 4.8, rarity: 'rare' },
  { id: 10, name: 'Elite', levelRequirement: 220, statMultiplier: 5.8, rarity: 'epic' },
  { id: 11, name: 'Royal', levelRequirement: 300, statMultiplier: 7.0, rarity: 'epic' },
  { id: 12, name: 'Ancient', levelRequirement: 400, statMultiplier: 8.5, rarity: 'epic' },
  { id: 13, name: 'Mythical', levelRequirement: 550, statMultiplier: 10.3, rarity: 'legendary' },
  { id: 14, name: 'Legendary', levelRequirement: 750, statMultiplier: 12.5, rarity: 'legendary' },
  { id: 15, name: 'Artifact', levelRequirement: 1000, statMultiplier: 15.2, rarity: 'legendary' },
  { id: 16, name: 'Divine', levelRequirement: 1500, statMultiplier: 18.5, rarity: 'mythic' },
  { id: 17, name: 'Celestial', levelRequirement: 2500, statMultiplier: 22.5, rarity: 'mythic' },
  { id: 18, name: 'Ethereal', levelRequirement: 5000, statMultiplier: 27.5, rarity: 'mythic' },
  { id: 19, name: 'Transcendent', levelRequirement: 10000, statMultiplier: 33.5, rarity: 'ascended' },
  { id: 20, name: 'Ascended', levelRequirement: 25000, statMultiplier: 40.8, rarity: 'ascended' }
];

// Zone Configuration with Proper Level Scaling
export const ZONE_DATA: ZoneData[] = [
  // Starter Zones (1-24) - Racial Starting Areas
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Starting Zone ${i + 1}`,
    levelRange: { min: 1, max: 50 },
    monsterMultiplier: 1.0 + (i * 0.1),
    xpMultiplier: 1.0,
    goldMultiplier: 1.0,
    unlockLevel: 1
  })),
  
  // Advanced Zones (25-101) with Exponential Scaling
  { id: 25, name: 'Echoing Chasms', levelRange: { min: 25, max: 100 }, monsterMultiplier: 3.5, xpMultiplier: 1.5, goldMultiplier: 1.5, unlockLevel: 25 },
  { id: 26, name: 'Fungal Depths', levelRange: { min: 30, max: 120 }, monsterMultiplier: 4.2, xpMultiplier: 1.6, goldMultiplier: 1.6, unlockLevel: 30 },
  { id: 27, name: 'Crystal Caverns', levelRange: { min: 35, max: 140 }, monsterMultiplier: 5.0, xpMultiplier: 1.7, goldMultiplier: 1.7, unlockLevel: 35 },
  { id: 28, name: 'Sunken Ruins', levelRange: { min: 40, max: 160 }, monsterMultiplier: 6.0, xpMultiplier: 1.8, goldMultiplier: 1.8, unlockLevel: 40 },
  { id: 29, name: 'Bone Gardens', levelRange: { min: 45, max: 180 }, monsterMultiplier: 7.2, xpMultiplier: 1.9, goldMultiplier: 1.9, unlockLevel: 45 },
  { id: 30, name: 'Chrono-Distorted Fields', levelRange: { min: 50, max: 200 }, monsterMultiplier: 8.6, xpMultiplier: 2.0, goldMultiplier: 2.0, unlockLevel: 50 },
  
  // Mid-tier zones continue scaling exponentially
  { id: 50, name: 'Abyssal Depths', levelRange: { min: 500, max: 2000 }, monsterMultiplier: 50.0, xpMultiplier: 5.0, goldMultiplier: 5.0, unlockLevel: 500 },
  { id: 75, name: 'Void Nexus', levelRange: { min: 2500, max: 10000 }, monsterMultiplier: 250.0, xpMultiplier: 12.5, goldMultiplier: 12.5, unlockLevel: 2500 },
  { id: 100, name: 'Reality\'s Edge', levelRange: { min: 50000, max: 200000 }, monsterMultiplier: 2500.0, xpMultiplier: 50.0, goldMultiplier: 50.0, unlockLevel: 50000 },
  { id: 101, name: 'The Terminus', levelRange: { min: 100000, max: 400000 }, monsterMultiplier: 10000.0, xpMultiplier: 100.0, goldMultiplier: 100.0, unlockLevel: 100000 }
];

// Monster Scaling Following GDD Mathematical Progression
export const MONSTER_SCALING: MonsterScaling = {
  baseHP: 100,
  baseAttack: 10,
  baseDefense: 5,
  baseXP: 10,
  baseGold: 5,
  levelMultiplier: 1.1, // 10% increase per level
  bossMultiplier: 5.0   // Bosses are 5x stronger
};

// Experience Requirements with Exponential Growth to Level 400,000
export function getExperienceRequired(level: number): number {
  if (level <= 1) return 0;
  
  // Base XP requirement with exponential scaling
  const baseXP = 100;
  const scalingFactor = 1.05; // 5% increase per level
  
  // For very high levels, use logarithmic dampening to prevent overflow
  if (level > 10000) {
    return Math.floor(baseXP * Math.pow(scalingFactor, 10000) * Math.log(level / 10000 + 1) * 50);
  }
  
  return Math.floor(baseXP * Math.pow(scalingFactor, level - 1));
}

// Calculate monster stats based on zone and level
export function calculateMonsterStats(zoneId: number, level: number, isBoss: boolean = false): {
  hp: number;
  attack: number;
  defense: number;
  xp: number;
  gold: number;
} {
  const zoneData = ZONE_DATA.find(z => z.id === zoneId);
  const multiplier = zoneData?.monsterMultiplier || 1.0;
  const bossMultiplier = isBoss ? MONSTER_SCALING.bossMultiplier : 1.0;
  
  // Level-based scaling
  const levelScale = Math.pow(MONSTER_SCALING.levelMultiplier, level);
  
  return {
    hp: Math.floor(MONSTER_SCALING.baseHP * levelScale * multiplier * bossMultiplier),
    attack: Math.floor(MONSTER_SCALING.baseAttack * levelScale * multiplier * bossMultiplier),
    defense: Math.floor(MONSTER_SCALING.baseDefense * levelScale * multiplier * bossMultiplier),
    xp: Math.floor(MONSTER_SCALING.baseXP * levelScale * (zoneData?.xpMultiplier || 1.0) * bossMultiplier),
    gold: Math.floor(MONSTER_SCALING.baseGold * levelScale * (zoneData?.goldMultiplier || 1.0) * bossMultiplier)
  };
}

// Equipment stat calculation based on gear tier and level
export function calculateEquipmentStats(gearTier: number, level: number, equipmentType: string): {
  attack: number;
  defense: number;
  health: number;
  value: number;
} {
  const tier = GEAR_TIERS.find(t => t.id === gearTier);
  if (!tier) return { attack: 0, defense: 0, health: 0, value: 0 };
  
  const baseStat = 10;
  const levelScale = Math.pow(1.08, level); // 8% increase per level
  const tierMultiplier = tier.statMultiplier;
  
  // Different equipment types have different stat focuses
  const typeMultipliers = {
    weapon: { attack: 2.0, defense: 0.2, health: 0.1 },
    armor: { attack: 0.1, defense: 2.0, health: 1.0 },
    shield: { attack: 0.1, defense: 1.5, health: 0.5 },
    helmet: { attack: 0.2, defense: 1.0, health: 0.3 },
    boots: { attack: 0.3, defense: 0.8, health: 0.2 },
    gloves: { attack: 0.8, defense: 0.5, health: 0.2 },
    ring: { attack: 0.5, defense: 0.3, health: 0.7 },
    amulet: { attack: 0.6, defense: 0.4, health: 0.8 }
  };
  
  const typeMultiplier = typeMultipliers[equipmentType as keyof typeof typeMultipliers] || 
                        { attack: 0.5, defense: 0.5, health: 0.5 };
  
  return {
    attack: Math.floor(baseStat * levelScale * tierMultiplier * typeMultiplier.attack),
    defense: Math.floor(baseStat * levelScale * tierMultiplier * typeMultiplier.defense),
    health: Math.floor(baseStat * levelScale * tierMultiplier * typeMultiplier.health),
    value: Math.floor(baseStat * levelScale * tierMultiplier * 10)
  };
}

// Player stat calculation based on level
export function calculatePlayerStats(level: number): {
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
} {
  const baseHealth = 100;
  const baseAttack = 10;
  const baseDefense = 5;
  
  // Player stats scale more modestly than monster stats
  const healthScale = Math.pow(1.06, level); // 6% per level
  const attackScale = Math.pow(1.05, level);  // 5% per level
  const defenseScale = Math.pow(1.04, level); // 4% per level
  
  return {
    baseHealth: Math.floor(baseHealth * healthScale),
    baseAttack: Math.floor(baseAttack * attackScale),
    baseDefense: Math.floor(baseDefense * defenseScale)
  };
}

// Zone unlock requirements
export function isZoneUnlocked(zoneId: number, playerLevel: number): boolean {
  const zoneData = ZONE_DATA.find(z => z.id === zoneId);
  return zoneData ? playerLevel >= zoneData.unlockLevel : false;
}

// Combat damage calculation with critical hits
export function calculateDamage(attack: number, defense: number, isCritical: boolean = false): number {
  const baseDamage = Math.max(1, attack - defense);
  const criticalMultiplier = isCritical ? 2.0 : 1.0;
  const randomVariance = 0.8 + (Math.random() * 0.4); // 80-120% damage variance
  
  return Math.floor(baseDamage * criticalMultiplier * randomVariance);
}

// Critical hit chance (10% base chance from GDD)
export function rollCriticalHit(): boolean {
  return Math.random() < 0.1;
}