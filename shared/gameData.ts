// Complete game data extracted from original Geminus 4,000 line implementation

export const GameData = {
  ItemFactory: {
    baseItemTemplates: [
      // Armor & Apparel - All sockets set to 2
      { id: 'base_helm_1', name: 'Iron Helm', type: 'Helmet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1396.png', proportion: 0.75, sockets: 2 },
      { id: 'base_armor_1', name: 'Steel Plate Armor', type: 'Armor', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1401.png', proportion: 1.0, sockets: 2 },
      { id: 'base_leggings_1', name: 'Steel Greaves', type: 'Leggings', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1402.png', proportion: 0.5, sockets: 2, special: { hitChanceBonus: 0.10 } },
      { id: 'base_boots_1', name: 'Steel Sabatons', type: 'Boots', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1403.png', proportion: 0.75, sockets: 2 },
      { id: 'base_gauntlets_1', name: 'Steel Gauntlets', type: 'Gauntlets', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1404.png', proportion: 0.5, sockets: 2, special: { classBonus: 0.15 } },
      { id: 'base_necklace_1', name: 'Amulet of Power', type: 'Amulet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1405.png', proportion: 0.0, sockets: 2 },
      { id: 'base_ring_1', name: 'Ring of Vitality', type: 'Ring', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1406.png', proportion: 0.0, sockets: 2 },
      
      // Weapons - SubTypes added and sockets set to 2
      { id: 'base_shield_1', name: 'Heater Shield', type: 'Weapon', subType: 'Shield', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1408.png', proportion: 1.0, sockets: 2 },
      { id: 'base_coh_1', name: 'Caster Off-Hand', type: 'Weapon', subType: 'Caster Off-Hand', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1409.png', proportion: 1.0, sockets: 2 },
      { id: 'base_bow_1', name: 'Longbow', type: 'Weapon', subType: 'Bow', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1410.png', proportion: 1.0, sockets: 2 },
      { id: 'base_axe_1', name: 'Battle Axe', type: 'Weapon', subType: 'Axe', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1411.png', proportion: 1.0, sockets: 2 },
      { id: 'base_sword_1', name: 'Knightly Sword', type: 'Weapon', subType: 'Sword', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1412.png', proportion: 1.0, sockets: 2 },
      { id: 'base_dagger_1', name: 'Rondel Dagger', type: 'Weapon', subType: 'Dagger', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1413.png', proportion: 1.0, sockets: 2 },
      { id: 'base_mace_1', name: 'Flanged Mace', type: 'Weapon', subType: 'Mace', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1414.png', proportion: 1.0, sockets: 2 },
      { id: 'base_cstaff_1', name: 'Caster Staff', type: 'Weapon', subType: 'Caster Staff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1415.png', proportion: 1.0, sockets: 2 },
      { id: 'base_fstaff_1', name: 'Fighter Staff', type: 'Weapon', subType: 'Fighter Staff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Weapons/IMG_1416.png', proportion: 1.0, sockets: 2 },
      
      // Spells - Sockets set to 2
      { id: 'base_book_1', name: 'Tome of Arcane Lore', type: 'Spellbook', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1407.png', proportion: 0.25, sockets: 2 }
    ]
  },

  equipmentSlotConfig: [
    { name: 'Helmet', type: 'Helmet' },
    { name: 'Weapon 1', type: 'Weapon' },
    { name: 'Armor', type: 'Armor' },
    { name: 'Weapon 2', type: 'Weapon' },
    { name: 'Gauntlets', type: 'Gauntlets' },
    { name: 'Leggings', type: 'Leggings' },
    { name: 'Boots', type: 'Boots' },
    { name: 'Necklace', type: 'Amulet' },
    { name: 'Spell 1', type: 'Spellbook' },
    { name: 'Ring', type: 'Ring' },
    { name: 'Spell 2', type: 'Spellbook' }
  ],

  Gems: {
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
    true_core: { name: 'True-Core', abbreviation: 'TRC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1538.png', effect: "Increase Hit Chance", values: [3, 6, 9, 12, 15, 18, 21, 25, 30] },
    veil_core: { name: 'Veil-Core', abbreviation: 'VLC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1534.png', effect: "Decrease Enemy Hit Chance", values: [2.7, 5.4, 8.1, 10.8, 13.5, 16.2, 18.9, 22.5, 27] },
    vital_core: { name: 'Vital-Core', abbreviation: 'VTC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1533.png', effect: "Heals", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    blood_core: { name: 'Blood-Core', abbreviation: 'BDC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1532.png', effect: "Steal Enemy Health", values: [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    flame_core: { name: 'Flame-Core', abbreviation: 'FLC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1530.png', effect: "Damages Enemy", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    treasure_core: { name: 'Treasure-Core', abbreviation: 'TRC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1529.png', effect: "Increase Drop Chance", values: [2, 3, 4, 5, 6, 7, 8, 9, 10] }
  },

  // This will be populated from the full zone data
  AllZones: {} as Record<string, any>
};

// Equipment inventory bag configuration
export const inventoryBags = {
  'Weapon Chest': ['Weapon'],
  'Bag of Gear': ['Helmet', 'Armor', 'Leggings', 'Boots', 'Gauntlets'],
  'Jewelry Box': ['Amulet', 'Ring'],
  'Spell Satchel': ['Spellbook'],
};

// Load complete zone data (will be populated)
export function loadGameData() {
  // Zone data will be loaded here from your original 4000-line implementation
  // This includes all the zone definitions, monster data, etc.
}