// Geminus - Dark Fantasy RPG (GDD Integrated)
// Complete conversion from original 4,000-line implementation

// === GLOBAL STATE ===
let state = {
    player: {
        name: '',
        race: '',
        class: '',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        hp: 100,
        gold: 0,
        bankGold: 0,
        attributePoints: 0,
        baseStats: { STR: 8, DEX: 8, VIT: 8, NTL: 8, WIS: 8 },
        stats: { maxHp: 100, weaponClass: 1, spellClass: 1, armorClass: 0, hitChance: 75 },
        equipment: {},
        inventory: [],
        gems: []
    },
    game: {
        currentZoneTier: 1,
        currentZone: null,
        selectedMonster: null,
        selectedGem: null,
        selectedInventoryItem: null
    },
    ui: {
        activeTab: 'adventure',
        activeBag: 'all',
        isInCombat: false
    }
};

// === UI ELEMENTS ===
const ui = {
    // Player status
    playerLevel: document.getElementById('player-level'),
    playerName: document.getElementById('player-name'),
    playerGold: document.getElementById('player-gold'),
    playerHealthBar: document.getElementById('player-health-bar'),
    playerHealthNumeric: document.getElementById('player-health-numeric'),
    playerExpBar: document.getElementById('player-exp-bar'),
    playerExp: document.getElementById('player-exp'),
    playerExpNext: document.getElementById('player-exp-next'),
    
    // Current location
    currentLocation: document.getElementById('current-location'),
    
    // Mini map
    miniMapContainer: document.getElementById('minimap-container'),
    miniMapCanvas: document.getElementById('minimap-canvas'),
    
    // Controls
    keyUp: document.getElementById('key-up'),
    keyDown: document.getElementById('key-down'),
    keyLeft: document.getElementById('key-left'),
    keyRight: document.getElementById('key-right'),
    keyInteract: document.getElementById('key-interact'),
    
    // Combat
    monsterListContainer: document.getElementById('monster-list-container'),
    monsterList: document.getElementById('monster-list'),
    combatInterface: document.getElementById('combat-interface'),
    selectedMonsterName: document.getElementById('selected-monster-name'),
    selectedMonsterLevel: document.getElementById('selected-monster-level'),
    selectedMonsterHealth: document.getElementById('selected-monster-health'),
    attackBtn: document.getElementById('attack-btn'),
    castBtn: document.getElementById('cast-btn'),
    
    // Character tab
    charName: document.getElementById('char-name'),
    charRace: document.getElementById('char-race'),
    charClass: document.getElementById('char-class'),
    attributePoints: document.getElementById('attribute-points'),
    statsContainer: document.getElementById('stats-container'),
    
    // Inventory
    inventoryGrid: document.getElementById('inventory-grid'),
    gemPouchGrid: document.getElementById('gem-pouch-grid'),
    
    // Equipment
    equipmentGrid: document.getElementById('equipment-grid'),
    
    // Settings
    saveGameBtn: document.getElementById('save-game-btn'),
    loadGameBtn: document.getElementById('load-game-btn'),
    resetGameBtn: document.getElementById('reset-game-btn'),
    chatLog: document.getElementById('chat-log'),
    
    // Modals
    zonePopupModal: document.getElementById('zone-popup-modal'),
    zoneListContainer: document.getElementById('zone-list-container'),
    closeZonePopup: document.getElementById('close-zone-popup'),
    teleportBtn: document.getElementById('teleport-btn'),
    statInfoModal: document.getElementById('stat-info-modal'),
    statInfoBackdrop: document.getElementById('stat-info-backdrop'),
    
    // Toast
    toastNotification: document.getElementById('toast-notification'),
    
    // Smoke canvas
    smokeCanvas: document.getElementById('smoke-canvas')
};

// === GAME DATA FROM ORIGINAL ===
let AllZones = {}; // This will be populated by loadGameData

const GameData = {
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
            
            // Spellbooks - Sockets set to 2
            { id: 'base_spellbook_1', name: 'Apprentice Tome', type: 'Spellbook', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1407.png', proportion: 1.0, sockets: 2 }
        ]
    },
    
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
    
    GemGradeUnlockLevels: [1, 100, 253, 1000, 6143, 13636, 35452, 83333, 172222],
    
    Races: {
        'Dwarf': { class: 'Fighter', stats: { STR: 12, DEX: 8, VIT: 10, NTL: 12, WIS: 8 } },
        'Elf': { class: 'Caster', stats: { STR: 6, DEX: 14, VIT: 6, NTL: 12, WIS: 12 } },
        'Halfling': { class: 'Fighter', stats: { STR: 4, DEX: 18, VIT: 8, NTL: 2, WIS: 8 } },
        'Human': { class: 'Fighter', stats: { STR: 8, DEX: 14, VIT: 8, NTL: 5, WIS: 5 } },
        'Gnome': { class: 'Caster', stats: { STR: 2, DEX: 2, VIT: 6, NTL: 12, WIS: 18 } },
        'Dragonborn': { class: 'Fighter', stats: { STR: 18, DEX: 8, VIT: 8, NTL: 9, WIS: 7 } },
        'Tiefling': { class: 'Caster', stats: { STR: 2, DEX: 6, VIT: 6, NTL: 18, WIS: 8 } },
        'Hobbit': { class: 'Fighter', stats: { STR: 4, DEX: 20, VIT: 12, NTL: 2, WIS: 2 } },
        'Orc': { class: 'Fighter', stats: { STR: 18, DEX: 6, VIT: 12, NTL: 2, WIS: 2 } },
        'Troll': { class: 'Fighter', stats: { STR: 14, DEX: 8, VIT: 14, NTL: 2, WIS: 2 } }
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
    ]
};

