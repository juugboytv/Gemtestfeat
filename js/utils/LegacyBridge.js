/**
 * LegacyBridge.js - Bridge between old monolithic code and new modular system
 * Ensures backward compatibility while gradually migrating to new architecture
 */

class LegacyBridge {
    constructor() {
        this.bridgeActive = false;
        this.legacyManagers = new Map();
    }

    init() {
        this.setupStateBridge();
        this.setupEventBridge();
        this.setupUIBridge();
        this.setupDataBridge();
        this.bridgeActive = true;
        console.log('LegacyBridge initialized - maintaining backward compatibility');
    }

    setupStateBridge() {
        // Bridge between old global 'state' variable and new StateManager
        if (window.stateManager && typeof state !== 'undefined') {
            // Migrate existing state to StateManager
            const currentState = window.state || {};
            
            // Merge existing state with StateManager
            if (currentState.player) {
                window.stateManager.updatePlayer(currentState.player, false);
            }
            if (currentState.ui) {
                window.stateManager.updateUI(currentState.ui, false);
            }
            if (currentState.game) {
                window.stateManager.updateGame(currentState.game, false);
            }
            if (currentState.keyState) {
                window.stateManager.updateKeyState(currentState.keyState, false);
            }

            // Create live proxy for backward compatibility
            window.state = new Proxy(window.stateManager.getFullState(), {
                get(target, prop) {
                    return window.stateManager.getFullState()[prop];
                },
                set(target, prop, value) {
                    const updates = { [prop]: value };
                    switch (prop) {
                        case 'player':
                            window.stateManager.updatePlayer(value);
                            break;
                        case 'ui':
                            window.stateManager.updateUI(value);
                            break;
                        case 'game':
                            window.stateManager.updateGame(value);
                            break;
                        case 'keyState':
                            window.stateManager.updateKeyState(value);
                            break;
                        default:
                            // Handle other properties
                            break;
                    }
                    return true;
                }
            });
        }
    }

    setupEventBridge() {
        // Bridge old direct function calls to new event system
        if (window.eventBus) {
            // Map common game events to legacy manager updates
            window.eventBus.on('player.levelUp', (data) => {
                if (window.ProfileManager && window.ProfileManager.updateAllProfileUI) {
                    window.ProfileManager.updateAllProfileUI();
                }
                if (window.UIManager && window.UIManager.flashStatUpdate) {
                    window.UIManager.flashStatUpdate('level');
                }
            });

            window.eventBus.on('player.experienceGain', (data) => {
                if (window.ProfileManager && window.ProfileManager.updateAllProfileUI) {
                    window.ProfileManager.updateAllProfileUI();
                }
            });

            window.eventBus.on('inventory.itemEquipped', (data) => {
                if (window.EquipmentManager && window.EquipmentManager.updateAllViews) {
                    window.EquipmentManager.updateAllViews();
                }
                if (window.ProfileManager && window.ProfileManager.calculateAllStats) {
                    window.ProfileManager.calculateAllStats();
                }
            });

            window.eventBus.on('ui.tabChanged', (data) => {
                if (window.TabManager && window.TabManager.updateTabContent) {
                    window.TabManager.updateTabContent(data.tabId);
                }
            });
        }
    }

    setupUIBridge() {
        // Bridge old UI management with new UIElements
        if (window.uiElements && typeof ui !== 'undefined') {
            // Create proxy for backward compatibility
            window.ui = new Proxy(window.uiElements.ui, {
                get(target, prop) {
                    return window.uiElements.get(prop) || target[prop];
                },
                set(target, prop, value) {
                    target[prop] = value;
                    return true;
                }
            });

            // Bridge common UI functions
            if (!window.showToast) {
                window.showToast = (message, isError) => {
                    window.uiElements.showToast(message, isError);
                };
            }

            if (!window.logToGame) {
                window.logToGame = (message, type) => {
                    window.uiElements.logToGame(message, type);
                };
            }
        }
    }

