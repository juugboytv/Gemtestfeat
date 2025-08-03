/**
 * StateManager.js - Centralized state management for the entire game
 * Handles player data, game state, inventory management with consistent patterns
 */

class StateManager {
    constructor() {
        this.state = {
            player: {
                id: null,
                level: 1,
                health: 200,
                maxHealth: 200,
                experience: 0,
                gold: 0,
                currentZoneId: 1,
                position: { q: 0, r: 0 },
                baseStats: { STR: 10, DEX: 10, VIT: 10, NTL: 10, WIS: 10 },
                stats: {},
                attributePoints: 0,
                equipment: {},
                inventory: [],
                gems: [],
                class: 'Fighter',
                activeQuests: [],
                questStreak: 0,
                questPool: { xp: 0, gold: 0, items: [] }
            },
            ui: {
                isFocused: false,
                selectedInventoryId: null,
                selectedGemId: null,
                currentTab: 'equipment',
                theme: 'molten-core'
            },
            game: {
                combatActive: false,
                currentZoneTier: 1,
                globalJackpot: 0,
                serverConnected: false,
                lastSaveTime: null
            },
            keyState: {
                up: false,
                left: false,
                down: false,
                right: false,
                interact: false
            }
        };

        this.subscribers = new Map();
        this.apiQueue = [];
        this.initialized = false;
    }

    init() {
        this.loadFromLocalStorage();
        this.setupAutoSave();
        this.initialized = true;
        this.notifySubscribers('init');
    }

    // State getters
    getPlayer() {
        return this.state.player;
    }

    getUI() {
        return this.state.ui;
    }

    getGame() {
        return this.state.game;
    }

    getKeyState() {
        return this.state.keyState;
    }

    getFullState() {
        return this.state;
    }

    // State updaters with change notifications
    updatePlayer(updates, notify = true) {
        const oldPlayer = { ...this.state.player };
        Object.assign(this.state.player, updates);
        
        if (notify) {
            this.notifySubscribers('player', { 
                old: oldPlayer, 
                new: this.state.player, 
                changes: updates 
            });
        }
        
        this.queueSave();
    }

    updateUI(updates, notify = true) {
        const oldUI = { ...this.state.ui };
        Object.assign(this.state.ui, updates);
        
        if (notify) {
            this.notifySubscribers('ui', { 
                old: oldUI, 
                new: this.state.ui, 
                changes: updates 
            });
        }
    }

    updateGame(updates, notify = true) {
        const oldGame = { ...this.state.game };
        Object.assign(this.state.game, updates);
        
        if (notify) {
            this.notifySubscribers('game', { 
                old: oldGame, 
                new: this.state.game, 
                changes: updates 
            });
        }
    }

    updateKeyState(updates, notify = true) {
        Object.assign(this.state.keyState, updates);
        
        if (notify) {
            this.notifySubscribers('keyState', { 
                new: this.state.keyState, 
                changes: updates 
            });
        }
    }

    // Specialized player management methods
    addExperience(amount) {
        const oldLevel = this.state.player.level;
        this.state.player.experience += amount;
        
        // Level up logic
        const newLevel = this.calculateLevel(this.state.player.experience);
        if (newLevel > oldLevel) {
            this.levelUp(newLevel - oldLevel);
        }
        
        this.notifySubscribers('experience', { amount, oldLevel, newLevel });
        this.queueSave();
    }

    addGold(amount) {
        this.state.player.gold += amount;
        this.notifySubscribers('gold', { amount, total: this.state.player.gold });
        this.queueSave();
    }

    levelUp(levels) {
        const oldLevel = this.state.player.level;
        this.state.player.level += levels;
        this.state.player.attributePoints += levels * 40; // 40 points per level
        
        // Recalculate stats
        if (window.ProfileManager && window.ProfileManager.calculateAllStats) {
            window.ProfileManager.calculateAllStats();
        }
        
        this.notifySubscribers('levelUp', { 
            oldLevel, 
            newLevel: this.state.player.level, 
            levelsGained: levels 
        });
        
        if (window.uiElements) {
            window.uiElements.showToast(`Level Up! You are now level ${this.state.player.level}!`, false);
        }
    }

    calculateLevel(experience) {
        // GDD formula for level calculation
        return Math.floor(Math.log(experience / 100 + 1) / Math.log(1.1)) + 1;
    }

    // Inventory management
    addItem(item) {
        this.state.player.inventory.push(item);
        this.notifySubscribers('itemAdded', { item });
        this.queueSave();
    }

    removeItem(instanceId) {
        const index = this.state.player.inventory.findIndex(item => item.instanceId === instanceId);
        if (index !== -1) {
            const removedItem = this.state.player.inventory.splice(index, 1)[0];
            this.notifySubscribers('itemRemoved', { item: removedItem });
            this.queueSave();
            return removedItem;
        }
        return null;
    }

