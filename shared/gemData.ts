// Comprehensive Gem System Implementation
// Based on GDD specifications with T1-T9 grades and zone-based drops

export interface GemType {
  id: string;
  name: string;
  category: 'Fighter' | 'Caster' | 'Utility' | 'Farming';
  primaryStat: string;
  description: string;
  imagePath?: string; // Same image used for all grades T1-T9
}

export interface GemGrade {
  grade: number; // 1-9 (T1-T9)
  tierName: string;
  statMultiplier: number;
  levelRequirement: number;
  zoneDropRange: { min: number; max: number };
}

// Complete gem type definitions from GDD
export const GEM_TYPES: Record<string, GemType> = {
  // Fighter Gems
  'warstone': {
    id: 'warstone',
    name: 'Warstone',
    category: 'Fighter',
    primaryStat: 'STR',
    description: 'Increases physical damage and weapon effectiveness',
  },
  'warheart': {
    id: 'warheart',
    name: 'Warheart',
    category: 'Fighter',
    primaryStat: 'STR',
    description: 'Enhances combat prowess and battle fury',
  },
  'agilite': {
    id: 'agilite',
    name: 'Agilite',
    category: 'Fighter',
    primaryStat: 'DEX',
    description: 'Improves accuracy and critical hit chance',
  },
  'mightstone': {
    id: 'mightstone',
    name: 'Mightstone',
    category: 'Fighter',
    primaryStat: 'STR',
    description: 'Raw physical power amplification',
  },
  'vigorite': {
    id: 'vigorite',
    name: 'Vigorite',
    category: 'Fighter',
    primaryStat: 'VIT',
    description: 'Enhances health and defensive capabilities',
  },
  'cripplite': {
    id: 'cripplite',
    name: 'Cripplite',
    category: 'Fighter',
    primaryStat: 'debuff',
    description: 'Weakens enemy defenses',
  },
  'weakstone': {
    id: 'weakstone',
    name: 'Weakstone',
    category: 'Fighter',
    primaryStat: 'debuff',
    description: 'Reduces enemy attack power',
  },
  'debilitate': {
    id: 'debilitate',
    name: 'Debilitate',
    category: 'Fighter',
    primaryStat: 'debuff',
    description: 'General enemy weakening effects',
  },
  'siphilite': {
    id: 'siphilite',
    name: 'Siphilite',
    category: 'Fighter',
    primaryStat: 'drain',
    description: 'Drains enemy vitality',
  },
  'sapstone': {
    id: 'sapstone',
    name: 'Sapstone',
    category: 'Fighter',
    primaryStat: 'drain',
    description: 'Saps enemy strength',
  },
  'syphonite': {
    id: 'syphonite',
    name: 'Syphonite',
    category: 'Fighter',
    primaryStat: 'drain',
    description: 'Siphons enemy power',
  },

  // Caster Gems
  'lorestone': {
    id: 'lorestone',
    name: 'Lorestone',
    category: 'Caster',
    primaryStat: 'NTL',
    description: 'Increases magical knowledge and spell power',
  },
  'loreheart': {
    id: 'loreheart',
    name: 'Loreheart',
    category: 'Caster',
    primaryStat: 'NTL',
    description: 'Core of magical wisdom and power',
  },
  'mindrite': {
    id: 'mindrite',
    name: 'Mindrite',
    category: 'Caster',
    primaryStat: 'WIS',
    description: 'Enhances mental acuity and magical accuracy',
  },
  'mindstone': {
    id: 'mindstone',
    name: 'Mindstone',
    category: 'Caster',
    primaryStat: 'WIS',
    description: 'Focuses mental energy for precise casting',
  },
  'sagerite': {
    id: 'sagerite',
    name: 'Sagerite',
    category: 'Caster',
    primaryStat: 'NTL',
    description: 'Wisdom of ancient mages',
  },
  'dullrite': {
    id: 'dullrite',
    name: 'Dullrite',
    category: 'Caster',
    primaryStat: 'debuff',
    description: 'Dulls enemy magical resistance',
  },
  'dullstone': {
    id: 'dullstone',
    name: 'Dullstone',
    category: 'Caster',
    primaryStat: 'debuff',
    description: 'Reduces enemy mental defenses',
  },
  'drowseite': {
    id: 'drowseite',
    name: 'Drowseite',
    category: 'Caster',
    primaryStat: 'debuff',
    description: 'Induces magical lethargy in enemies',
  },
  'drainrite': {
    id: 'drainrite',
    name: 'Drainrite',
    category: 'Caster',
    primaryStat: 'drain',
    description: 'Drains enemy magical energy',
  },
  'drawstone': {
    id: 'drawstone',
    name: 'Drawstone',
    category: 'Caster',
    primaryStat: 'drain',
    description: 'Draws power from enemy casters',
  },
  'leechrite': {
    id: 'leechrite',
    name: 'Leechrite',
    category: 'Caster',
    primaryStat: 'drain',
    description: 'Leeches magical essence from foes',
  },

  // Utility Gems
  'obsidian_heart': {
    id: 'obsidian_heart',
    name: 'Obsidian Heart',
    category: 'Utility',
    primaryStat: 'defense',
    description: 'Provides exceptional defensive protection',
  },
  'spike_core': {
    id: 'spike_core',
    name: 'Spike Core',
    category: 'Utility',
    primaryStat: 'counter',
    description: 'Reflects damage back to attackers',
  },
  'true_core': {
    id: 'true_core',
    name: 'True Core',
    category: 'Utility',
    primaryStat: 'accuracy',
    description: 'Ensures attacks always hit their mark',
  },
  'veil_core': {
    id: 'veil_core',
    name: 'Veil Core',
    category: 'Utility',
    primaryStat: 'stealth',
    description: 'Provides concealment and evasion',
  },
  'vital_core': {
    id: 'vital_core',
    name: 'Vital Core',
    category: 'Utility',
    primaryStat: 'healing',
    description: 'Regenerates health over time',
  },
  'blood_core': {
    id: 'blood_core',
    name: 'Blood Core',
    category: 'Utility',
    primaryStat: 'lifesteal',
    description: 'Converts damage dealt into health',
  },
  'flame_core': {
    id: 'flame_core',
    name: 'Flame Core',
    category: 'Utility',
    primaryStat: 'elemental',
    description: 'Adds fire damage to attacks',
  },
  'echoing_core': {
    id: 'echoing_core',
    name: 'Echoing Core',
    category: 'Utility',
    primaryStat: 'amplify',
    description: 'Amplifies all other gem effects',
  },

  // Farming Gems
  'treasure_core': {
    id: 'treasure_core',
    name: 'Treasure Core',
    category: 'Farming',
    primaryStat: 'gold_find',
    description: 'Increases gold drops from defeated enemies',
  },
  'ascend_core': {
    id: 'ascend_core',
    name: 'Ascend Core',
    category: 'Farming',
    primaryStat: 'experience',
    description: 'Boosts experience gain from all sources',
  },
  'midas_core': {
    id: 'midas_core',
    name: 'Midas Core',
    category: 'Farming',
    primaryStat: 'gold_find',
    description: 'Legendary gold multiplication effect',
  },
  'masterwork_core': {
    id: 'masterwork_core',
    name: 'Masterwork Core',
    category: 'Farming',
    primaryStat: 'quality',
    description: 'Improves quality of item drops',
  },
  'harvester_core': {
    id: 'harvester_core',
    name: 'Harvester Core',
    category: 'Farming',
    primaryStat: 'drop_rate',
    description: 'Increases overall item drop rates',
  },
};

