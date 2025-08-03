import { db } from './storage';
import { zones, monsters } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Generate a zone with all 6 required buildings and proper hex layout
function generateZoneFeatures(zoneId: number, gridSize: number) {
  const radius = Math.floor(gridSize / 2);
  const features = [];
  
  // Required buildings with their emojis
  const requiredBuildings = [
    { type: 'Sanctuary', name: 'Healing Sanctuary', icon: '🆘' },
    { type: 'Armory', name: 'Weapons & Combat Shop', icon: '⚔️' },
    { type: 'Arcanum', name: 'Magic & Accessories Shop', icon: '🔮' },
    { type: 'AetheriumConduit', name: 'Aetherium Conduit', icon: '🏧' },  // Bank
    { type: 'Teleporter', name: 'Teleport Zone', icon: '🌀' },
    { type: 'GemCrucible', name: 'Gem Crucible', icon: '💎' }             // Gems
  ];
  
  // Generate valid hex positions for the grid
  const validPositions = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) <= radius) {
        validPositions.push({ q, r });
      }
    }
  }
  
  // Place required buildings randomly in valid positions
  const usedPositions = new Set();
  requiredBuildings.forEach(building => {
    let position;
    do {
      position = validPositions[Math.floor(Math.random() * validPositions.length)];
    } while (usedPositions.has(`${position.q},${position.r}`));
    
    usedPositions.add(`${position.q},${position.r}`);
    features.push({
      q: position.q,
      r: position.r,
      type: building.type,
      name: building.name,
      icon: building.icon
    });
  });
  
  return { features };
}

// Generate zone themes based on zone ID
function getZoneTheme(zoneId: number): string {
  const themes = [
    'molten', 'frost', 'shadow', 'arcane', 'nature', 'void', 'crystal', 'storm', 'earth', 'light'
  ];
  return themes[zoneId % themes.length];
}

// Generate all 101 zones with proper data
export async function seedZones() {
  console.log('🌍 Starting zone seeding process...');
  
  try {
    // First, clear existing monsters (due to foreign key constraint)
    await db.delete(monsters);
    console.log('🗑️ Cleared existing monsters');
    
    // Then clear existing zones
    await db.delete(zones);
    console.log('🗑️ Cleared existing zones');
    
    const zonesToInsert = [];
    
    // Generate all 101 zones
    for (let zoneId = 1; zoneId <= 101; zoneId++) {
      // Calculate grid size based on zone ID (4x4 to 10x10)
      let gridSize;
      if (zoneId <= 24) gridSize = 4; // Starter zones are smaller
      else if (zoneId <= 50) gridSize = 6;
      else if (zoneId <= 75) gridSize = 8;
      else gridSize = 10; // End-game zones are largest
      
      // Generate zone features with all 6 required buildings
      const features = generateZoneFeatures(zoneId, gridSize);
      
      // Determine level requirement
      let levelRequirement;
      if (zoneId <= 24) levelRequirement = 1; // All starter zones accessible at level 1
      else levelRequirement = Math.floor((zoneId - 24) * 1.5) + 5; // Progressive scaling
      
      const zone = {
        zoneId,
        name: `Zone ${zoneId}: ${getZoneName(zoneId)}`,
        description: `A ${getZoneTheme(zoneId)} themed zone with unique challenges and rewards.`,
        gridSize,
        levelRequirement,
        theme: getZoneTheme(zoneId),
        features,
        unlocked: zoneId <= 24 // First 24 zones unlocked by default
      };
      
      zonesToInsert.push(zone);
    }
    
    // Insert all zones in batches
    const batchSize = 20;
    for (let i = 0; i < zonesToInsert.length; i += batchSize) {
      const batch = zonesToInsert.slice(i, i + batchSize);
      await db.insert(zones).values(batch);
      console.log(`✅ Inserted zones ${i + 1}-${Math.min(i + batchSize, 101)}`);
    }
    
    console.log('🎉 Successfully seeded all 101 zones with 6 buildings each!');
    
    // Verify the data
    const zoneCount = await db.select().from(zones);
    console.log(`📊 Database now contains ${zoneCount.length} zones`);
    
    // Show sample zone data
    const sampleZone = zoneCount.find(z => z.zoneId === 1);
    if (sampleZone) {
      console.log('🏗️ Sample Zone 1 features:', JSON.stringify(sampleZone.features, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding zones:', error);
    throw error;
  }
}

// Generate descriptive zone names
function getZoneName(zoneId: number): string {
  const names = [
    'Ember Highlands', 'Frostwind Valley', 'Shadow Reach', 'Arcane Gardens', 'Emerald Grove',
    'Void Depths', 'Crystal Caverns', 'Storm Peaks', 'Stone Canyons', 'Dawn Plains',
    'Twilight Forest', 'Burning Wastes', 'Frozen Tundra', 'Dark Marshes', 'Mystic Ruins',
    'Verdant Hills', 'Abyssal Shores', 'Prismatic Cliffs', 'Thunder Valleys', 'Ancient Grounds',
    'Crimson Deserts', 'Azure Lakes', 'Obsidian Fields', 'Golden Meadows', 'Silver Mountains'
  ];
  
  const baseName = names[(zoneId - 1) % names.length];
  const tier = Math.floor((zoneId - 1) / 25) + 1;
  
  if (tier === 1) return baseName;
  return `${baseName} (Tier ${tier})`;
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedZones()
    .then(() => {
      console.log('✅ Zone seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Zone seeding failed:', error);
      process.exit(1);
    });
}