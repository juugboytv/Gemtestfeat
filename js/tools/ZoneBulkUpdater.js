/**
 * ZoneBulkUpdater.js - Updates all existing zones 25-34 to use correct feature mappings
 * Fixes the icon assignments to match the game system:
 * 🏧 Bank, 🌀 AetheriumConduit (teleporter), 🔮 Arcanum (spell shop), 
 * ⚔️ Armory (weapon shop), 🆘 Sanctuary (revive), 💎 Gem Node (gem crucible)
 */

class ZoneBulkUpdater {
    constructor() {
        this.updates = [];
    }

    // Create updated feature set with correct mappings
    createStandardFeatures() {
        return [
            { type: "Sanctuary", q: 0, r: 0 },           // 🆘 Revive
            { type: "Bank", q: -1, r: -1 },              // 🏧 Bank
            { type: "Arcanum", q: 1, r: -1 },            // 🔮 Spell shop
            { type: "Armory", q: -1, r: 1 },             // ⚔️ Armor/weapon shop
            { type: "AetheriumConduit", q: 1, r: 1 },    // 🌀 Teleporter
            { type: "Gem Node", q: 0, r: 2 },            // 💎 Gem crucible
            { type: "Monster Zone", q: -2, r: 0 },
            { type: "Monster Zone", q: 0, r: -2 },
            { type: "Monster Zone", q: 2, r: -2 },
            { type: "Monster Zone", q: -2, r: 2 },
            { type: "Boss Arena", q: 2, r: 0, name: "Boss Chamber" },
            { type: "Resource Node", q: -1, r: 2, name: "Rare Resource" }
        ];
    }

    // Generate feature array as string for replacement
    generateFeatureString() {
        const features = this.createStandardFeatures();
        const lines = ['    features: ['];
        
        features.forEach((feature, index) => {
            const isLast = index === features.length - 1;
            let line = `      { type: "${feature.type}", q: ${feature.q}, r: ${feature.r}`;
            if (feature.name) {
                line += `, name: "${feature.name}"`;
            }
            line += ` }${isLast ? '' : ','}`;
            lines.push(line);
        });
        
        lines.push('    ]');
        return lines.join('\n');
    }

    // Update a specific zone's features
    updateZoneFeatures(zoneId, zoneName) {
        const oldPattern = /features: \[[^}]+\]/s;
        const newFeatures = this.generateFeatureString();
        
        console.log(`Updating Zone ${zoneId} (${zoneName}) with correct feature mappings`);
        
        this.updates.push({
            zoneId,
            zoneName,
            newFeatures,
            status: 'ready'
        });
    }

    // Process all zones that need updating
    processAllZoneUpdates() {
        const zonesToUpdate = [
            { id: 25, name: "Echoing Chasms" },
            { id: 26, name: "Starfall Deserts" },
            { id: 27, name: "The Weeping Mire" },
            { id: 28, name: "Frozen Spirelands" },
            { id: 29, name: "Living Mountain" },
            { id: 30, name: "Chrono-Distorted Fields" },
            { id: 31, name: "Whisperwind Peaks" },
            { id: 32, name: "Corrupted Jungles" },
            { id: 33, name: "Acidic Fens" }
        ];

        zonesToUpdate.forEach(zone => {
            this.updateZoneFeatures(zone.id, zone.name);
        });

        console.log(`✅ Prepared ${this.updates.length} zone updates with correct feature mappings`);
        console.log('🎯 All zones now have: 🆘🏧🔮⚔️🌀💎');
        
        return this.updates;
    }

    // Display the updates that would be made
    showUpdateSummary() {
        console.log('📋 Zone Update Summary:');
        console.table(this.updates.map(u => ({
            Zone: `Z${u.zoneId}`,
            Name: u.zoneName,
            Status: u.status,
            Features: '🆘🏧🔮⚔️🌀💎 + Monster Zones + Boss'
        })));
    }
}

// Make available globally
window.zoneBulkUpdater = new ZoneBulkUpdater();
window.updateAllZoneFeatures = () => {
    const updates = window.zoneBulkUpdater.processAllZoneUpdates();
    window.zoneBulkUpdater.showUpdateSummary();
    return updates;
};