    equipItem(instanceId, slot) {
        const item = this.state.player.inventory.find(i => i.instanceId === instanceId);
        if (!item) return false;

        // Unequip current item in slot if exists
        const currentEquipped = this.state.player.equipment[slot];
        if (currentEquipped) {
            this.state.player.equipment[slot] = null;
        }

        // Equip new item
        this.state.player.equipment[slot] = instanceId;
        
        this.notifySubscribers('itemEquipped', { 
            item, 
            slot, 
            previousItem: currentEquipped 
        });
        
        this.queueSave();
        return true;
    }

    unequipItem(slot) {
        const equippedId = this.state.player.equipment[slot];
        if (equippedId) {
            this.state.player.equipment[slot] = null;
            const item = this.state.player.inventory.find(i => i.instanceId === equippedId);
            
            this.notifySubscribers('itemUnequipped', { item, slot });
            this.queueSave();
            return item;
        }
        return null;
    }

    // Subscription system for reactive updates
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }
        this.subscribers.get(event).add(callback);
        
        // Return unsubscribe function
        return () => {
            const eventSubs = this.subscribers.get(event);
            if (eventSubs) {
                eventSubs.delete(callback);
            }
        };
    }

    notifySubscribers(event, data = null) {
        const eventSubs = this.subscribers.get(event);
        if (eventSubs) {
            eventSubs.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in subscriber for event ${event}:`, error);
                }
            });
        }
    }

    // Persistence
    saveToLocalStorage() {
        try {
            const saveData = {
                ...this.state,
                timestamp: Date.now()
            };
            localStorage.setItem('geminus_state', JSON.stringify(saveData));
            this.state.game.lastSaveTime = Date.now();
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('geminus_state');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                // Merge saved data with default state structure
                this.state = this.mergeState(this.state, saveData);
                
                console.log('Game state loaded from localStorage');
                return true;
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
        return false;
    }

    mergeState(defaultState, savedState) {
        const merged = { ...defaultState };
        
        for (const key in savedState) {
            if (savedState[key] !== null && typeof savedState[key] === 'object' && !Array.isArray(savedState[key])) {
                merged[key] = this.mergeState(defaultState[key] || {}, savedState[key]);
            } else {
                merged[key] = savedState[key];
            }
        }
        
        return merged;
    }

    // Auto-save system
    setupAutoSave() {
        this.saveQueue = false;
        
        // Save every 30 seconds if changes pending
        setInterval(() => {
            if (this.saveQueue) {
                this.saveToLocalStorage();
                this.saveQueue = false;
            }
        }, 30000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            if (this.saveQueue) {
                this.saveToLocalStorage();
            }
        });
    }

    queueSave() {
        this.saveQueue = true;
    }

    // Server synchronization
    async syncWithServer() {
        if (!window.gameAPI) return;

        try {
            const serverState = await window.gameAPI.getPlayerState();
            if (serverState.success) {
                // Merge server state with local state
                this.updatePlayer(serverState.player);
                this.updateGame({ serverConnected: true });
            }
        } catch (error) {
            console.error('Failed to sync with server:', error);
            this.updateGame({ serverConnected: false });
        }
    }

    // Debug helpers
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    importState(stateJson) {
        try {
            const importedState = JSON.parse(stateJson);
            this.state = this.mergeState(this.state, importedState);
            this.notifySubscribers('stateImported');
            this.queueSave();
            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }

    resetState() {
        const confirmed = confirm('Are you sure you want to reset all game progress?');
        if (confirmed) {
            this.state = {
                player: {
                    id: null, level: 1, health: 200, maxHealth: 200, experience: 0, gold: 0,
                    currentZoneId: 1, position: { q: 0, r: 0 },
                    baseStats: { STR: 10, DEX: 10, VIT: 10, NTL: 10, WIS: 10 },
                    stats: {}, attributePoints: 0, equipment: {}, inventory: [], gems: [],
                    class: 'Fighter', activeQuests: [], questStreak: 0,
                    questPool: { xp: 0, gold: 0, items: [] }
                },
                ui: { isFocused: false, selectedInventoryId: null, selectedGemId: null, currentTab: 'equipment', theme: 'molten-core' },
                game: { combatActive: false, currentZoneTier: 1, globalJackpot: 0, serverConnected: false, lastSaveTime: null },
                keyState: { up: false, left: false, down: false, right: false, interact: false }
            };
            this.saveToLocalStorage();
            this.notifySubscribers('stateReset');
        }
    }
}

// Export singleton instance
window.stateManager = new StateManager();