// Echo Item System Implementation
// Third procedural item type with unique resonance mechanics

export interface EchoItemType {
  id: string;
  name: string;
  archetype: 'Fighter' | 'Caster' | 'Both';
  equipSlot: string;
  primaryStat: 'WC' | 'SC' | 'AC';
  imagePath?: string; // Object storage paths for uploaded images
  baseResonance: number; // Echo-specific property
}

export interface EchoTier {
  tier: number; // Echo tier system (different from shadow tiers)
  tierName: string;
  statMultiplier: number;
  resonanceMultiplier: number;
  levelRequirement: number;
  qualityWeights: {
    normal: number;
    resonant: number;
    harmonic: number;
    transcendent: number;
  };
}

// Echo item types with object storage image paths
export const ECHO_ITEM_TYPES: Record<string, EchoItemType> = {
  // Fighter Weapons
  'echo_axe': {
    id: 'echo_axe',
    name: 'Echo Axe',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-axe.png',
    baseResonance: 15,
  },
  'echo_dagger': {
    id: 'echo_dagger',
    name: 'Echo Dagger',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-dagger.png',
    baseResonance: 12,
  },
  'echo_bow': {
    id: 'echo_bow',
    name: 'Echo Bow',
    archetype: 'Fighter',
    equipSlot: 'weapon1',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-bow.png',
    baseResonance: 18,
  },
  'echo_arrow': {
    id: 'echo_arrow',
    name: 'Echo Arrow',
    archetype: 'Fighter',
    equipSlot: 'weapon2',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-arrow.png',
    baseResonance: 8,
  },
  'echo_mace': {
    id: 'echo_mace',
    name: 'Echo Mace',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-mace.png',
    baseResonance: 16,
  },
  'echo_claws': {
    id: 'echo_claws',
    name: 'Echo Claws',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-claws.png',
    baseResonance: 14,
  },

  // Caster Weapons
  'echo_staff': {
    id: 'echo_staff',
    name: 'Echo Staff',
    archetype: 'Caster',
    equipSlot: 'weapon',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-staff.png',
    baseResonance: 20,
  },
  'echo_caster_offhand': {
    id: 'echo_caster_offhand',
    name: 'Echo Caster Off-hand',
    archetype: 'Caster',
    equipSlot: 'weapon2',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-caster-offhand.png',
    baseResonance: 12,
  },

  // Spells (Caster abilities)
  'echo_air_spell': {
    id: 'echo_air_spell',
    name: 'Echo Air Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-air-spell.png',
    baseResonance: 10,
  },
  'echo_arcane_spell': {
    id: 'echo_arcane_spell',
    name: 'Echo Arcane Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-arcane-spell.png',
    baseResonance: 15,
  },
  'echo_cold_spell': {
    id: 'echo_cold_spell',
    name: 'Echo Cold Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-cold-spell.png',
    baseResonance: 11,
  },
  'echo_death_spell': {
    id: 'echo_death_spell',
    name: 'Echo Death Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-death-spell.png',
    baseResonance: 18,
  },
  'echo_drain_spell': {
    id: 'echo_drain_spell',
    name: 'Echo Drain Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-drain-spell.png',
    baseResonance: 13,
  },
  'echo_earth_spell': {
    id: 'echo_earth_spell',
    name: 'Echo Earth Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-earth-spell.png',
    baseResonance: 14,
  },
  'echo_fire_spell': {
    id: 'echo_fire_spell',
    name: 'Echo Fire Spell',
    archetype: 'Caster',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-fire-spell.png',
    baseResonance: 16,
  },
  'echo_fighter_buff_spell': {
    id: 'echo_fighter_buff_spell',
    name: 'Echo Fighter Buff Spell',
    archetype: 'Both',
    equipSlot: 'spell',
    primaryStat: 'SC',
    imagePath: '/public-objects/echo-items/echo-fighter-buff-spell.png',
    baseResonance: 12,
  },

  // Armor (Both archetypes)
  'echo_boots': {
    id: 'echo_boots',
    name: 'Echo Boots',
    archetype: 'Both',
    equipSlot: 'boots',
    primaryStat: 'AC',
    imagePath: '/public-objects/echo-items/echo-boots.png',
    baseResonance: 8,
  },
  'echo_gloves': {
    id: 'echo_gloves',
    name: 'Echo Gloves',
    archetype: 'Both',
    equipSlot: 'gauntlets',
    primaryStat: 'AC',
    imagePath: '/public-objects/echo-items/echo-gloves.png',
    baseResonance: 10,
  },

  // Shields (Fighter only)
  'echo_shield': {
    id: 'echo_shield',
    name: 'Echo Shield',
    archetype: 'Fighter',
    equipSlot: 'shield',
    primaryStat: 'AC',
    imagePath: '/public-objects/echo-items/echo-shield.png',
    baseResonance: 15,
  },

  // Jewelry (Both archetypes)
  'echo_necklace': {
    id: 'echo_necklace',
    name: 'Echo Necklace',
    archetype: 'Both',
    equipSlot: 'amulet',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-necklace.png',
    baseResonance: 20,
  },
  'echo_ring': {
    id: 'echo_ring',
    name: 'Echo Ring',
    archetype: 'Both',
    equipSlot: 'ring',
    primaryStat: 'WC',
    imagePath: '/public-objects/echo-items/echo-ring.png',
    baseResonance: 15,
  },
};