// Gem grade progression T1-T9
export const GEM_GRADES: GemGrade[] = [
  { grade: 1, tierName: 'T1', statMultiplier: 1.0, levelRequirement: 1, zoneDropRange: { min: 1, max: 10 } },
  { grade: 2, tierName: 'T2', statMultiplier: 1.5, levelRequirement: 10, zoneDropRange: { min: 8, max: 20 } },
  { grade: 3, tierName: 'T3', statMultiplier: 2.2, levelRequirement: 25, zoneDropRange: { min: 18, max: 35 } },
  { grade: 4, tierName: 'T4', statMultiplier: 3.2, levelRequirement: 50, zoneDropRange: { min: 30, max: 50 } },
  { grade: 5, tierName: 'T5', statMultiplier: 4.7, levelRequirement: 100, zoneDropRange: { min: 45, max: 65 } },
  { grade: 6, tierName: 'T6', statMultiplier: 6.8, levelRequirement: 200, zoneDropRange: { min: 60, max: 80 } },
  { grade: 7, tierName: 'T7', statMultiplier: 9.8, levelRequirement: 500, zoneDropRange: { min: 75, max: 90 } },
  { grade: 8, tierName: 'T8', statMultiplier: 14.2, levelRequirement: 1000, zoneDropRange: { min: 85, max: 98 } },
  { grade: 9, tierName: 'T9', statMultiplier: 20.5, levelRequirement: 2500, zoneDropRange: { min: 95, max: 101 } },
];

