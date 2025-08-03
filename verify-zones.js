/**
 * Zone Blueprint Verification Script
 * Verifies all zones have the required 5 buildings
 */

const fs = require('fs');
const path = require('path');

// Read the zone blueprints file
const blueprintPath = path.join(__dirname, 'shared', 'zoneBlueprints.ts');
const content = fs.readFileSync(blueprintPath, 'utf8');

// Extract zone data using regex (simple parsing for verification)
const zoneMatches = content.match(/"(\d+)":\s*\{[^}]*name:\s*"([^"]*)"[^}]*features:\s*\[([\s\S]*?)\]/g);

const requiredBuildings = ['Sanctuary', 'Armory', 'Arcanum', 'AetheriumConduit', 'Teleporter'];
const results = [];

if (zoneMatches) {
    zoneMatches.forEach(match => {
        const idMatch = match.match(/"(\d+)":/);
        const nameMatch = match.match(/name:\s*"([^"]*)"/);
        
        if (idMatch && nameMatch) {
            const zoneId = idMatch[1];
            const zoneName = nameMatch[1];
            
            // Count buildings in this zone
            const buildings = {};
            requiredBuildings.forEach(building => {
                const regex = new RegExp(`type:\\s*"${building}"`, 'g');
                const matches = match.match(regex);
                buildings[building] = matches ? matches.length : 0;
            });
            
            const missing = requiredBuildings.filter(building => buildings[building] === 0);
            const hasAll = missing.length === 0;
            
            results.push({
                id: zoneId,
                name: zoneName,
                buildings,
                missing,
                complete: hasAll
            });
        }
    });
}

// Output results
console.log('\n=== ZONE BLUEPRINT VERIFICATION ===\n');

const completeZones = results.filter(z => z.complete);
const incompleteZones = results.filter(z => !z.complete);

console.log(`✅ COMPLETE ZONES (${completeZones.length}/${results.length}):`);
completeZones.forEach(zone => {
    console.log(`   Zone ${zone.id}: ${zone.name}`);
});

if (incompleteZones.length > 0) {
    console.log(`\n❌ INCOMPLETE ZONES (${incompleteZones.length}):`);
    incompleteZones.forEach(zone => {
        console.log(`   Zone ${zone.id}: ${zone.name}`);
        console.log(`      Missing: ${zone.missing.join(', ')}`);
    });
} else {
    console.log('\n🎉 ALL ZONES COMPLETE! Every zone has all 5 required buildings.');
}

console.log(`\nREQUIRED: ${requiredBuildings.join(', ')}`);
console.log(`TOTAL ZONES VERIFIED: ${results.length}`);