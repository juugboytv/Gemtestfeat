import { BaseItem, Gem, Zone } from './schema';

// Base item templates from your game
export const BASE_ITEMS: BaseItem[] = [
  // Armor & Apparel
  { id: 'base_helm_1', name: 'Iron Helm', type: 'Helmet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1396.png', proportion: 0.75, sockets: 2 },
  { id: 'base_armor_1', name: 'Steel Plate Armor', type: 'Armor', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1401.png', proportion: 1.0, sockets: 2 },
  { id: 'base_leggings_1', name: 'Steel Greaves', type: 'Leggings', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1402.png', proportion: 0.5, sockets: 2, special: { hitChanceBonus: 0.10 } },
  { id: 'base_boots_1', name: 'Steel Sabatons', type: 'Boots', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1403.png', proportion: 0.75, sockets: 2 },
  { id: 'base_gauntlets_1', name: 'Steel Gauntlets', type: 'Gauntlets', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1404.png', proportion: 0.5, sockets: 2, special: { classBonus: 0.15 } },
  { id: 'base_necklace_1', name: 'Amulet of Power', type: 'Amulet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1405.png', proportion: 0.0, sockets: 2 },
  { id: 'base_ring_1', name: 'Ring of Vitality', type: 'Ring', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1406.png', proportion: 0.0, sockets: 2 },
  
  // Weapons
  { id: 'base_shield_1', name: 'Heater Shield', type: 'Weapon', subType: 'Shield', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1408.png', proportion: 1.0, sockets: 2 },
  { id: 'base_coh_1', name: 'Caster Off-Hand', type: 'Weapon', subType: 'Caster Off-Hand', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1409.png', proportion: 1.0, sockets: 2 },
  { id: 'base_bow_1', name: 'Longbow', type: 'Weapon', subType: 'Bow', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1410.png', proportion: 1.0, sockets: 2 },
  { id: 'base_axe_1', name: 'Battle Axe', type: 'Weapon', subType: 'Axe', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1411.png', proportion: 1.0, sockets: 2 },
  { id: 'base_sword_1', name: 'Knightly Sword', type: 'Weapon', subType: 'Sword', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1412.png', proportion: 1.0, sockets: 2 },
  { id: 'base_dagger_1', name: 'Rondel Dagger', type: 'Weapon', subType: 'Dagger', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1413.png', proportion: 1.0, sockets: 2 },
  { id: 'base_mace_1', name: 'Flanged Mace', type: 'Weapon', subType: 'Mace', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1414.png', proportion: 1.0, sockets: 2 },
  { id: 'base_cstaff_1', name: 'Caster Staff', type: 'Weapon', subType: 'Caster Staff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1415.png', proportion: 1.0, sockets: 2 },
  { id: 'base_fstaff_1', name: 'Fighter Staff', type: 'Weapon', subType: 'Fighter Staff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1416.png', proportion: 1.0, sockets: 2 },
  { id: 'base_claws_1', name: 'Claws', type: 'Weapon', subType: 'Claws', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1417.png', proportion: 1.0, sockets: 2 },
  
  // Spellbooks
  { id: 'base_airspell_1', name: 'Air Spell', type: 'Spellbook', subType: 'Air', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1425.png', proportion: 1.0, sockets: 2 },
  { id: 'base_deathspell_1', name: 'Death Spell', type: 'Spellbook', subType: 'Death', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1424.png', proportion: 1.0, sockets: 2 },
  { id: 'base_coldspell_1', name: 'Cold Spell', type: 'Spellbook', subType: 'Cold', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1423.png', proportion: 1.0, sockets: 2 },
  { id: 'base_firespell_1', name: 'Fire Spell', type: 'Spellbook', subType: 'Fire', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1422.png', proportion: 1.0, sockets: 2 },
  { id: 'base_arcanespell_1', name: 'Arcane Spell', type: 'Spellbook', subType: 'Arcane', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1421.png', proportion: 1.0, sockets: 2 },
  { id: 'base_earthspell_1', name: 'Earth Spell', type: 'Spellbook', subType: 'Earth', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1420.png', proportion: 1.0, sockets: 2 },
  { id: 'base_fighterbuff_1', name: 'Fighter Buff Spell', type: 'Spellbook', subType: 'Fighter Buff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_2292.png', proportion: 1.0, sockets: 2 },
  { id: 'base_drainspell_1', name: 'Drain Spell', type: 'Spellbook', subType: 'Drain', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_2358.png', proportion: 1.0, sockets: 2 },
];

// Gem definitions from your game
export const GEMS: Record<string, Omit<Gem, 'tier'>> = {
  lorestone: { name: 'LoreStone', abbreviation: 'LST', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1500.png', effect: "Increase Base Spell Class", values: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
  loreheart: { name: 'LoreHeart', abbreviation: 'LHT', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1501.png', effect: "Increase Base SC & AC", values: { sc: [1, 1.5, 2.5, 3.5, 5, 7, 8.5, 10, 12], ac: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] } },
  mindrite: { name: 'Mindrite', abbreviation: 'MDR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1504.png', effect: "Increase Wisdom", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
  dullrite: { name: 'Dullrite', abbreviation: 'DLR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1505.png', effect: "Decrease Enemy Wisdom", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] },
  drainrite: { name: 'Drainrite', abbreviation: 'DRR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1506.png', effect: "Steal Enemy Wisdom", values: [4, 6, 9, 15, 25, 40, 50, 60, 75] },
  mindstone: { name: 'MindStone', abbreviation: 'MDS', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1507.png', effect: "Increase Intelligence", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
  dullstone: { name: 'DullStone', abbreviation: 'DLS', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1508.png', effect: "Decrease Enemy Intelligence", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] },
  drawstone: { name: 'DrawStone', abbreviation: 'DRS', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1509.png', effect: "Steal Enemy Intelligence", values: [4, 6, 9, 15, 25, 40, 50, 60, 75] },
  sagerite: { name: 'Sagerite', abbreviation: 'SGR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1510.png', effect: "Increase Ntl & Wisdom", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
  drowseite: { name: 'Drowseite', abbreviation: 'DWS', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1511.png', effect: "Decrease Enemy Ntl & Wisdom", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] },
  leechrite: { name: 'Leechrite', abbreviation: 'LCR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1512.png', effect: "Steal Enemy Ntl & Wisdom", values: [4, 6, 9, 15, 25, 40, 50, 60, 75] },
  warstone: { name: 'WarStone', abbreviation: 'WST', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1503.png', effect: "Increase Base Weapon Class", values: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
  warheart: { name: 'WarHeart', abbreviation: 'WHT', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1502.png', effect: "Increase Base WC & AC", values: { wc: [1, 1.5, 2.5, 3.5, 5, 7, 8.5, 10, 12], ac: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] } },
  agilite: { name: 'Agilite', abbreviation: 'AGL', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1513.png', effect: "Increase Dexterity", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
  cripplite: { name: 'Cripplite', abbreviation: 'CPL', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1514.png', effect: "Decrease Enemy Dexterity", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] },
};

// Zones data from your game
export const ZONES: Record<string, Zone> = {
  "1": { "name": "Crystal Caves (Dwarf)", "levelReq": 1, "biome": "mountain", "gearTier": 1 },
  "2": { "name": "Glimmerwood (Elf)", "levelReq": 1, "biome": "forest", "gearTier": 1 },
  "3": { "name": "The Shifting Maze (Halfling)", "levelReq": 1, "biome": "plains", "gearTier": 1 },
  "4": { "name": "Chromatic Badlands (Human)", "levelReq": 1, "biome": "wastes", "gearTier": 1 },
  "5": { "name": "Mana Springs (Gnome)", "levelReq": 1, "biome": "forest", "gearTier": 1 },
  "6": { "name": "Blazefire Wastes (Dragonborn/Demon)", "levelReq": 1, "biome": "wastes", "gearTier": 1 },
  "7": { "name": "Shadow Mire (Tiefling)", "levelReq": 1, "biome": "swamp", "gearTier": 1 },
  "8": { "name": "Whispering Woods (Hobbit)", "levelReq": 1, "biome": "forest", "gearTier": 1 },
  "9": { "name": "Ashfall Barrens (Orc)", "levelReq": 1, "biome": "wastes", "gearTier": 1 },
  "10": { "name": "Screaming Crags (Troll)", "levelReq": 1, "biome": "mountain", "gearTier": 1 },
  "25": { "name": "Echoing Chasms", "levelReq": 100, "biome": "mountain", "gearTier": 3 },
  "26": { "name": "Starfall Deserts", "levelReq": 110, "biome": "wastes", "gearTier": 3 },
  "27": { "name": "The Weeping Mire", "levelReq": 121, "biome": "swamp", "gearTier": 3 },
  "28": { "name": "Frozen Spirelands", "levelReq": 135, "biome": "tundra", "gearTier": 4 },
  "29": { "name": "Living Mountain", "levelReq": 149, "biome": "mountain", "gearTier": 4 },
  "30": { "name": "Chrono-Distorted Fields", "levelReq": 166, "biome": "plains", "gearTier": 4 },
  "100": { "name": "The Singing Rivers", "levelReq": 400000, "biome": "plains", "gearTier": 19 },
  "101": { "name": "The Echoing Gorge of Lost Souls", "levelReq": 500000, "biome": "mountain", "gearTier": 20 }
};

// Item Factory
export class ItemFactory {
  static createItemInstance(baseItemId: string, tier: number, type: 'Normal' | 'Shadow' | 'Echo', options: { quality?: number } = {}) {
    const baseItem = BASE_ITEMS.find(b => b.id === baseItemId);
    if (!baseItem) {
      console.error(`Base item with ID "${baseItemId}" not found.`);
      return null;
    }

    const baseClassValue = 13 * Math.pow(1.22, tier - 1);
    
    const newItem = {
      instanceId: `inst_${type[0]}_${baseItem.id}_${Date.now()}_${Math.random()}`,
      baseItemId: baseItem.id,
      type: type,
      tier: tier,
      socketedGems: [],
      special: baseItem.special || null,
      classValue: 0
    };

    if (type === 'Shadow') {
      newItem.quality = options.quality || (0.75 + (Math.random() * 0.75));
      newItem.kills = 0;
    } else if (type === 'Echo') {
      newItem.quality = options.quality;
    }
    
    // Calculate final class value
    let finalClassValue = baseClassValue * baseItem.proportion;
    if (newItem.quality) {
      finalClassValue *= newItem.quality;
    }
    newItem.classValue = finalClassValue;

    return newItem;
  }

  static createGemInstance(gemType: string, tier: number) {
    const baseGem = GEMS[gemType];
    if (!baseGem) {
      console.error(`Gem type "${gemType}" not found.`);
      return null;
    }

    return {
      ...baseGem,
      tier: tier
    };
  }
}