// Calculate gem stats based on type and grade
export function calculateGemStats(gemTypeId: string, grade: number): {
  primaryBonus: number;
  secondaryBonus: number;
  value: number;
} {
  const gemType = GEM_TYPES[gemTypeId];
  const gemGrade = GEM_GRADES.find(g => g.grade === grade);
  
  if (!gemType || !gemGrade) {
    return { primaryBonus: 0, secondaryBonus: 0, value: 0 };
  }

  const basePrimaryBonus = 10; // Base stat bonus
  const baseValue = 50; // Base gem value

  return {
    primaryBonus: Math.floor(basePrimaryBonus * gemGrade.statMultiplier),
    secondaryBonus: Math.floor(basePrimaryBonus * gemGrade.statMultiplier * 0.3), // 30% of primary
    value: Math.floor(baseValue * gemGrade.statMultiplier * 2)
  };
}

// Determine appropriate gem grade for zone drop
export function getGemGradeForZone(zoneId: number, playerLevel: number): number {
  // Find the highest grade that the zone can drop and player can use
  const availableGrades = GEM_GRADES.filter(grade => 
    zoneId >= grade.zoneDropRange.min && 
    zoneId <= grade.zoneDropRange.max &&
    playerLevel >= grade.levelRequirement
  );

  if (availableGrades.length === 0) {
    // Fallback to lowest grade if no suitable grade found
    return 1;
  }

  // Weight towards higher grades but allow some variance
  const weights = availableGrades.map((_, index) => Math.pow(2, index));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let weightSum = 0;
  for (let i = 0; i < availableGrades.length; i++) {
    weightSum += weights[i];
    if (random <= weightSum) {
      return availableGrades[i].grade;
    }
  }
  
  return availableGrades[availableGrades.length - 1].grade;
}

// Generate random gem appropriate for character archetype and zone
export function generateRandomGem(characterArchetype: 'Fighter' | 'Caster', zoneId: number, playerLevel: number): {
  gemType: string;
  grade: number;
  category: string;
} {
  // Filter gems by archetype and add some utility/farming gems
  const archetypeGems = Object.values(GEM_TYPES).filter(gem => 
    gem.category === characterArchetype || 
    gem.category === 'Utility' || 
    gem.category === 'Farming'
  );

  // Weight distribution: 60% archetype, 25% utility, 15% farming
  const random = Math.random();
  let selectedGems;
  
  if (random < 0.6) {
    selectedGems = Object.values(GEM_TYPES).filter(gem => gem.category === characterArchetype);
  } else if (random < 0.85) {
    selectedGems = Object.values(GEM_TYPES).filter(gem => gem.category === 'Utility');
  } else {
    selectedGems = Object.values(GEM_TYPES).filter(gem => gem.category === 'Farming');
  }

  const randomGemType = selectedGems[Math.floor(Math.random() * selectedGems.length)];
  const grade = getGemGradeForZone(zoneId, playerLevel);

  return {
    gemType: randomGemType.id,
    grade,
    category: randomGemType.category
  };
}

// Check if character can equip gem grade
export function canEquipGemGrade(playerLevel: number, gemGrade: number): boolean {
  const grade = GEM_GRADES.find(g => g.grade === gemGrade);
  return grade ? playerLevel >= grade.levelRequirement : false;
}

// Get gem display name with grade
export function getGemDisplayName(gemTypeId: string, grade: number): string {
  const gemType = GEM_TYPES[gemTypeId];
  const gemGrade = GEM_GRADES.find(g => g.grade === grade);
  
  if (!gemType || !gemGrade) return 'Unknown Gem';
  
  return `${gemGrade.tierName} ${gemType.name}`;
}

// Get all gems available to character based on level
export function getAvailableGemGrades(playerLevel: number): GemGrade[] {
  return GEM_GRADES.filter(grade => playerLevel >= grade.levelRequirement);
}