// Shadow Item System Implementation
// Based on GDD specifications with T1-T20 tiers and equipment-based drop logic

export interface ShadowItemType {
  id: string;
  name: string;
  archetype: 'Fighter' | 'Caster' | 'Both';
  equipSlot: string;
  primaryStat: 'WC' | 'SC' | 'AC'; // Weapon Class, Spell Class, Armor Class
  imagePath?: string; // Same image used for all tiers T1-T20
}

export interface ShadowTier {
  tier: number; // 1-20 (T1-T20)
  tierName: string;
  statMultiplier: number;
  levelRequirement: number;
  qualityWeights: {
    normal: number;
    enhanced: number;
    superior: number;
    legendary: number;
  };
}

// Base shadow item types from GDD with GitHub image URLs
export const SHADOW_ITEM_TYPES: Record<string, ShadowItemType> = {
  // Fighter Weapons
  'shadow_sword': {
    id: 'shadow_sword',
    name: 'Shadow Sword',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20sword%20weapon.PNG',
  },
  'shadow_axe': {
    id: 'shadow_axe',
    name: 'Shadow Axe',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Axe%20Weapon.PNG',
  },
  'shadow_mace': {
    id: 'shadow_mace',
    name: 'Shadow Mace',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Mace%20weapon.PNG',
  },
  'shadow_dagger': {
    id: 'shadow_dagger',
    name: 'Shadow Dagger',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20dagger%20weapon.PNG',
  },
  'shadow_claw': {
    id: 'shadow_claw',
    name: 'Shadow Claw',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Claw%20Weapon.PNG',
  },
  'shadow_bow': {
    id: 'shadow_bow',
    name: 'Shadow Bow',
    archetype: 'Fighter',
    equipSlot: 'weapon1',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Bow%20Weapon.PNG',
  },
  'shadow_arrow': {
    id: 'shadow_arrow',
    name: 'Shadow Arrow',
    archetype: 'Fighter',
    equipSlot: 'weapon2',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Arrow.PNG',
  },
  'shadow_fighter_staff': {
    id: 'shadow_fighter_staff',
    name: 'Shadow Fighter Staff',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Fighter%20Staff%20weapon.PNG',
  },

  // Caster Weapons
  'shadow_caster_staff': {
    id: 'shadow_caster_staff',
    name: 'Shadow Caster Staff',
    archetype: 'Caster',
    equipSlot: 'weapon',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Caster%20Staff.PNG',
  },
  'shadow_caster_offhand': {
    id: 'shadow_caster_offhand',
    name: 'Shadow Caster Off-hand',
    archetype: 'Caster',
    equipSlot: 'weapon2',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Caster%20Off%20hand%20weapon.PNG',
  },

  // Spells (Caster abilities)
  'shadow_air_spell': {
    id: 'shadow_air_spell',
    name: 'Shadow Air Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Air%20Spell.PNG',
  },
  'shadow_arcane_spell': {
    id: 'shadow_arcane_spell',
    name: 'Shadow Arcane Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Arcane%20Spell.PNG',
  },
  'shadow_cold_spell': {
    id: 'shadow_cold_spell',
    name: 'Shadow Cold Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Cold%20Spell.PNG',
  },
  'shadow_death_spell': {
    id: 'shadow_death_spell',
    name: 'Shadow Death Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Death%20Spell.PNG',
  },
  'shadow_drain_spell': {
    id: 'shadow_drain_spell',
    name: 'Shadow Drain Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Drain%20Spell.PNG',
  },
  'shadow_earth_spell': {
    id: 'shadow_earth_spell',
    name: 'Shadow Earth Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Earth%20Spell.PNG',
  },
  'shadow_fire_spell': {
    id: 'shadow_fire_spell',
    name: 'Shadow Fire Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Fire%20Spell.PNG',
  },
  'shadow_fighter_buff_spell': {
    id: 'shadow_fighter_buff_spell',
    name: 'Shadow Fighter Buff Spell',
    archetype: 'Both',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20fighter%20Buff%20Spell.PNG',
  },

  // Armor (Both archetypes)
  'shadow_helmet': {
    id: 'shadow_helmet',
    name: 'Shadow Helmet',
    archetype: 'Both',
    equipSlot: 'helmet',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20helmet.PNG',
  },
  'shadow_armor': {
    id: 'shadow_armor',
    name: 'Shadow Armor',
    archetype: 'Both',
    equipSlot: 'armor',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20chest%20Armor.PNG',
  },
  'shadow_leggings': {
    id: 'shadow_leggings',
    name: 'Shadow Leggings',
    archetype: 'Both',
    equipSlot: 'leggings',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Leggings%20.PNG',
  },
  'shadow_boots': {
    id: 'shadow_boots',
    name: 'Shadow Boots',
    archetype: 'Both',
    equipSlot: 'boots',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Boot%201.PNG',
  },
  'shadow_boots_alt': {
    id: 'shadow_boots_alt',
    name: 'Shadow Boots (Alt)',
    archetype: 'Both',
    equipSlot: 'boots',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Boot%202.PNG',
  },
  'shadow_gauntlets': {
    id: 'shadow_gauntlets',
    name: 'Shadow Gauntlets',
    archetype: 'Both',
    equipSlot: 'gauntlets',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20gauntlets%20.PNG',
  },

  // Shields (Fighter only)
  'shadow_shield': {
    id: 'shadow_shield',
    name: 'Shadow Shield',
    archetype: 'Fighter',
    equipSlot: 'shield',
    primaryStat: 'AC',
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Shield%20.PNG',
  },

  // Jewelry (Both archetypes)
  'shadow_necklace': {
    id: 'shadow_necklace',
    name: 'Shadow Necklace',
    archetype: 'Both',
    equipSlot: 'amulet',
    primaryStat: 'WC', // Mixed stats
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Necklace.PNG',
  },
  'shadow_ring': {
    id: 'shadow_ring',
    name: 'Shadow Ring',
    archetype: 'Both',
    equipSlot: 'ring',
    primaryStat: 'WC', // Mixed stats
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/Shadow%20Ring.PNG',
  },
};

