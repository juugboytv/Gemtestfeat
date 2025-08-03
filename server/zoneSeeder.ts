/**
 * Zone and Monster Data Seeder
 * Populates database with all 101 zones and their monster data
 */

import { db } from './storage';
import { zones, monsters } from '../shared/schema';
import { COMPLETE_ZONE_DATA } from '../shared/completeZoneData';

export async function seedZoneData() {
  console.log('Starting zone and monster data seeding...');
  
  try {
    // Clear existing data
    await db.delete(monsters);
    await db.delete(zones);
    
    console.log('Cleared existing zone and monster data');
    
    // Insert all zones
    for (const zoneData of COMPLETE_ZONE_DATA) {
      // Insert zone
      const [insertedZone] = await db.insert(zones).values({
        zoneId: zoneData.zoneId,
        name: zoneData.name,
        description: zoneData.description,
        gridSize: zoneData.gridSize,
        levelRequirement: zoneData.levelRequirement,
        theme: zoneData.theme,
        features: zoneData.features,
        unlocked: true,
      }).returning();
      
      console.log(`Inserted zone ${zoneData.zoneId}: ${zoneData.name}`);
      
      // Insert monsters for this zone
      for (const monsterData of zoneData.monsters) {
        await db.insert(monsters).values({
          zoneId: zoneData.zoneId,
          monsterId: monsterData.monsterId,
          name: monsterData.name,
          level: monsterData.level,
          health: monsterData.health,
          attack: monsterData.attack,
          defense: monsterData.defense,
          experienceReward: monsterData.experienceReward,
          goldReward: monsterData.goldReward,
          isBoss: monsterData.isBoss,
          isBonusBoss: monsterData.isBonusBoss,
          dropTable: null, // Will be populated later
          specialAbilities: null, // Will be populated later
        });
      }
      
      console.log(`Inserted ${zoneData.monsters.length} monsters for zone ${zoneData.zoneId}`);
    }
    
    console.log(`Successfully seeded ${COMPLETE_ZONE_DATA.length} zones with complete monster data`);
    
  } catch (error) {
    console.error('Error seeding zone data:', error);
    throw error;
  }
}

// Auto-seed on module load if in development
if (process.env.NODE_ENV === 'development') {
  seedZoneData().catch(console.error);
}