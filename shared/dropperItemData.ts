// Dropper Item System Implementation
// Store-bought items with 20 gear tiers (Crude to Ascended)

export interface DropperItemType {
  id: string;
  name: string;
  archetype: 'Fighter' | 'Caster' | 'Both';
  equipSlot: string;
  primaryStat: 'WC' | 'SC' | 'AC';
  imagePath?: string;
  purchasePrice: number; // Base price for T1
}

export interface GearTier {
  tier: number; // 1-20
  tierName: string;
  statMultiplier: number;
  levelRequirement: number;
  priceMultiplier: number;
}

// Store-bought dropper items (same images for all 20 tiers)
export const DROPPER_ITEM_TYPES: Record<string, DropperItemType> = {
  // Fighter Weapons
  'dropper_sword': {
    id: 'dropper_sword',
    name: 'Dropper Sword',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    purchasePrice: 100,
  },
  'dropper_axe': {
    id: 'dropper_axe',
    name: 'Dropper Axe',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    purchasePrice: 120,
  },
  'dropper_mace': {
    id: 'dropper_mace',
    name: 'Dropper Mace',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    purchasePrice: 110,
  },
  'dropper_dagger': {
    id: 'dropper_dagger',
    name: 'Dropper Dagger',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    purchasePrice: 80,
  },
  'dropper_spear': {
    id: 'dropper_spear',
    name: 'Dropper Spear',
    archetype: 'Fighter',
    equipSlot: 'weapon',
    primaryStat: 'WC',
    purchasePrice: 90,
  },
  'dropper_bow': {
    id: 'dropper_bow',
    name: 'Dropper Bow',
    archetype: 'Fighter',
    equipSlot: 'weapon1',
    primaryStat: 'WC',
    purchasePrice: 130,
  },
  'dropper_arrow': {
    id: 'dropper_arrow',
    name: 'Dropper Arrow',
    archetype: 'Fighter',
    equipSlot: 'weapon2',
    primaryStat: 'WC',
    purchasePrice: 50,
    imagePath: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_2773.png',
  },

  // Caster Weapons
  'dropper_staff': {
    id: 'dropper_staff',
    name: 'Dropper Staff',
    archetype: 'Caster',
    equipSlot: 'weapon',
    primaryStat: 'SC',
    purchasePrice: 150,
  },
  'dropper_wand': {
    id: 'dropper_wand',
    name: 'Dropper Wand',
    archetype: 'Caster',
    equipSlot: 'weapon',
    primaryStat: 'SC',
    purchasePrice: 120,
  },
  'dropper_orb': {
    id: 'dropper_orb',
    name: 'Dropper Orb',
    archetype: 'Caster',
    equipSlot: 'weapon2',
    primaryStat: 'SC',
    purchasePrice: 100,
  },
  'dropper_tome': {
    id: 'dropper_tome',
    name: 'Dropper Tome',
    archetype: 'Caster',
    equipSlot: 'weapon2',
    primaryStat: 'SC',
    purchasePrice: 110,
  },

  // Armor (Both archetypes)
  'dropper_helmet': {
    id: 'dropper_helmet',
    name: 'Dropper Helmet',
    archetype: 'Both',
    equipSlot: 'helmet',
    primaryStat: 'AC',
    purchasePrice: 80,
  },
  'dropper_armor': {
    id: 'dropper_armor',
    name: 'Dropper Armor',
    archetype: 'Both',
    equipSlot: 'armor',
    primaryStat: 'AC',
    purchasePrice: 200,
  },
  'dropper_leggings': {
    id: 'dropper_leggings',
    name: 'Dropper Leggings',
    archetype: 'Both',
    equipSlot: 'leggings',
    primaryStat: 'AC',
    purchasePrice: 120,
  },
  'dropper_boots': {
    id: 'dropper_boots',
    name: 'Dropper Boots',
    archetype: 'Both',
    equipSlot: 'boots',
    primaryStat: 'AC',
    purchasePrice: 60,
  },
  'dropper_gauntlets': {
    id: 'dropper_gauntlets',
    name: 'Dropper Gauntlets',
    archetype: 'Both',
    equipSlot: 'gauntlets',
    primaryStat: 'AC',
    purchasePrice: 70,
  },

  // Shields (Fighter only)
  'dropper_shield': {
    id: 'dropper_shield',
    name: 'Dropper Shield',
    archetype: 'Fighter',
    equipSlot: 'shield',
    primaryStat: 'AC',
    purchasePrice: 100,
  },

  // Jewelry (Both archetypes)
  'dropper_amulet': {
    id: 'dropper_amulet',
    name: 'Dropper Amulet',
    archetype: 'Both',
    equipSlot: 'amulet',
    primaryStat: 'WC',
    purchasePrice: 150,
  },
  'dropper_ring': {
    id: 'dropper_ring',
    name: 'Dropper Ring',
    archetype: 'Both',
    equipSlot: 'ring',
    primaryStat: 'WC',
    purchasePrice: 120,
  },
};

