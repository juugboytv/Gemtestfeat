// ===== GAME STATE MANAGEMENT =====

// Global game state variables
let AllZones = {};
let gameState = {
    player: {
        level: 1,
        health: 100,
        maxHealth: 100,
        experience: 0,
        gold: 0,
        bankedGold: 0,
        name: "Player",
        currentZone: 1,
        position: { q: 0, r: 0 },
        isDefeated: false,
        attributes: {
            strength: 10,
            dexterity: 10,
            intelligence: 10,
            constitution: 10,
            wisdom: 10,
            charisma: 10
        },
        attributePoints: 0
    },
    inventory: [],
    equipment: {
        weapon1: null,
        weapon2: null,
        armor: null,
        accessory: null
    },
    gems: [],
    settings: {
        theme: 'molten',
        sfxEnabled: true,
        bgmEnabled: true
    }
};

// Data loading functions
async function loadGameData() {
    try {
        // Zones data
        const zonesData = {
            "1": { "name": "Crystal Caves", "levelReq": 1, "biome": "cavern", "gearTier": 1 },
            "2": { "name": "Whispering Woods", "levelReq": 1, "biome": "forest", "gearTier": 1 },
            "3": { "name": "Ember Peaks", "levelReq": 1, "biome": "mountain", "gearTier": 1 },
            "4": { "name": "Frost Hollow", "levelReq": 1, "biome": "tundra", "gearTier": 1 },
            "5": { "name": "Shadowmere Swamp", "levelReq": 1, "biome": "swamp", "gearTier": 1 },
            // Add remaining zones data here...
            "101": { "name": "The Echoing Gorge of Lost Souls", "levelReq": 500000, "biome": "mountain", "gearTier": 20 }
        };
        AllZones = zonesData;
        console.log("Zone data successfully loaded.");
        
        // Load zone blueprints
        loadZoneBlueprints();
    } catch (error) {
        console.error("Failed to load game data:", error);
        showToast("CRITICAL ERROR: Could not load game data. Please refresh.", true);
    }
}

// Zone Blueprint Loader
function loadZoneBlueprints() {
    const zoneBlueprints = {
        "1": {
            name: "Crystal Caves",
            gridSize: 4,
            description: "A shimmering cavern filled with glowing crystals.",
            difficulty: 1,
            features: [
                { type: "Sanctuary", q: -2, r: 0 },
                { type: "Armory", q: 1, r: -1 },
                { type: "Arcanum", q: 1, r: 1 },
                { type: "AetheriumConduit", q: 2, r: 0 },
                { type: "Teleporter", q: 0, r: 2 }
            ]
        }
        // Add other zone blueprints...
    };
    
    window.ZoneBlueprints = zoneBlueprints;
    console.log("Zone blueprints loaded successfully.", Object.keys(zoneBlueprints).length, "zones");
}

// Player state management
const PlayerManager = {
    updateLevel(newLevel) {
        gameState.player.level = newLevel;
        this.updateUI();
    },
    
    updateHealth(newHealth) {
        gameState.player.health = Math.max(0, Math.min(newHealth, gameState.player.maxHealth));
        this.updateUI();
    },
    
    updateGold(amount) {
        gameState.player.gold = Math.max(0, gameState.player.gold + amount);
        this.updateUI();
    },
    
    updateUI() {
        const levelEl = document.getElementById('player-level-value');
        const healthEl = document.getElementById('player-health-numeric');
        const hpBarEl = document.getElementById('hp-bar');
        
        if (levelEl) levelEl.textContent = gameState.player.level;
        if (healthEl) healthEl.textContent = `${gameState.player.health} / ${gameState.player.maxHealth}`;
        if (hpBarEl) {
            const percentage = (gameState.player.health / gameState.player.maxHealth) * 100;
            hpBarEl.style.width = percentage + '%';
        }
    }
};

// Save/Load system
const SaveManager = {
    save() {
        localStorage.setItem('geminus_save', JSON.stringify(gameState));
        showToast("Game saved successfully!");
    },
    
    load() {
        const saved = localStorage.getItem('geminus_save');
        if (saved) {
            gameState = { ...gameState, ...JSON.parse(saved) };
            PlayerManager.updateUI();
            showToast("Game loaded successfully!");
            return true;
        }
        return false;
    },
    
    reset() {
        localStorage.removeItem('geminus_save');
        location.reload();
    }
};