// Shadow tier progression T1-T20
export const SHADOW_TIERS: ShadowTier[] = [
  { tier: 1, tierName: 'T1', statMultiplier: 1.0, levelRequirement: 1, qualityWeights: { normal: 70, enhanced: 25, superior: 5, legendary: 0 } },
  { tier: 2, tierName: 'T2', statMultiplier: 1.4, levelRequirement: 5, qualityWeights: { normal: 65, enhanced: 30, superior: 5, legendary: 0 } },
  { tier: 3, tierName: 'T3', statMultiplier: 1.9, levelRequirement: 10, qualityWeights: { normal: 60, enhanced: 32, superior: 8, legendary: 0 } },
  { tier: 4, tierName: 'T4', statMultiplier: 2.6, levelRequirement: 18, qualityWeights: { normal: 55, enhanced: 33, superior: 12, legendary: 0 } },
  { tier: 5, tierName: 'T5', statMultiplier: 3.5, levelRequirement: 28, qualityWeights: { normal: 50, enhanced: 35, superior: 15, legendary: 0 } },
  { tier: 6, tierName: 'T6', statMultiplier: 4.7, levelRequirement: 40, qualityWeights: { normal: 45, enhanced: 35, superior: 18, legendary: 2 } },
  { tier: 7, tierName: 'T7', statMultiplier: 6.3, levelRequirement: 55, qualityWeights: { normal: 40, enhanced: 35, superior: 22, legendary: 3 } },
  { tier: 8, tierName: 'T8', statMultiplier: 8.4, levelRequirement: 75, qualityWeights: { normal: 35, enhanced: 35, superior: 25, legendary: 5 } },
  { tier: 9, tierName: 'T9', statMultiplier: 11.2, levelRequirement: 100, qualityWeights: { normal: 30, enhanced: 35, superior: 28, legendary: 7 } },
  { tier: 10, tierName: 'T10', statMultiplier: 14.9, levelRequirement: 130, qualityWeights: { normal: 25, enhanced: 35, superior: 30, legendary: 10 } },
  { tier: 11, tierName: 'T11', statMultiplier: 19.8, levelRequirement: 170, qualityWeights: { normal: 20, enhanced: 35, superior: 32, legendary: 13 } },
  { tier: 12, tierName: 'T12', statMultiplier: 26.3, levelRequirement: 220, qualityWeights: { normal: 15, enhanced: 35, superior: 35, legendary: 15 } },
  { tier: 13, tierName: 'T13', statMultiplier: 34.9, levelRequirement: 280, qualityWeights: { normal: 12, enhanced: 33, superior: 37, legendary: 18 } },
  { tier: 14, tierName: 'T14', statMultiplier: 46.4, levelRequirement: 360, qualityWeights: { normal: 10, enhanced: 30, superior: 40, legendary: 20 } },
  { tier: 15, tierName: 'T15', statMultiplier: 61.6, levelRequirement: 460, qualityWeights: { normal: 8, enhanced: 27, superior: 42, legendary: 23 } },
  { tier: 16, tierName: 'T16', statMultiplier: 81.8, levelRequirement: 600, qualityWeights: { normal: 6, enhanced: 24, superior: 45, legendary: 25 } },
  { tier: 17, tierName: 'T17', statMultiplier: 108.6, levelRequirement: 780, qualityWeights: { normal: 5, enhanced: 20, superior: 47, legendary: 28 } },
  { tier: 18, tierName: 'T18', statMultiplier: 144.2, levelRequirement: 1000, qualityWeights: { normal: 4, enhanced: 16, superior: 50, legendary: 30 } },
  { tier: 19, tierName: 'T19', statMultiplier: 191.5, levelRequirement: 1300, qualityWeights: { normal: 3, enhanced: 12, superior: 52, legendary: 33 } },
  { tier: 20, tierName: 'T20', statMultiplier: 254.0, levelRequirement: 1700, qualityWeights: { normal: 2, enhanced: 8, superior: 55, legendary: 35 } },
];

