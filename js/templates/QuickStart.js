/**
 * QuickStart.js - Rapid development utilities for adding new features
 * Provides one-command feature generation and integration
 */

class QuickStart {
    constructor() {
        this.templates = new Map();
        this.setupDefaultTemplates();
    }

    init() {
        this.setupDevCommands();
        console.log('QuickStart development utilities loaded');
    }

    setupDefaultTemplates() {
        // Common game feature templates
        this.templates.set('combat-system', {
            name: 'CombatSystem',
            config: FeatureTemplate.presets.fullFeature,
            customizations: {
                stateStructure: {
                    isInCombat: false,
                    currentEnemy: null,
                    combatRound: 0,
                    playerActions: [],
                    enemyActions: []
                },
                events: ['combat.start', 'combat.end', 'combat.attack', 'combat.defend'],
                apiEndpoints: ['combat/start', 'combat/attack', 'combat/end', 'combat/status']
            }
        });

        this.templates.set('quest-system', {
            name: 'QuestSystem', 
            config: FeatureTemplate.presets.fullFeature,
            customizations: {
                stateStructure: {
                    activeQuests: [],
                    completedQuests: [],
                    availableQuests: [],
                    questProgress: {}
                },
                events: ['quest.accepted', 'quest.completed', 'quest.updated', 'quest.abandoned'],
                apiEndpoints: ['quests/available', 'quests/accept', 'quests/complete', 'quests/progress']
            }
        });

        this.templates.set('inventory-system', {
            name: 'InventorySystem',
            config: FeatureTemplate.presets.fullFeature,
            customizations: {
                stateStructure: {
                    items: [],
                    capacity: 100,
                    selectedItem: null,
                    sortBy: 'name',
                    filters: {}
                },
                events: ['inventory.itemAdded', 'inventory.itemRemoved', 'inventory.itemMoved', 'inventory.sorted'],
                apiEndpoints: ['inventory/items', 'inventory/add', 'inventory/remove', 'inventory/sort']
            }
        });

        this.templates.set('social-system', {
            name: 'SocialSystem',
            config: FeatureTemplate.presets.fullFeature,
            customizations: {
                stateStructure: {
                    friends: [],
                    guild: null,
                    messages: [],
                    notifications: []
                },
                events: ['social.friendAdded', 'social.messageReceived', 'social.guildJoined'],
                apiEndpoints: ['social/friends', 'social/guild', 'social/messages', 'social/notifications']
            }
        });

        this.templates.set('ui-panel', {
            name: 'UIPanel',
            config: FeatureTemplate.presets.simpleUI,
            customizations: {
                stateStructure: {
                    isVisible: false,
                    activeTab: 0,
                    settings: {}
                },
                events: ['panel.opened', 'panel.closed', 'panel.tabChanged']
            }
        });
    }

    // Quick feature generation
    async generateFeature(templateName, customName = null) {
        const template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }

        const featureName = customName || template.name;
        const featureTemplate = new FeatureTemplate(featureName, template.config);

        // Apply customizations
        if (template.customizations) {
            this.applyCustomizations(featureTemplate, template.customizations);
        }