// 20 gear tiers with exponential progression (Crude to Ascended)
export const GEAR_TIERS: GearTier[] = [
  { tier: 1, tierName: 'Crude', statMultiplier: 1.0, levelRequirement: 1, priceMultiplier: 1.0 },
  { tier: 2, tierName: 'Basic', statMultiplier: 1.5, levelRequirement: 5, priceMultiplier: 1.8 },
  { tier: 3, tierName: 'Common', statMultiplier: 2.2, levelRequirement: 12, priceMultiplier: 3.2 },
  { tier: 4, tierName: 'Sturdy', statMultiplier: 3.3, levelRequirement: 22, priceMultiplier: 5.7 },
  { tier: 5, tierName: 'Quality', statMultiplier: 4.9, levelRequirement: 35, priceMultiplier: 10.3 },
  { tier: 6, tierName: 'Superior', statMultiplier: 7.3, levelRequirement: 52, priceMultiplier: 18.5 },
  { tier: 7, tierName: 'Excellent', statMultiplier: 10.9, levelRequirement: 75, priceMultiplier: 33.3 },
  { tier: 8, tierName: 'Masterwork', statMultiplier: 16.3, levelRequirement: 105, priceMultiplier: 60.0 },
  { tier: 9, tierName: 'Artisan', statMultiplier: 24.4, levelRequirement: 145, priceMultiplier: 108.0 },
  { tier: 10, tierName: 'Expert', statMultiplier: 36.6, levelRequirement: 200, priceMultiplier: 194.4 },
  { tier: 11, tierName: 'Master', statMultiplier: 54.9, levelRequirement: 270, priceMultiplier: 349.9 },
  { tier: 12, tierName: 'Grandmaster', statMultiplier: 82.4, levelRequirement: 360, priceMultiplier: 629.8 },
  { tier: 13, tierName: 'Legendary', statMultiplier: 123.5, levelRequirement: 480, priceMultiplier: 1133.6 },
  { tier: 14, tierName: 'Mythic', statMultiplier: 185.3, levelRequirement: 640, priceMultiplier: 2040.5 },
  { tier: 15, tierName: 'Divine', statMultiplier: 278.0, levelRequirement: 850, priceMultiplier: 3672.9 },
  { tier: 16, tierName: 'Celestial', statMultiplier: 417.0, levelRequirement: 1120, priceMultiplier: 6611.2 },
  { tier: 17, tierName: 'Transcendent', statMultiplier: 625.5, levelRequirement: 1460, priceMultiplier: 11900.2 },
  { tier: 18, tierName: 'Eternal', statMultiplier: 938.2, levelRequirement: 1900, priceMultiplier: 21420.4 },
  { tier: 19, tierName: 'Infinite', statMultiplier: 1407.3, levelRequirement: 2450, priceMultiplier: 38556.7 },
  { tier: 20, tierName: 'Ascended', statMultiplier: 2111.0, levelRequirement: 3200, priceMultiplier: 69402.1 },
];