// Echo tier progression (unique system)
export const ECHO_TIERS: EchoTier[] = [
  { tier: 1, tierName: 'Whisper', statMultiplier: 1.0, resonanceMultiplier: 1.0, levelRequirement: 1, qualityWeights: { normal: 80, resonant: 18, harmonic: 2, transcendent: 0 } },
  { tier: 2, tierName: 'Echo', statMultiplier: 1.6, resonanceMultiplier: 1.4, levelRequirement: 15, qualityWeights: { normal: 70, resonant: 25, harmonic: 5, transcendent: 0 } },
  { tier: 3, tierName: 'Resonance', statMultiplier: 2.5, resonanceMultiplier: 1.9, levelRequirement: 35, qualityWeights: { normal: 60, resonant: 30, harmonic: 10, transcendent: 0 } },
  { tier: 4, tierName: 'Harmony', statMultiplier: 4.0, resonanceMultiplier: 2.6, levelRequirement: 65, qualityWeights: { normal: 50, resonant: 35, harmonic: 14, transcendent: 1 } },
  { tier: 5, tierName: 'Symphony', statMultiplier: 6.4, resonanceMultiplier: 3.5, levelRequirement: 110, qualityWeights: { normal: 40, resonant: 38, harmonic: 20, transcendent: 2 } },
  { tier: 6, tierName: 'Crescendo', statMultiplier: 10.2, resonanceMultiplier: 4.7, levelRequirement: 180, qualityWeights: { normal: 30, resonant: 40, harmonic: 26, transcendent: 4 } },
  { tier: 7, tierName: 'Ovation', statMultiplier: 16.3, resonanceMultiplier: 6.3, levelRequirement: 280, qualityWeights: { normal: 22, resonant: 40, harmonic: 32, transcendent: 6 } },
  { tier: 8, tierName: 'Opus', statMultiplier: 26.1, resonanceMultiplier: 8.5, levelRequirement: 420, qualityWeights: { normal: 15, resonant: 38, harmonic: 38, transcendent: 9 } },
  { tier: 9, tierName: 'Magnum', statMultiplier: 41.8, resonanceMultiplier: 11.4, levelRequirement: 630, qualityWeights: { normal: 10, resonant: 35, harmonic: 43, transcendent: 12 } },
  { tier: 10, tierName: 'Transcendent', statMultiplier: 66.9, resonanceMultiplier: 15.4, levelRequirement: 950, qualityWeights: { normal: 6, resonant: 30, harmonic: 48, transcendent: 16 } },
];

// Quality multipliers for echo items (different from shadow items)
export const ECHO_QUALITY_MULTIPLIERS = {
  normal: 1.0,
  resonant: 1.4,
  harmonic: 1.9,
  transcendent: 2.6
};

// Calculate echo item stats based on type, tier, and quality
export function calculateEchoItemStats(itemTypeId: string, tier: number, quality: string): {
  weaponClass: number;
  spellClass: number;
  armorClass: number;
  resonance: number;
  value: number;
} {
  const itemType = ECHO_ITEM_TYPES[itemTypeId];
  const echoTier = ECHO_TIERS.find(t => t.tier === tier);
  const qualityMultiplier = ECHO_QUALITY_MULTIPLIERS[quality as keyof typeof ECHO_QUALITY_MULTIPLIERS] || 1.0;
  
  if (!itemType || !echoTier) {
    return { weaponClass: 0, spellClass: 0, armorClass: 0, resonance: 0, value: 0 };
  }

  const baseStat = 18; // Base stat value for echo items
  const baseValue = 200; // Base value for echo items
  const finalStat = Math.floor(baseStat * echoTier.statMultiplier * qualityMultiplier);
  const finalResonance = Math.floor(itemType.baseResonance * echoTier.resonanceMultiplier * qualityMultiplier);

  const stats = {
    weaponClass: itemType.primaryStat === 'WC' ? finalStat : 0,
    spellClass: itemType.primaryStat === 'SC' ? finalStat : 0,
    armorClass: itemType.primaryStat === 'AC' ? finalStat : 0,
    resonance: finalResonance,
    value: Math.floor(baseValue * echoTier.statMultiplier * qualityMultiplier)
  };

  // Jewelry gets mixed stats with higher resonance
  if (itemType.equipSlot === 'amulet' || itemType.equipSlot === 'ring') {
    const mixedStat = Math.floor(finalStat * 0.8);
    stats.weaponClass = mixedStat;
    stats.spellClass = mixedStat;
    stats.armorClass = Math.floor(mixedStat * 0.9);
    stats.resonance = Math.floor(finalResonance * 1.5); // Jewelry has higher resonance
  }

  return stats;
}