// === UTILITY FUNCTIONS ===
function showToast(message, isError = false) {
    const toast = ui.toastNotification;
    toast.textContent = message;
    toast.className = isError ? 'toast-error' : 'toast-success';
    toast.style.bottom = '20px';
    
    setTimeout(() => {
        toast.style.bottom = '-100px';
    }, 3000);
}

function addChatMessage(message, type = 'system') {
    const chatLog = ui.chatLog;
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'system' ? 'text-green-400' : 'text-gray-300';
    messageDiv.textContent = `[${type}] ${message}`;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function saveGameState() {
    try {
        localStorage.setItem('geminusGameState', JSON.stringify(state));
        addChatMessage('Game saved successfully!');
        showToast('Game saved!');
    } catch (error) {
        addChatMessage('Failed to save game!', 'error');
        showToast('Save failed!', true);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('geminusGameState');
        if (saved) {
            state = { ...state, ...JSON.parse(saved) };
            addChatMessage('Game loaded successfully!');
            showToast('Game loaded!');
            updateAllUI();
        } else {
            addChatMessage('No saved game found!', 'error');
            showToast('No save file found!', true);
        }
    } catch (error) {
        addChatMessage('Failed to load game!', 'error');
        showToast('Load failed!', true);
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset your game? This cannot be undone.')) {
        localStorage.removeItem('geminusGameState');
        location.reload();
    }
}

// === CREATION MANAGER ===
const CreationManager = {
    init() {
        const contentHTML = `
            <div class="creation-card w-full h-full flex flex-col">
                <div class="flex-shrink-0">
                    <h1 class="text-3xl font-orbitron text-center text-gray-300 mb-4">Create Your Hero</h1>
                </div>
                
                <div class="flex-grow overflow-y-auto custom-scrollbar">
                    <div class="space-y-6">
                        <!-- Character Name -->
                        <div>
                            <label class="block text-sm font-orbitron text-gray-400 mb-2">Hero Name</label>
                            <input type="text" id="character-name" class="w-full p-3 rounded-lg bg-black/40 border border-orange-500/30 text-white font-orbitron focus:border-orange-500 focus:outline-none" placeholder="Enter your hero's name" maxlength="20">
                        </div>
                        
                        <!-- Race Selection -->
                        <div>
                            <label class="block text-sm font-orbitron text-gray-400 mb-2">Choose Race</label>
                            <select id="race-select" class="w-full p-3 rounded-lg bg-black/40 border border-orange-500/30 text-white font-orbitron focus:border-orange-500 focus:outline-none">
                                <option value="">Select a race...</option>
                                ${Object.keys(GameData.Races).map(race => 
                                    `<option value="${race}">${race}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <!-- Race Info Display -->
                        <div id="race-info" class="hidden">
                            <div class="bg-black/20 p-4 rounded-lg border border-orange-500/20">
                                <div class="text-center mb-3">
                                    <div class="text-lg font-orbitron text-orange-400" id="selected-race-name"></div>
                                    <div class="text-sm text-gray-400" id="selected-race-class"></div>
                                </div>
                                <div class="grid grid-cols-5 gap-2 text-center">
                                    <div>
                                        <div class="text-xs text-gray-400">STR</div>
                                        <div class="font-bold text-white" id="race-str"></div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-400">DEX</div>
                                        <div class="font-bold text-white" id="race-dex"></div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-400">VIT</div>
                                        <div class="font-bold text-white" id="race-vit"></div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-400">NTL</div>
                                        <div class="font-bold text-white" id="race-ntl"></div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-400">WIS</div>
                                        <div class="font-bold text-white" id="race-wis"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex-shrink-0 mt-6">
                    <button id="create-character-btn" class="glass-button w-full py-3 rounded-lg font-orbitron" disabled>Create Hero</button>
                </div>
            </div>
        `;
        
        ModalManager.show('Character Creation', contentHTML, {
            onContentReady: (contentDiv) => {
                this.setupCreationUI(contentDiv);
            }
        });
    },
    
    setupCreationUI(contentDiv) {
        const nameInput = contentDiv.querySelector('#character-name');
        const raceSelect = contentDiv.querySelector('#race-select');
        const raceInfo = contentDiv.querySelector('#race-info');
        const createBtn = contentDiv.querySelector('#create-character-btn');
        
        // Race selection handler
        raceSelect.addEventListener('change', (e) => {
            const selectedRace = e.target.value;
            if (selectedRace && GameData.Races[selectedRace]) {
                const raceData = GameData.Races[selectedRace];
                
                // Show race info
                contentDiv.querySelector('#selected-race-name').textContent = selectedRace;
                contentDiv.querySelector('#selected-race-class').textContent = raceData.class;
                contentDiv.querySelector('#race-str').textContent = raceData.stats.STR;
                contentDiv.querySelector('#race-dex').textContent = raceData.stats.DEX;
                contentDiv.querySelector('#race-vit').textContent = raceData.stats.VIT;
                contentDiv.querySelector('#race-ntl').textContent = raceData.stats.NTL;
                contentDiv.querySelector('#race-wis').textContent = raceData.stats.WIS;
                
                raceInfo.classList.remove('hidden');
                this.validateForm(nameInput, raceSelect, createBtn);
            } else {
                raceInfo.classList.add('hidden');
                createBtn.disabled = true;
            }
        });
        
        // Name input handler
        nameInput.addEventListener('input', () => {
            this.validateForm(nameInput, raceSelect, createBtn);
        });
        
        // Create character handler
        createBtn.addEventListener('click', () => {
            this.createCharacter(nameInput.value, raceSelect.value);
        });
    },
    
    validateForm(nameInput, raceSelect, createBtn) {
        const isValid = nameInput.value.trim().length > 0 && raceSelect.value !== '';
        createBtn.disabled = !isValid;
    },
    
    createCharacter(name, race) {
        const raceData = GameData.Races[race];
        
        // Set up player data
        state.player.name = name;
        state.player.race = race;
        state.player.class = raceData.class;
        state.player.baseStats = { ...raceData.stats };
        
        // Give player starting gems
        state.player.gems = Object.keys(GameData.Gems).map(gemId => ({ id: gemId, grade: 1 }));
        
        ProfileManager.calculateAllStats();
        state.player.hp = state.player.stats.maxHp;
        
        ModalManager.hide();
        GameManager.init();
    }
};

// === PROFILE MANAGER ===
const ProfileManager = {
    addXp(amount) {
        state.player.xp += amount;
        while (state.player.xp >= state.player.xpToNextLevel) {
            this.levelUp();
        }
        this.updateAllProfileUI();
    },
    
    levelUp() {
        state.player.xp -= state.player.xpToNextLevel;
        state.player.level++;
        state.player.xpToNextLevel = Math.floor(state.player.xpToNextLevel * 1.2);
        state.player.attributePoints += 40; // GDD Change
        showToast(`You have reached Level ${state.player.level}! You gained 40 Attribute Points.`);
        this.calculateAllStats();
        state.player.hp = state.player.stats.maxHp;
        TeleportManager.populateZoneList();
        QuestManager.assignQuests(); // Re-assign quests on level up
    },
    
    spendAttributePoint(clickedAttr) {
        if (state.player.attributePoints < 40) {
            showToast("You need 40 points to allocate.", true);
            return;
        }
        
        const gains = { STR: 0, DEX: 0, VIT: 0, NTL: 0, WIS: 0 };
        
        if (clickedAttr === 'STR') gains.STR = 10;
        else if (clickedAttr === 'DEX') gains.DEX = 10;
        else if (clickedAttr === 'VIT') gains.VIT = 10;
        else if (clickedAttr === 'NTL') gains.NTL = 10;
        else if (clickedAttr === 'WIS') gains.WIS = 10;
        
        // Apply gains
        const p = state.player;
        for (const stat in gains) {
            p.baseStats[stat] += gains[stat];
        }
        
        p.attributePoints -= 40;
        this.calculateAllStats();
        
        // Flash the updated stat value
        setTimeout(() => {
            const statValueEl = document.querySelector(`#stat-${clickedAttr.toLowerCase()}-value`);
            if (statValueEl) {
                statValueEl.classList.add('flash-update');
                setTimeout(() => statValueEl.classList.remove('flash-update'), 500);
            }
        }, 100);
        
        this.updateAllProfileUI();
        showToast(`+10 ${clickedAttr}!`);
    },
    
    calculateAllStats() {
        const p = state.player;
        const stats = p.stats;
        
        // Calculate max HP
        stats.maxHp = 100 + (p.baseStats.VIT * 10) + ((p.level - 1) * 25);
        
        // Calculate weapon and spell class
        if (p.class === 'Fighter') {
            stats.weaponClass = Math.floor(1 + (p.baseStats.STR * 0.5) + (p.level * 0.8));
            stats.spellClass = Math.floor(1 + (p.baseStats.NTL * 0.3) + (p.level * 0.4));
        } else {
            stats.weaponClass = Math.floor(1 + (p.baseStats.STR * 0.3) + (p.level * 0.4));
            stats.spellClass = Math.floor(1 + (p.baseStats.NTL * 0.5) + (p.level * 0.8));
        }
        
        // Calculate armor class
        stats.armorClass = Math.floor(p.baseStats.VIT * 0.3);
        
        // Calculate hit chance
        stats.hitChance = 75 + Math.floor(p.baseStats.DEX * 0.5);
        
        // Ensure HP doesn't exceed max
        if (p.hp > stats.maxHp) {
            p.hp = stats.maxHp;
        }
    },
    
    healPlayer() {
        state.player.hp = state.player.stats.maxHp;
        this.updateAllProfileUI();
        showToast("You have been healed!");
        addChatMessage('Player healed to full health.');
    },
    
    updateAllProfileUI() {
        const p = state.player;
        
        // Update player status
        if (ui.playerLevel) ui.playerLevel.textContent = p.level;
        if (ui.playerName) ui.playerName.textContent = p.name;
        if (ui.playerGold) ui.playerGold.textContent = p.gold.toLocaleString();
        
        // Update health bar
        if (ui.playerHealthBar && ui.playerHealthNumeric) {
            const healthPercent = (p.hp / p.stats.maxHp) * 100;
            ui.playerHealthBar.style.width = `${healthPercent}%`;
            ui.playerHealthNumeric.textContent = `${p.hp}/${p.stats.maxHp}`;
        }
        
        // Update experience bar
        if (ui.playerExpBar && ui.playerExp && ui.playerExpNext) {
            const expPercent = (p.xp / p.xpToNextLevel) * 100;
            ui.playerExpBar.style.width = `${expPercent}%`;
            ui.playerExp.textContent = p.xp.toLocaleString();
            ui.playerExpNext.textContent = p.xpToNextLevel.toLocaleString();
        }
        
        // Update character tab
        if (ui.charName) ui.charName.textContent = p.name;
        if (ui.charRace) ui.charRace.textContent = p.race;
        if (ui.charClass) ui.charClass.textContent = p.class;
        if (ui.attributePoints) ui.attributePoints.textContent = p.attributePoints;
        
        // Update stats accordion
        this.renderStatsAccordion();
    },
    
    renderStatsAccordion() {
        if (!ui.statsContainer) return;
        
        const p = state.player;
        const statsData = [
            {
                title: "Core Attributes",
                icon: "⚡",
                stats: [
                    { name: "Strength", icon: "💪", value: p.baseStats.STR, id: "str", canAllocate: true },
                    { name: "Dexterity", icon: "🏃", value: p.baseStats.DEX, id: "dex", canAllocate: true },
                    { name: "Vitality", icon: "❤️", value: p.baseStats.VIT, id: "vit", canAllocate: true },
                    { name: "Intelligence", icon: "🧠", value: p.baseStats.NTL, id: "ntl", canAllocate: true },
                    { name: "Wisdom", icon: "🔮", value: p.baseStats.WIS, id: "wis", canAllocate: true }
                ]
            },
            {
                title: "Combat Stats",
                icon: "⚔️",
                stats: [
                    { name: "Max Health", icon: "❤️", value: p.stats.maxHp },
                    { name: "Weapon Class", icon: "⚔️", value: p.stats.weaponClass },
                    { name: "Spell Class", icon: "🔮", value: p.stats.spellClass },
                    { name: "Armor Class", icon: "🛡️", value: p.stats.armorClass },
                    { name: "Hit Chance", icon: "🎯", value: `${p.stats.hitChance}%` }
                ]
            }
        ];
        
        ui.statsContainer.innerHTML = statsData.map(section => `
            <div class="stat-accordion-item">
                <div class="stat-accordion-header" onclick="toggleAccordion(this)">
                    <h3>${section.icon} ${section.title}</h3>
                    <div class="accordion-arrow">▶</div>
                </div>
                <div class="stat-accordion-content">
                    ${section.stats.map(stat => `
                        <div class="stat-line">
                            <span class="stat-icon">${stat.icon}</span>
                            <span class="stat-name">${stat.name}</span>
                            <span class="stat-value" id="stat-${stat.id || stat.name.toLowerCase().replace(' ', '-')}-value">${stat.value}</span>
                            ${stat.canAllocate ? `
                                <button class="attr-btn" onclick="ProfileManager.spendAttributePoint('${stat.id.toUpperCase()}')" 
                                        ${p.attributePoints < 40 ? 'disabled' : ''}>+</button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
};

// === MODAL MANAGER ===
const ModalManager = {
    show(title, content, options = {}) {
        const existingModal = document.querySelector('.modal-backdrop');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="glass-panel p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 class="font-orbitron text-xl">${title}</h2>
                    <button class="modal-close text-2xl leading-none">&times;</button>
                </div>
                <div class="modal-content flex-grow overflow-y-auto custom-scrollbar">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal;
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        
        // Call content ready callback
        if (options.onContentReady) {
            const contentDiv = modal.querySelector('.modal-content');
            options.onContentReady(contentDiv);
        }
        
        return modal;
    },
    
    hide() {
        const modal = document.querySelector('.modal-backdrop');
        if (modal) {
            modal.remove();
        }
    }
};

// === WORLD MAP MANAGER ===
const WorldMapManager = {
    isInitialized: false,
    grid: new Map(),
    playerPos: { q: 0, r: 0 },
    hexSize: 18,
    ctx: null,
    
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        ui.miniMapCanvas.width = ui.miniMapContainer.clientWidth * 2;
        ui.miniMapCanvas.height = ui.miniMapContainer.clientHeight * 2;
        ui.miniMapCanvas.style.width = `${ui.miniMapContainer.clientWidth}px`;
        ui.miniMapCanvas.style.height = `${ui.miniMapContainer.clientHeight}px`;
        
        this.ctx = ui.miniMapCanvas.getContext('2d');
        this.generateGrid();
        this.updateInteractButton();
        this.draw();
    },
    
    generateGrid() {
        for (let q = -3; q <= 3; q++) {
            for (let r = -3; r <= 3; r++) {
                const s = -q - r;
                if (s >= -3 && s <= 3) {
                    this.grid.set(`${q},${r}`, {
                        q, r, s,
                        feature: { name: 'Monster Zone', icon: '◻️' }
                    });
                }
            }
        }
        
        // Set special locations
        this.grid.get('1,-1').feature = { name: 'Weapons/Combat Shop', icon: '⚔️' };
        this.grid.get('-1,1').feature = { name: 'Magic/Accessories Shop', icon: '🔮' };
        this.grid.get('2,0').feature = { name: 'Bank', icon: '🏧' };
        this.grid.get('-2,0').feature = { name: 'Sanctuary', icon: '🆘' };
        this.grid.get('0,2').feature = { name: 'Teleport Zone', icon: '🌀' };
    },
    
    movePlayer(dq, dr) {
        const newQ = this.playerPos.q + dq;
        const newR = this.playerPos.r + dr;
        
        if (this.grid.has(`${newQ},${newR}`)) {
            this.playerPos.q = newQ;
            this.playerPos.r = newR;
            this.draw();
            this.updateInteractButton();
            
            const currentHex = this.grid.get(`${this.playerPos.q},${this.playerPos.r}`);
            if (currentHex && currentHex.feature && currentHex.feature.name === 'Monster Zone') {
                CombatManager.populateMonsterList(state.game.currentZoneTier);
            } else {
                CombatManager.clearMonsterList();
            }
            
            // Update location display
            if (ui.currentLocation) {
                ui.currentLocation.textContent = currentHex.feature.name;
            }
        }
    },
    
    updateInteractButton() {
        const currentHex = this.grid.get(`${this.playerPos.q},${this.playerPos.r}`);
        if (currentHex && currentHex.feature && currentHex.feature.name !== 'Monster Zone') {
            ui.keyInteract.textContent = 'Enter';
            ui.keyInteract.style.fontSize = '14px';
        } else {
            ui.keyInteract.textContent = 'Interact';
            ui.keyInteract.style.fontSize = '16px';
        }
    },
    
    handleInteraction() {
        const currentHex = this.grid.get(`${this.playerPos.q},${this.playerPos.r}`);
        if (currentHex && currentHex.feature) {
            if (currentHex.feature.name === 'Weapons/Combat Shop') {
                ShopManager.openShop('armory');
            } else if (currentHex.feature.name === 'Magic/Accessories Shop') {
                ShopManager.openShop('magic');
            } else if (currentHex.feature.name === 'Bank') {
                BankManager.openBank();
            } else if (currentHex.feature.name === 'Sanctuary') {
                ProfileManager.healPlayer();
            } else if (currentHex.feature.name === 'Teleport Zone') {
                TeleportManager.showModal();
            }
        }
    },
    
    draw() {
        const canvas = ui.miniMapCanvas;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        this.grid.forEach(hex => {
            const relQ = hex.q - this.playerPos.q;
            const relR = hex.r - this.playerPos.r;
            const {x, y} = this.hexToPixel(relQ, relR, this.hexSize);
            this.drawHex(centerX + x, centerY + y, this.hexSize, hex.feature);
        });
        
        this.drawPlayer(centerX, centerY);
    },
    
    hexToPixel(q, r, size) {
        const x = size * (3/2 * q);
        const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return {x, y};
    },
    
    drawHex(cx, cy, size, feature) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = 2 * Math.PI / 6 * (i + 0.5);
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        if (feature) {
            this.ctx.font = `${size * 1.5}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(feature.icon, cx, cy);
        }
    },
    
    drawPlayer(cx, cy) {
        this.ctx.font = `${this.hexSize * 1.5}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#f97316';
        this.ctx.fillText('🟠', cx, cy);
    }
};

// === COMBAT MANAGER ===
const CombatManager = {
    selectedMonster: null,
    
    populateMonsterList(zoneTier) {
        if (!ui.monsterListContainer || !ui.monsterList) return;
        
        // Show monster list
        ui.monsterListContainer.style.display = 'block';
        
        // Sample monsters based on zone tier
        const monsters = [
            { id: 'goblin', name: 'Goblin Warrior', level: zoneTier, health: 50 + (zoneTier * 25) },
            { id: 'orc', name: 'Orc Berserker', level: zoneTier + 1, health: 75 + (zoneTier * 30) },
            { id: 'skeleton', name: 'Skeleton Archer', level: zoneTier, health: 40 + (zoneTier * 20) }
        ];
        
        ui.monsterList.innerHTML = monsters.map(monster => `
            <div class="monster-item" data-monster-id="${monster.id}">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold">${monster.name}</div>
                        <div class="text-sm text-gray-400">Level ${monster.level}</div>
                    </div>
                    <div class="text-sm text-red-400">${monster.health} HP</div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        ui.monsterList.querySelectorAll('.monster-item').forEach(item => {
            item.addEventListener('click', () => {
                const monsterId = item.dataset.monsterId;
                const monster = monsters.find(m => m.id === monsterId);
                this.selectMonster(monster);
            });
        });
    },
    
    clearMonsterList() {
        if (ui.monsterListContainer) {
            ui.monsterListContainer.style.display = 'none';
        }
        if (ui.combatInterface) {
            ui.combatInterface.style.display = 'none';
        }
        this.selectedMonster = null;
    },
    
    selectMonster(monster) {
        this.selectedMonster = monster;
        
        // Update selected state
        ui.monsterList.querySelectorAll('.monster-item').forEach(item => {
            item.classList.remove('selected');
        });
        ui.monsterList.querySelector(`[data-monster-id="${monster.id}"]`).classList.add('selected');
        
        // Show combat interface
        ui.combatInterface.style.display = 'block';
        ui.selectedMonsterName.textContent = monster.name;
        ui.selectedMonsterLevel.textContent = monster.level;
        ui.selectedMonsterHealth.textContent = `${monster.health} HP`;
        
        state.ui.isInCombat = true;
    },
    
    attack() {
        if (!this.selectedMonster) return;
        
        const damage = Math.floor(Math.random() * state.player.stats.weaponClass) + 5;
        this.selectedMonster.health -= damage;
        
        addChatMessage(`You attack ${this.selectedMonster.name} for ${damage} damage!`);
        
        if (this.selectedMonster.health <= 0) {
            this.defeatMonster();
        } else {
            ui.selectedMonsterHealth.textContent = `${this.selectedMonster.health} HP`;
            this.monsterAttack();
        }
    },
    
    cast() {
        if (!this.selectedMonster) return;
        
        const damage = Math.floor(Math.random() * state.player.stats.spellClass) + 3;
        this.selectedMonster.health -= damage;
        
        addChatMessage(`You cast a spell on ${this.selectedMonster.name} for ${damage} magic damage!`);
        
        if (this.selectedMonster.health <= 0) {
            this.defeatMonster();
        } else {
            ui.selectedMonsterHealth.textContent = `${this.selectedMonster.health} HP`;
            this.monsterAttack();
        }
    },
    
    monsterAttack() {
        if (!this.selectedMonster) return;
        
        const damage = Math.floor(Math.random() * 10) + 3;
        const actualDamage = Math.max(1, damage - state.player.stats.armorClass);
        
        state.player.hp -= actualDamage;
        addChatMessage(`${this.selectedMonster.name} attacks you for ${actualDamage} damage!`);
        
        if (state.player.hp <= 0) {
            state.player.hp = 0;
            addChatMessage('You have been defeated!', 'error');
            this.clearMonsterList();
        }
        
        ProfileManager.updateAllProfileUI();
    },
    
    defeatMonster() {
        const expGained = Math.floor(this.selectedMonster.level * 25);
        const goldGained = Math.floor(this.selectedMonster.level * 10);
        
        addChatMessage(`${this.selectedMonster.name} defeated!`);
        addChatMessage(`Gained ${expGained} XP and ${goldGained} gold!`);
        
        ProfileManager.addXp(expGained);
        state.player.gold += goldGained;
        
        this.clearMonsterList();
        ProfileManager.updateAllProfileUI();
    }
};