// Quality multipliers for item stats
export const QUALITY_MULTIPLIERS = {
  normal: 1.0,
  enhanced: 1.3,
  superior: 1.7,
  legendary: 2.2
};

// Calculate shadow item stats based on type, tier, and quality
export function calculateShadowItemStats(itemTypeId: string, tier: number, quality: string): {
  weaponClass: number;
  spellClass: number;
  armorClass: number;
  sockets: number;
  value: number;
} {
  const itemType = SHADOW_ITEM_TYPES[itemTypeId];
  const shadowTier = SHADOW_TIERS.find(t => t.tier === tier);
  const qualityMultiplier = QUALITY_MULTIPLIERS[quality as keyof typeof QUALITY_MULTIPLIERS] || 1.0;
  
  if (!itemType || !shadowTier) {
    return { weaponClass: 0, spellClass: 0, armorClass: 0, sockets: 0, value: 0 };
  }

  const baseStat = 15; // Base stat value
  const baseValue = 100; // Base item value
  const finalStat = Math.floor(baseStat * shadowTier.statMultiplier * qualityMultiplier);

  // Determine sockets based on tier and quality
  let sockets = 0;
  if (tier >= 5) sockets = 1; // T5+ gets 1 socket
  if (tier >= 10) sockets = 2; // T10+ gets 2 sockets
  if (tier >= 15) sockets = 3; // T15+ gets 3 sockets
  if (quality === 'legendary') sockets += 1; // Legendary gets +1 socket

  const stats = {
    weaponClass: itemType.primaryStat === 'WC' ? finalStat : 0,
    spellClass: itemType.primaryStat === 'SC' ? finalStat : 0,
    armorClass: itemType.primaryStat === 'AC' ? finalStat : 0,
    sockets,
    value: Math.floor(baseValue * shadowTier.statMultiplier * qualityMultiplier)
  };

  // Jewelry gets mixed stats
  if (itemType.equipSlot === 'amulet' || itemType.equipSlot === 'ring') {
    const mixedStat = Math.floor(finalStat * 0.7);
    stats.weaponClass = mixedStat;
    stats.spellClass = mixedStat;
    stats.armorClass = Math.floor(mixedStat * 0.8);
  }

  return stats;
}

// Determine item quality based on tier weights
export function rollItemQuality(tier: number): string {
  const shadowTier = SHADOW_TIERS.find(t => t.tier === tier);
  if (!shadowTier) return 'normal';

  const weights = shadowTier.qualityWeights;
  const total = weights.normal + weights.enhanced + weights.superior + weights.legendary;
  const roll = Math.random() * total;

  let current = 0;
  if (roll < (current += weights.normal)) return 'normal';
  if (roll < (current += weights.enhanced)) return 'enhanced';
  if (roll < (current += weights.superior)) return 'superior';
  return 'legendary';
}