// Calculate dropper item stats based on type and tier
export function calculateDropperItemStats(itemTypeId: string, tier: number): {
  weaponClass: number;
  spellClass: number;
  armorClass: number;
  purchasePrice: number;
} {
  const itemType = DROPPER_ITEM_TYPES[itemTypeId];
  const gearTier = GEAR_TIERS.find(t => t.tier === tier);
  
  if (!itemType || !gearTier) {
    return { weaponClass: 0, spellClass: 0, armorClass: 0, purchasePrice: 0 };
  }

  const baseStat = 12; // Base stat for T1 dropper items
  const finalStat = Math.floor(baseStat * gearTier.statMultiplier);
  const finalPrice = Math.floor(itemType.purchasePrice * gearTier.priceMultiplier);

  const stats = {
    weaponClass: itemType.primaryStat === 'WC' ? finalStat : 0,
    spellClass: itemType.primaryStat === 'SC' ? finalStat : 0,
    armorClass: itemType.primaryStat === 'AC' ? finalStat : 0,
    purchasePrice: finalPrice
  };

  // Jewelry gets mixed stats
  if (itemType.equipSlot === 'amulet' || itemType.equipSlot === 'ring') {
    const mixedStat = Math.floor(finalStat * 0.6);
    stats.weaponClass = mixedStat;
    stats.spellClass = mixedStat;
    stats.armorClass = Math.floor(mixedStat * 0.7);
  }

  return stats;
}

// Get dropper item display name with tier
export function getDropperItemDisplayName(itemTypeId: string, tier: number): string {
  const itemType = DROPPER_ITEM_TYPES[itemTypeId];
  const gearTier = GEAR_TIERS.find(t => t.tier === tier);
  
  if (!itemType || !gearTier) return 'Unknown Dropper Item';
  
  return `${gearTier.tierName} ${itemType.name}`;
}

// Check if character can equip dropper item tier
export function canEquipDropperTier(playerLevel: number, tier: number): boolean {
  const gearTier = GEAR_TIERS.find(t => t.tier === tier);
  return gearTier ? playerLevel >= gearTier.levelRequirement : false;
}

// Get equipment requirements for dropper item
export function getDropperItemRequirements(tier: number): {
  level: number;
  str?: number;
  dex?: number;
  vit?: number;
  ntl?: number;
  wis?: number;
} {
  const gearTier = GEAR_TIERS.find(t => t.tier === tier);
  if (!gearTier) return { level: 1 };

  // Basic requirements scale with tier
  const statRequirement = Math.floor(tier * 3);
  
  return {
    level: gearTier.levelRequirement,
    str: statRequirement,
    dex: statRequirement,
    vit: statRequirement,
    ntl: statRequirement,
    wis: statRequirement
  };
}

// Get available dropper items for character archetype
export function getAvailableDropperItems(characterArchetype: 'Fighter' | 'Caster'): DropperItemType[] {
  return Object.values(DROPPER_ITEM_TYPES).filter(item => 
    item.archetype === characterArchetype || item.archetype === 'Both'
  );
}

// Get store inventory for specific tier and archetype
export function getStoreInventory(characterArchetype: 'Fighter' | 'Caster', maxTier: number): Array<{
  itemType: DropperItemType;
  tier: number;
  price: number;
  stats: ReturnType<typeof calculateDropperItemStats>;
}> {
  const availableItems = getAvailableDropperItems(characterArchetype);
  const inventory: Array<{
    itemType: DropperItemType;
    tier: number;
    price: number;
    stats: ReturnType<typeof calculateDropperItemStats>;
  }> = [];

  // Add items for each tier up to maxTier
  for (let tier = 1; tier <= Math.min(maxTier, 20); tier++) {
    availableItems.forEach(itemType => {
      const stats = calculateDropperItemStats(itemType.id, tier);
      inventory.push({
        itemType,
        tier,
        price: stats.purchasePrice,
        stats
      });
    });
  }

  return inventory.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.itemType.equipSlot.localeCompare(b.itemType.equipSlot);
  });
}