// === TELEPORT MANAGER ===
const TeleportManager = {
    showModal() {
        if (ui.zonePopupModal) {
            ui.zonePopupModal.classList.remove('hidden');
            this.populateZoneList();
        }
    },
    
    hideModal() {
        if (ui.zonePopupModal) {
            ui.zonePopupModal.classList.add('hidden');
        }
    },
    
    populateZoneList() {
        if (!ui.zoneListContainer) return;
        
        const zones = [
            { id: 1, name: 'Crystal Caves (Dwarf)', levelReq: 1 },
            { id: 2, name: 'Elven Forest', levelReq: 10 },
            { id: 3, name: 'Orc Stronghold', levelReq: 25 },
            { id: 4, name: 'Dragon Lair', levelReq: 50 }
        ];
        
        ui.zoneListContainer.innerHTML = zones.map(zone => {
            const canEnter = state.player.level >= zone.levelReq;
            return `
                <li class="${canEnter ? '' : 'disabled'}" data-zone-id="${zone.id}">
                    <div class="flex justify-between items-center">
                        <span>${zone.name}</span>
                        <span class="text-sm text-gray-400">Lv.${zone.levelReq}</span>
                    </div>
                </li>
            `;
        }).join('');
        
        // Add click handlers
        ui.zoneListContainer.querySelectorAll('li:not(.disabled)').forEach(item => {
            item.addEventListener('click', () => {
                const zoneId = parseInt(item.dataset.zoneId);
                this.teleportToZone(zoneId);
            });
        });
    },
    
    teleportToZone(zoneId) {
        state.game.currentZoneTier = zoneId;
        showToast(`Teleported to zone ${zoneId}!`);
        addChatMessage(`Teleported to zone tier ${zoneId}`);
        
        // Reset world map position
        WorldMapManager.playerPos = { q: 0, r: 0 };
        WorldMapManager.draw();
        WorldMapManager.updateInteractButton();
        
        this.hideModal();
    }
};