// Determine echo item quality based on tier weights
export function rollEchoQuality(tier: number): string {
  const echoTier = ECHO_TIERS.find(t => t.tier === tier);
  if (!echoTier) return 'normal';

  const weights = echoTier.qualityWeights;
  const total = weights.normal + weights.resonant + weights.harmonic + weights.transcendent;
  const roll = Math.random() * total;

  let current = 0;
  if (roll < (current += weights.normal)) return 'normal';
  if (roll < (current += weights.resonant)) return 'resonant';
  if (roll < (current += weights.harmonic)) return 'harmonic';
  return 'transcendent';
}

// Generate random echo item with resonance-based logic
export function generateRandomEchoItem(
  characterArchetype: 'Fighter' | 'Caster',
  characterLevel: number,
  currentResonance: number // Character's total resonance affects drops
): {
  itemType: string;
  tier: number;
  quality: string;
  equipSlot: string;
} {
  // Filter items by archetype compatibility
  const availableItems = Object.values(ECHO_ITEM_TYPES).filter(item => 
    item.archetype === characterArchetype || item.archetype === 'Both'
  );

  // Available tiers based on level and resonance
  const availableTiers = ECHO_TIERS.filter(tier => 
    characterLevel >= tier.levelRequirement &&
    currentResonance >= (tier.tier * 5) // Resonance requirement for tier access
  );

  if (availableTiers.length === 0) {
    // Fallback to lowest tier
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    return {
      itemType: randomItem.id,
      tier: 1,
      quality: rollEchoQuality(1),
      equipSlot: randomItem.equipSlot
    };
  }

  // Weight towards higher tiers based on resonance
  const resonanceBonus = Math.floor(currentResonance / 50);
  const weights = availableTiers.map((_, index) => Math.pow(1.3, index + resonanceBonus));
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
    quality: rollEchoQuality(selectedTier.tier),
    equipSlot: randomItem.equipSlot
  };
}

// Check if character can equip echo item tier
export function canEquipEchoTier(playerLevel: number, echoTier: number, characterResonance: number): boolean {
  const tier = ECHO_TIERS.find(t => t.tier === echoTier);
  if (!tier) return false;
  
  return playerLevel >= tier.levelRequirement && characterResonance >= (tier.tier * 5);
}

// Get echo item display name with tier and quality
export function getEchoItemDisplayName(itemTypeId: string, tier: number, quality: string): string {
  const itemType = ECHO_ITEM_TYPES[itemTypeId];
  const echoTier = ECHO_TIERS.find(t => t.tier === tier);
  
  if (!itemType || !echoTier) return 'Unknown Echo Item';
  
  const qualityPrefix = quality === 'normal' ? '' : `${quality.charAt(0).toUpperCase() + quality.slice(1)} `;
  return `${qualityPrefix}${echoTier.tierName} ${itemType.name}`;
}

// Get equipment requirements for echo item
export function getEchoItemRequirements(tier: number): {
  level: number;
  resonance: number;
  str?: number;
  dex?: number;
  vit?: number;
  ntl?: number;
  wis?: number;
} {
  const echoTier = ECHO_TIERS.find(t => t.tier === tier);
  if (!echoTier) return { level: 1, resonance: 0 };

  const statRequirement = Math.floor(tier * 4);
  
  return {
    level: echoTier.levelRequirement,
    resonance: tier * 5,
    str: statRequirement,
    dex: statRequirement,
    vit: statRequirement,
    ntl: statRequirement,
    wis: statRequirement
  };
}

// Calculate total character resonance from equipped echo items
export function calculateCharacterResonance(equippedEchoItems: Array<{
  resonance: number;
  quality: string;
}>): number {
  return equippedEchoItems.reduce((total, item) => {
    const qualityBonus = ECHO_QUALITY_MULTIPLIERS[item.quality as keyof typeof ECHO_QUALITY_MULTIPLIERS] || 1.0;
    return total + Math.floor(item.resonance * qualityBonus);
  }, 0);
}