    setupDataBridge() {
        // Bridge old direct API calls with new DataService
        if (window.dataService) {
            // Create backward-compatible API functions
            window.legacyAPI = {
                initGame: () => window.dataService.initializeGame(),
                getZones: () => window.dataService.getZones(),
                teleport: (zoneId) => window.dataService.teleportToZone(zoneId),
                movePlayer: (q, r) => window.dataService.movePlayer(q, r),
                attack: (monsterId) => window.dataService.attackMonster(monsterId),
                equipItem: (itemId, slot) => window.dataService.equipItem(itemId, slot)
            };

            // Auto-sync when state changes
            if (window.stateManager) {
                window.stateManager.subscribe('player', (data) => {
                    // Debounce server updates
                    clearTimeout(this.syncTimeout);
                    this.syncTimeout = setTimeout(() => {
                        window.dataService.queuePlayerUpdate(data.changes);
                    }, 1000);
                });
            }
        }
    }

    // Manager registration system for gradual migration
    registerLegacyManager(name, manager) {
        this.legacyManagers.set(name, manager);
        
        // Set up event bridging for this manager
        if (window.eventBus && manager.updateAllViews) {
            window.eventBus.on(`manager.${name}.update`, () => {
                manager.updateAllViews();
            });
        }
    }

    getLegacyManager(name) {
        return this.legacyManagers.get(name);
    }

    // Migration helpers
    migrateManagerToEvents(managerName) {
        const manager = this.legacyManagers.get(managerName);
        if (!manager || !window.eventBus) return;

        // Wrap manager methods with event emissions
        const originalMethods = {};
        
        ['init', 'updateAllViews', 'refresh'].forEach(methodName => {
            if (typeof manager[methodName] === 'function') {
                originalMethods[methodName] = manager[methodName];
                manager[methodName] = (...args) => {
                    const result = originalMethods[methodName].apply(manager, args);
                    window.eventBus.emit(`manager.${managerName}.${methodName}`, { args, result });
                    return result;
                };
            }
        });
    }

    // Cleanup methods for eventual migration completion
    removeLegacyState() {
        if (this.bridgeActive && window.stateManager) {
            // Remove the proxy and switch to direct StateManager usage
            delete window.state;
            console.log('Legacy state bridge removed');
        }
    }

    removeLegacyUI() {
        if (this.bridgeActive && window.uiElements) {
            // Remove UI proxy
            delete window.ui;
            delete window.showToast;
            delete window.logToGame;
            console.log('Legacy UI bridge removed');
        }
    }

    // Status and debugging
    getBridgeStatus() {
        return {
            active: this.bridgeActive,
            managersRegistered: this.legacyManagers.size,
            stateManager: !!window.stateManager,
            eventBus: !!window.eventBus,
            dataService: !!window.dataService,
            uiElements: !!window.uiElements
        };
    }

    // Development helpers
    debugState() {
        console.log('Legacy Bridge Status:', this.getBridgeStatus());
        console.log('Current State:', window.stateManager?.getFullState());
        console.log('Event Stats:', window.eventBus?.getEventStats());
    }

    // Gradual migration utilities
    scheduleManagerMigration(managerName, delay = 5000) {
        setTimeout(() => {
            this.migrateManagerToEvents(managerName);
            console.log(`Manager ${managerName} migrated to event system`);
        }, delay);
    }

    // Error handling for transition period
    handleLegacyError(error, context) {
        console.error(`Legacy bridge error in ${context}:`, error);
        
        if (window.eventBus) {
            window.eventBus.emitSystemEvent('bridgeError', {
                error: error.message,
                context,
                timestamp: Date.now()
            });
        }
    }
}

// Create global instance
window.legacyBridge = new LegacyBridge();

// Helper function to check if we're in transition period
window.isLegacyMode = () => {
    return window.legacyBridge?.bridgeActive || false;
};

// Helper function for conditional legacy support
window.withLegacySupport = (newFunction, legacyFunction) => {
    return window.isLegacyMode() ? legacyFunction : newFunction;
};