// === SHOP & BANK MANAGERS ===
const ShopManager = {
    openShop(shopType) {
        const contentHTML = `
            <div class="p-4 text-center">
                <h3 class="font-orbitron text-lg mb-2">Welcome to the ${shopType} Shop!</h3>
                <p class="text-gray-400">Shop functionality coming soon...</p>
                <div class="mt-4">
                    <div class="text-sm text-gray-400 mb-2">Sample Items:</div>
                    <div class="space-y-2">
                        <div class="flex justify-between p-2 bg-black/20 rounded">
                            <span>Iron Sword</span>
                            <span class="text-yellow-400">100g</span>
                        </div>
                        <div class="flex justify-between p-2 bg-black/20 rounded">
                            <span>Steel Armor</span>
                            <span class="text-yellow-400">250g</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        ModalManager.show(`${shopType.charAt(0).toUpperCase() + shopType.slice(1)} Shop`, contentHTML);
    }
};

const BankManager = {
    openBank() {
        const contentHTML = `
            <div class="p-4 text-center">
                <div class="grid grid-cols-2 gap-4 mb-4 text-lg">
                    <div>
                        <div class="text-sm text-gray-400 font-orbitron">Your Gold</div>
                        <div id="bank-player-gold" class="font-bold text-yellow-400 font-orbitron">${state.player.gold.toLocaleString()}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400 font-orbitron">Banked Gold</div>
                        <div id="bank-vault-gold" class="font-bold text-yellow-400 font-orbitron">${state.player.bankGold.toLocaleString()}</div>
                    </div>
                </div>
                <input type="number" id="bank-amount-input" class="w-full p-2 rounded text-lg text-black bg-gray-200" placeholder="Enter amount...">
                <div class="grid grid-cols-2 gap-2 mt-4">
                    <button id="bank-deposit-btn" class="glass-button py-2 rounded-md">Deposit</button>
                    <button id="bank-withdraw-btn" class="glass-button py-2 rounded-md">Withdraw</button>
                </div>
            </div>
        `;
        
        ModalManager.show('Bank Vault', contentHTML, {
            onContentReady: (contentDiv) => {
                contentDiv.querySelector('#bank-deposit-btn').addEventListener('click', () => this.handleTransaction('deposit'));
                contentDiv.querySelector('#bank-withdraw-btn').addEventListener('click', () => this.handleTransaction('withdraw'));
            }
        });
    },
    
    handleTransaction(type) {
        const input = document.getElementById('bank-amount-input');
        const amount = parseInt(input.value);
        
        if (isNaN(amount) || amount <= 0) {
            showToast("Please enter a valid amount.", true);
            return;
        }
        
        if (type === 'deposit') {
            if (amount > state.player.gold) {
                showToast("You don't have enough gold to deposit.", true);
                return;
            }
            state.player.gold -= amount;
            state.player.bankGold += amount;
            showToast(`Deposited ${amount.toLocaleString()} gold.`);
        } else if (type === 'withdraw') {
            if (amount > state.player.bankGold) {
                showToast("You don't have enough gold in the bank.", true);
                return;
            }
            state.player.bankGold -= amount;
            state.player.gold += amount;
            showToast(`Withdrew ${amount.toLocaleString()} gold.`);
        }
        
        input.value = '';
        ProfileManager.updateAllProfileUI();
        document.getElementById('bank-player-gold').textContent = state.player.gold.toLocaleString();
        document.getElementById('bank-vault-gold').textContent = state.player.bankGold.toLocaleString();
    }
};

// === QUEST MANAGER ===
const QuestManager = {
    questData: {},
    
    assignQuests() {
        // Sample quest assignment based on level
        addChatMessage('New quests available!');
    },
    
    renderQuestTab() {
        // Quest tab rendering logic
    }
};

// === GAME MANAGER ===
const GameManager = {
    init() {
        this.setupEventListeners();
        this.setupTabSystem();
        WorldMapManager.init();
        ProfileManager.updateAllProfileUI();
        addChatMessage('Welcome to Geminus!');
        
        // Initialize with some sample data
        state.player.inventory = [
            { id: 'sample_sword', name: 'Iron Sword', type: 'Weapon', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1412.png' },
            { id: 'sample_helm', name: 'Iron Helm', type: 'Helmet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1396.png' }
        ];
        
        state.player.gems = [
            { id: 'lorestone', grade: 1, abbreviation: 'LST' },
            { id: 'warstone', grade: 1, abbreviation: 'WST' },
            { id: 'true_core', grade: 2, abbreviation: 'TRC' }
        ];
        
        this.renderInventory();
        this.renderGemPouch();
        this.renderEquipment();
    },
    
    setupEventListeners() {
        // Movement controls
        ui.keyUp.addEventListener('click', () => WorldMapManager.movePlayer(0, -1));
        ui.keyDown.addEventListener('click', () => WorldMapManager.movePlayer(0, 1));
        ui.keyLeft.addEventListener('click', () => WorldMapManager.movePlayer(-1, 0));
        ui.keyRight.addEventListener('click', () => WorldMapManager.movePlayer(1, 0));
        ui.keyInteract.addEventListener('click', () => WorldMapManager.handleInteraction());
        
        // Combat controls
        if (ui.attackBtn) ui.attackBtn.addEventListener('click', () => CombatManager.attack());
        if (ui.castBtn) ui.castBtn.addEventListener('click', () => CombatManager.cast());
        
        // Teleport
        if (ui.teleportBtn) ui.teleportBtn.addEventListener('click', () => TeleportManager.showModal());
        if (ui.closeZonePopup) ui.closeZonePopup.addEventListener('click', () => TeleportManager.hideModal());
        
        // Settings
        if (ui.saveGameBtn) ui.saveGameBtn.addEventListener('click', saveGameState);
        if (ui.loadGameBtn) ui.loadGameBtn.addEventListener('click', loadGameState);
        if (ui.resetGameBtn) ui.resetGameBtn.addEventListener('click', resetGame);
        
        // Close modals on backdrop click
        if (ui.statInfoBackdrop) {
            ui.statInfoBackdrop.addEventListener('click', () => {
                ui.statInfoModal.style.display = 'none';
            });
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    WorldMapManager.movePlayer(0, -1);
                    e.preventDefault();
                    break;
                case 's':
                case 'arrowdown':
                    WorldMapManager.movePlayer(0, 1);
                    e.preventDefault();
                    break;
                case 'a':
                case 'arrowleft':
                    WorldMapManager.movePlayer(-1, 0);
                    e.preventDefault();
                    break;
                case 'd':
                case 'arrowright':
                    WorldMapManager.movePlayer(1, 0);
                    e.preventDefault();
                    break;
                case 'e':
                case ' ':
                    WorldMapManager.handleInteraction();
                    e.preventDefault();
                    break;
            }
        });
    },
    
    setupTabSystem() {
        // Main tab switching
        document.querySelectorAll('.main-tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchMainTab(tabName);
            });
        });
        
        // Inventory bag tabs
        document.querySelectorAll('.inventory-bag-tab').forEach(button => {
            button.addEventListener('click', () => {
                const bagName = button.dataset.bag;
                this.switchInventoryBag(bagName);
            });
        });
    },
    
    switchMainTab(tabName) {
        // Update button states
        document.querySelectorAll('.main-tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update panel visibility
        document.querySelectorAll('.tab-content').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        state.ui.activeTab = tabName;
    },
    
    switchInventoryBag(bagName) {
        document.querySelectorAll('.inventory-bag-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-bag="${bagName}"]`).classList.add('active');
        
        state.ui.activeBag = bagName;
        this.renderInventory();
    },
    
    renderInventory() {
        if (!ui.inventoryGrid) return;
        
        let items = state.player.inventory;
        
        // Filter by bag if not showing all
        if (state.ui.activeBag !== 'all') {
            const bagTypes = {
                'Weapon Chest': ['Weapon'],
                'Bag of Gear': ['Helmet', 'Armor', 'Leggings', 'Boots', 'Gauntlets'],
                'Jewelry Box': ['Amulet', 'Ring'],
                'Spell Satchel': ['Spellbook']
            };
            
            const allowedTypes = bagTypes[state.ui.activeBag] || [];
            items = items.filter(item => allowedTypes.includes(item.type));
        }
        
        ui.inventoryGrid.innerHTML = items.map(item => `
            <div class="inventory-slot" data-item-id="${item.id}">
                <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
                <div class="item-label">${item.name}</div>
            </div>
        `).join('');
        
        // Add empty slots to fill grid
        const totalSlots = 24;
        for (let i = items.length; i < totalSlots; i++) {
            ui.inventoryGrid.innerHTML += '<div class="inventory-slot"></div>';
        }
    },
    
    renderGemPouch() {
        if (!ui.gemPouchGrid) return;
        
        ui.gemPouchGrid.innerHTML = state.player.gems.map(gem => {
            const gemData = GameData.Gems[gem.id];
            if (!gemData) return '';
            
            return `
                <div class="gem-item" data-gem-id="${gem.id}">
                    <img src="${gemData.imageUrl}" alt="${gemData.name}" loading="lazy">
                    <div class="absolute bottom-1 right-1 text-xs bg-black/70 px-1 rounded">
                        G${gem.grade}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderEquipment() {
        if (!ui.equipmentGrid) return;
        
        ui.equipmentGrid.innerHTML = GameData.equipmentSlotConfig.map(slot => `
            <div class="equipment-slot-wrapper">
                <div class="equipment-slot-title">${slot.name}</div>
                <div class="equipment-slot-content" data-slot="${slot.name}">
                    <span class="text-gray-500 text-sm">Empty</span>
                </div>
            </div>
        `).join('');
    }
};

// === INITIALIZATION ===
async function loadGameData() {
    try {
        // In a real project, you would fetch from zones.json, items.json, etc.
        console.log("Game data loaded successfully.");
    } catch (error) {
        console.error("Failed to load game data:", error);
        showToast("CRITICAL ERROR: Could not load game data. Please refresh.", true);
    }
}

async function main() {
    await loadGameData();
    
    // Check if player already exists
    const saved = localStorage.getItem('geminusGameState');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            if (savedState.player && savedState.player.name) {
                // Player exists, start game
                state = { ...state, ...savedState };
                GameManager.init();
                return;
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    }
    
    // No saved player, show creation
    CreationManager.init();
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', main);

// Global exports
window.ProfileManager = ProfileManager;
window.CreationManager = CreationManager;
window.WorldMapManager = WorldMapManager;
window.CombatManager = CombatManager;
window.TeleportManager = TeleportManager;
window.GameManager = GameManager;
window.ModalManager = ModalManager;
window.showToast = showToast;
window.saveGameState = saveGameState;
window.loadGameState = loadGameState;
window.resetGame = resetGame;
window.addChatMessage = addChatMessage;
window.toggleAccordion = function(element) {
    const item = element.parentElement;
    item.classList.toggle('open');
};