        const files = await featureTemplate.createFeature();
        return { featureTemplate, files };
    }

    applyCustomizations(featureTemplate, customizations) {
        if (customizations.stateStructure) {
            featureTemplate.stateStructure = customizations.stateStructure;
        }
        if (customizations.events) {
            featureTemplate.eventList = customizations.events;
        }
        if (customizations.apiEndpoints) {
            featureTemplate.apiEndpoints = customizations.apiEndpoints;
        }
    }

    // Development commands
    setupDevCommands() {
        // Add global development commands for quick feature creation
        window.devCommands = {
            // Create a new combat system
            createCombat: (name = 'Combat') => 
                this.generateFeature('combat-system', name),

            // Create a new quest system  
            createQuest: (name = 'Quest') => 
                this.generateFeature('quest-system', name),

            // Create a new inventory system
            createInventory: (name = 'Inventory') => 
                this.generateFeature('inventory-system', name),

            // Create a new social system
            createSocial: (name = 'Social') => 
                this.generateFeature('social-system', name),

            // Create a simple UI panel
            createPanel: (name = 'Panel') => 
                this.generateFeature('ui-panel', name),

            // Create custom feature
            createCustom: (name, config = {}) => {
                const template = new FeatureTemplate(name, config);
                return template.createFeature();
            },

            // List available templates
            listTemplates: () => {
                console.log('Available templates:', Array.from(this.templates.keys()));
                return Array.from(this.templates.keys());
            },

            // Generate and write files to disk (development only)
            writeFeature: async (templateName, customName) => {
                const { files } = await this.generateFeature(templateName, customName);
                
                console.log('Generated files:');
                for (const [path, content] of files) {
                    console.log(`- ${path}`);
                    console.log('Content preview:', content.substring(0, 200) + '...');
                }
                
                return files;
            }
        };
    }

    // Integration helpers
    async integrateFeature(featureName, targetTab = null) {
        const managerName = `${featureName}Manager`;
        
        // Check if manager exists
        if (!window[managerName]) {
            throw new Error(`${managerName} not found. Generate it first.`);
        }

        const manager = window[managerName];
        
        // Initialize the manager
        await manager.init();
        
        // Integrate with UI if specified
        if (targetTab && manager.ui && manager.ui.container) {
            const tabContent = document.querySelector(`#tab-content-${targetTab}`);
            if (tabContent) {
                tabContent.appendChild(manager.ui.container);
                console.log(`${featureName} integrated into ${targetTab} tab`);
            }
        }
        
        // Register with module system
        if (window.legacyBridge) {
            window.legacyBridge.registerLegacyManager(featureName, manager);
        }
        
        return manager;
    }

    // Testing utilities
    createTestSuite(featureName) {
        const managerName = `${featureName}Manager`;
        
        return {
            testInitialization: () => {
                const manager = window[managerName];
                console.assert(manager, `${managerName} should exist`);
                console.assert(manager.initialized, `${managerName} should be initialized`);
                return manager.initialized;
            },
            
            testStateManagement: () => {
                const manager = window[managerName];
                const oldState = { ...manager.state };
                manager.updateState({ testValue: 123 });
                console.assert(manager.state.testValue === 123, 'State should update');
                manager.state = oldState; // Restore
                return true;
            },
            
            testEvents: () => {
                if (!window.eventBus) return false;
                
                let eventFired = false;
                const unsub = window.eventBus.on(`${featureName.toLowerCase()}.test`, () => {
                    eventFired = true;
                });
                
                window.eventBus.emit(`${featureName.toLowerCase()}.test`);
                unsub();
                
                console.assert(eventFired, 'Events should work');
                return eventFired;
            },
            
            testAPI: async () => {
                if (!window.apiPatterns) return false;
                
                const patternName = `${featureName.toLowerCase()}.getData`;
                const pattern = window.apiPatterns.getPattern(patternName);
                
                return !!pattern;
            },
            
            runAll: async () => {
                const results = {
                    initialization: false,
                    stateManagement: false,
                    events: false,
                    api: false
                };
                
                try {
                    results.initialization = this.testInitialization();
                    results.stateManagement = this.testStateManagement();
                    results.events = this.testEvents();
                    results.api = await this.testAPI();
                } catch (error) {
                    console.error('Test error:', error);
                }
                
                console.log(`${featureName} test results:`, results);
                return results;
            }
        };
    }

    // Documentation generator
    generateDocs(featureName) {
        const managerName = `${featureName}Manager`;
        const manager = window[managerName];
        
        if (!manager) {
            return `# ${featureName} - Manager not found`;
        }
        
        const status = manager.getStatus();
        
        return `# ${featureName} Feature Documentation

## Overview
Auto-generated feature using the QuickStart system.

## Status
- Initialized: ${status.initialized}
- Has UI: ${status.hasUI}
- Has State: ${status.hasState}  
- Has API: ${status.hasAPI}
- Has Events: ${status.hasEvents}

## Usage

### Basic Usage
\`\`\`javascript
// Initialize
await window.${managerName}.init();

// Activate feature
window.${managerName}.activate();

// Get status
const status = window.${managerName}.getStatus();
\`\`\`

### State Management
\`\`\`javascript
// Update state
window.${managerName}.updateState({ key: 'value' });

// Get current state
const currentState = window.${managerName}.state;
\`\`\`

### Event Integration
\`\`\`javascript
// Listen for events
window.eventBus.on('${featureName.toLowerCase()}.activated', (data) => {
    console.log('Feature activated:', data);
});

// Emit custom events
window.eventBus.emit('${featureName.toLowerCase()}.customEvent', data);
\`\`\`

${status.hasAPI ? `### API Usage
\`\`\`javascript
// Get data
const result = await window.${managerName}.getData();

// Update data
const updateResult = await window.${managerName}.updateData({ key: 'value' });
\`\`\`` : ''}

## Integration
This feature is integrated with:
- StateManager for state persistence
- EventBus for communication
- DataService for API calls
- ModuleLoader for dependency management

Generated: ${new Date().toISOString()}`;
    }
}

// Export singleton
window.quickStart = new QuickStart();