// Get equipment-based drop tiers for intelligent drop system
export function getAvailableDropTiers(equippedItems: Record<string, any>): { min: number; max: number } {
  let minTier = 1;
  let maxTier = 1;

  // Find the highest tier equipped across all equipment
  Object.values(equippedItems).forEach(item => {
    if (item && item.shadowTier) {
      maxTier = Math.max(maxTier, item.shadowTier);
      // Allow drops from 2 tiers below up to 1 tier above equipped gear
      minTier = Math.max(1, item.shadowTier - 2);
    }
  });

  // Allow drops up to 1 tier above highest equipped
  maxTier = Math.min(20, maxTier + 1);

  return { min: minTier, max: maxTier };
}

// Generate random shadow item based on character archetype and equipped gear
export function generateRandomShadowItem(
  characterArchetype: 'Fighter' | 'Caster',
  equippedItems: Record<string, any>,
  zoneId: number,
  playerLevel: number
): {
  itemType: string;
  tier: number;
  quality: string;
  equipSlot: string;
} {
  // Filter items by archetype compatibility
  const availableItems = Object.values(SHADOW_ITEM_TYPES).filter(item => 
    item.archetype === characterArchetype || item.archetype === 'Both'
  );

  // Get available tier range based on equipped gear
  const tierRange = getAvailableDropTiers(equippedItems);
  
  // Filter tiers by level requirement and available range
  const availableTiers = SHADOW_TIERS.filter(tier => 
    tier.tier >= tierRange.min && 
    tier.tier <= tierRange.max &&
    playerLevel >= tier.levelRequirement
  );

  if (availableTiers.length === 0) {
    // Fallback to T1 if no suitable tiers
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    return {
      itemType: randomItem.id,
      tier: 1,
      quality: rollItemQuality(1),
      equipSlot: randomItem.equipSlot
    };
  }

  // Weight towards higher tiers but with some variance
  const weights = availableTiers.map((_, index) => Math.pow(1.5, index));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let weightSum = 0;
  let selectedTier = availableTiers[0];
  
  for (let i = 0; i < availableTiers.length; i++) {
    weightSum += weights[i];
    if (random <= weightSum) {
      selectedTier = availableTiers[i];
      break;
    }
  }

  const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];

  return {
    itemType: randomItem.id,
    tier: selectedTier.tier,
    quality: rollItemQuality(selectedTier.tier),
    equipSlot: randomItem.equipSlot
  };
}

// Check if character can equip shadow item tier
export function canEquipShadowTier(playerLevel: number, shadowTier: number): boolean {
  const tier = SHADOW_TIERS.find(t => t.tier === shadowTier);
  return tier ? playerLevel >= tier.levelRequirement : false;
}

// Get shadow item display name with tier and quality
export function getShadowItemDisplayName(itemTypeId: string, tier: number, quality: string): string {
  const itemType = SHADOW_ITEM_TYPES[itemTypeId];
  const shadowTier = SHADOW_TIERS.find(t => t.tier === tier);
  
  if (!itemType || !shadowTier) return 'Unknown Shadow Item';
  
  const qualityPrefix = quality === 'normal' ? '' : `${quality.charAt(0).toUpperCase() + quality.slice(1)} `;
  return `${qualityPrefix}${shadowTier.tierName} ${itemType.name}`;
}

// Get equipment requirements for shadow item
export function getShadowItemRequirements(tier: number): {
  level: number;
  str?: number;
  dex?: number;
  vit?: number;
  ntl?: number;
  wis?: number;
} {
  const shadowTier = SHADOW_TIERS.find(t => t.tier === tier);
  if (!shadowTier) return { level: 1 };

  // Basic requirements scale with tier
  const statRequirement = Math.floor(tier * 2.5);
  
  return {
    level: shadowTier.levelRequirement,
    str: statRequirement,
    dex: statRequirement,
    vit: statRequirement,
    ntl: statRequirement,
    wis: statRequirement
  };
}