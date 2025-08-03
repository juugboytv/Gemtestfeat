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
    // Clear existing data to prevent duplicates
    console.log('Clearing existing data...');
    await db.delete(monsters);
    await db.delete(zones);
    console.log('Cleared existing zone and monster data');
    
    // Insert all zones with error handling
    let successCount = 0;
    for (const zoneData of COMPLETE_ZONE_DATA) {
      try {
        // Insert zone
        await db.insert(zones).values({
          zoneId: zoneData.zoneId,
          name: zoneData.name,
          description: zoneData.description,
          gridSize: zoneData.gridSize,
          levelRequirement: zoneData.levelRequirement,
          theme: zoneData.theme,
          features: zoneData.features,
          unlocked: true,
        });
        
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
        successCount++;
        
      } catch (zoneError) {
        // Skip individual zone errors and continue
        console.warn(`Skipping zone ${zoneData.zoneId} due to error:`, zoneError.message);
        continue;
      }
    }
    
    console.log(`Successfully seeded ${successCount} zones with complete monster data`);
    
  } catch (error) {
    console.error('Critical error during seeding:', error);
    // Don't throw - allow the server to continue running
  }
}

// Auto-seed on module load if in development
if (process.env.NODE_ENV === 'development') {
  seedZoneData().catch(console.error);
}