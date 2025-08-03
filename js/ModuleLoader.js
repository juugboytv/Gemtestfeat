/**
 * ModuleLoader.js - Manages loading and initialization of all game modules
 * Ensures proper loading order and dependency management
 */

class ModuleLoader {
    constructor() {
        this.modules = new Map();
        this.loadOrder = [];
        this.initialized = false;
    }

    // Define all modules and their load order
    defineModules() {
        const moduleConfig = [
            // Core utilities (load first)
            { id: 'gameState', path: 'js/utils/GameState.js', dependencies: [] },
            { id: 'uiElements', path: 'js/utils/UIElements.js', dependencies: [] },
            { id: 'hexUtils', path: 'js/utils/HexUtils.js', dependencies: [] },

            // Core services (load second)
            { id: 'eventBus', path: 'js/services/EventBus.js', dependencies: [] },
            { id: 'stateManager', path: 'js/services/StateManager.js', dependencies: ['eventBus'] },
            { id: 'dataService', path: 'js/services/DataService.js', dependencies: ['stateManager', 'eventBus'] },

            // UI and game services (load after core services)
            { id: 'backgroundAnimations', path: 'js/services/BackgroundAnimations.js', dependencies: ['uiElements'] },
            { id: 'gameAPI', path: 'js/services/GameAPI.js', dependencies: ['uiElements', 'dataService'] },

            // Managers (load after services)
            { id: 'tabManager', path: 'js/modules/TabManager.js', dependencies: ['gameState', 'uiElements', 'eventBus'] },

            // API patterns and bridge system (load last)
            { id: 'apiPatterns', path: 'js/utils/APIPatterns.js', dependencies: ['stateManager', 'eventBus', 'dataService'] },
            { id: 'legacyBridge', path: 'js/utils/LegacyBridge.js', dependencies: ['stateManager', 'eventBus', 'dataService', 'uiElements'] },

            // Phase 3: Feature development templates (load last)
            { id: 'featureTemplate', path: 'js/templates/FeatureTemplate.js', dependencies: [] },
            { id: 'quickStart', path: 'js/templates/QuickStart.js', dependencies: ['featureTemplate'] },
            { id: 'databaseHelper', path: 'js/templates/DatabaseHelper.js', dependencies: [] },
            { id: 'demoSystem', path: 'js/demo/DemoSystem.js', dependencies: ['quickStart', 'databaseHelper', 'apiPatterns'] },
            { id: 'zoneDataProcessor', path: 'js/tools/ZoneDataProcessor.js', dependencies: [] },
            { id: 'completeZoneGenerator', path: 'js/tools/CompleteZoneGenerator.js', dependencies: [] },
            { id: 'zoneMonsterData', path: 'js/data/ZoneMonsterData.js', dependencies: [] },

            // Additional modules will be added here as we extract them
        ];

        moduleConfig.forEach(config => {
            this.modules.set(config.id, {
                ...config,
                loaded: false,
                initialized: false,
                element: null
            });
        });

        // Calculate load order based on dependencies
        this.calculateLoadOrder();
    }

    calculateLoadOrder() {
        const visited = new Set();
        const visiting = new Set();
        const order = [];

        const visit = (moduleId) => {
            if (visited.has(moduleId)) return;
            if (visiting.has(moduleId)) {
                throw new Error(`Circular dependency detected involving ${moduleId}`);
            }

            visiting.add(moduleId);
            const module = this.modules.get(moduleId);
            
            if (module) {
                // Visit dependencies first
                module.dependencies.forEach(depId => {
                    if (this.modules.has(depId)) {
                        visit(depId);
                    }
                });
                
                order.push(moduleId);
            }

            visiting.delete(moduleId);
            visited.add(moduleId);
        };

        // Visit all modules
        this.modules.forEach((_, moduleId) => {
            visit(moduleId);
        });

        this.loadOrder = order;
    }

    async loadScript(path) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${path}`));
            document.head.appendChild(script);
        });
    }

    async loadModule(moduleId) {
        const module = this.modules.get(moduleId);
        if (!module || module.loaded) return;

        try {
            await this.loadScript(module.path);
            module.loaded = true;
            console.log(`Module loaded: ${moduleId}`);
        } catch (error) {
            console.error(`Failed to load module ${moduleId}:`, error);
            throw error;
        }
    }

    async loadAllModules() {
        console.log('Loading modules in order:', this.loadOrder);

        for (const moduleId of this.loadOrder) {
            await this.loadModule(moduleId);
        }

        console.log('All modules loaded successfully');
    }

    async initializeModules() {
        // Initialize modules in the same order they were loaded
        for (const moduleId of this.loadOrder) {
            const module = this.modules.get(moduleId);
            if (module && !module.initialized) {
                try {
                    // Check if the module has an init method on the global object
                    const globalModule = window[moduleId];
                    if (globalModule && typeof globalModule.init === 'function') {
                        await globalModule.init();
                        module.initialized = true;
                        console.log(`Module initialized: ${moduleId}`);
                    }
                } catch (error) {
                    console.error(`Failed to initialize module ${moduleId}:`, error);
                }
            }
        }

        this.initialized = true;
        console.log('All modules initialized');
    }

    async init() {
        if (this.initialized) return;

        try {
            this.defineModules();
            await this.loadAllModules();
            await this.initializeModules();

            // Dispatch event to notify that modules are ready
            document.dispatchEvent(new CustomEvent('modulesReady'));
        } catch (error) {
            console.error('Module loader initialization failed:', error);
            throw error;
        }
    }

    // Utility methods
    isModuleLoaded(moduleId) {
        const module = this.modules.get(moduleId);
        return module ? module.loaded : false;
    }

    isModuleInitialized(moduleId) {
        const module = this.modules.get(moduleId);
        return module ? module.initialized : false;
    }

    getLoadedModules() {
        return Array.from(this.modules.entries())
            .filter(([_, module]) => module.loaded)
            .map(([id, _]) => id);
    }

    getInitializedModules() {
        return Array.from(this.modules.entries())
            .filter(([_, module]) => module.initialized)
            .map(([id, _]) => id);
    }
}

// Export singleton instance
window.moduleLoader = new ModuleLoader();