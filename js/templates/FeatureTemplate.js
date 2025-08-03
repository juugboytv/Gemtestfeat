/**
 * FeatureTemplate.js - Template system for rapid feature development
 * Provides standardized patterns for creating new game systems
 */

class FeatureTemplate {
    constructor(name, config = {}) {
        this.name = name;
        this.config = {
            hasUI: true,
            hasState: true,
            hasAPI: true,
            hasEvents: true,
            hasDatabase: false,
            ...config
        };
        this.components = new Map();
        this.initialized = false;
    }

    // Template generation methods
    generateManager() {
        const managerCode = `/**
 * ${this.name}Manager.js - Generated manager for ${this.name} feature
 * Auto-generated using FeatureTemplate system
 */

class ${this.name}Manager {
    constructor() {
        this.initialized = false;
        this.state = {};
        this.ui = {};
        this.eventHandlers = new Map();
    }

    async init() {
        if (this.initialized) return;

        try {
            ${this.config.hasState ? 'this.initState();' : ''}
            ${this.config.hasUI ? 'this.initUI();' : ''}
            ${this.config.hasEvents ? 'this.setupEvents();' : ''}
            ${this.config.hasAPI ? 'await this.initAPI();' : ''}
            
            this.initialized = true;
            console.log('${this.name}Manager initialized');
            
            if (window.eventBus) {
                window.eventBus.emit('manager.${this.name.toLowerCase()}.initialized');
            }
        } catch (error) {
            console.error('Failed to initialize ${this.name}Manager:', error);
        }
    }

    ${this.config.hasState ? `
    initState() {
        this.state = {
            isActive: false,
            data: {},
            lastUpdate: null
        };

        // Subscribe to state changes
        if (window.stateManager) {
            window.stateManager.subscribe('player', (data) => {
                this.onPlayerStateChange(data);
            });
        }
    }

    onPlayerStateChange(data) {
        // Handle player state changes relevant to ${this.name}
        this.updateState(data);
    }

    updateState(updates) {
        Object.assign(this.state, updates);
        this.state.lastUpdate = Date.now();
        this.onStateUpdate();
    }

    onStateUpdate() {
        // Override in specific implementations
        ${this.config.hasUI ? 'this.updateUI();' : ''}
    }` : ''}

    ${this.config.hasUI ? `
    initUI() {
        this.ui = {
            container: null,
            elements: new Map()
        };

        this.createUI();
        this.bindUIEvents();
    }

    createUI() {
        // Create UI container
        const container = document.createElement('div');
        container.id = '${this.name.toLowerCase()}-container';
        container.className = '${this.name.toLowerCase()}-feature';
        
        container.innerHTML = \`
            <div class="${this.name.toLowerCase()}-header">
                <h3>${this.name}</h3>
                <button class="${this.name.toLowerCase()}-toggle">Toggle</button>
            </div>
            <div class="${this.name.toLowerCase()}-content">
                <p>Content for ${this.name} feature</p>
            </div>
        \`;

        this.ui.container = container;
        this.ui.elements.set('header', container.querySelector('.${this.name.toLowerCase()}-header'));
        this.ui.elements.set('content', container.querySelector('.${this.name.toLowerCase()}-content'));
        this.ui.elements.set('toggle', container.querySelector('.${this.name.toLowerCase()}-toggle'));
    }

    bindUIEvents() {
        const toggle = this.ui.elements.get('toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    updateUI() {
        if (!this.ui.container) return;

        // Update UI based on current state
        const content = this.ui.elements.get('content');
        if (content) {
            content.innerHTML = \`
                <p>Status: \${this.state.isActive ? 'Active' : 'Inactive'}</p>
                <p>Last Update: \${this.state.lastUpdate ? new Date(this.state.lastUpdate).toLocaleTimeString() : 'Never'}</p>
            \`;
        }
    }

    toggle() {
        this.state.isActive = !this.state.isActive;
        this.onStateUpdate();
        
        if (window.eventBus) {
            window.eventBus.emit('${this.name.toLowerCase()}.toggled', { active: this.state.isActive });
        }
    }

    show() {
        if (this.ui.container) {
            this.ui.container.style.display = 'block';
        }
    }

    hide() {
        if (this.ui.container) {
            this.ui.container.style.display = 'none';
        }
    }` : ''}

    ${this.config.hasEvents ? `
    setupEvents() {
        if (!window.eventBus) return;

        // Set up event listeners
        this.eventHandlers.set('player.levelUp', (data) => {
            this.onPlayerLevelUp(data);
        });

        this.eventHandlers.set('${this.name.toLowerCase()}.activate', (data) => {
            this.activate(data);
        });

        this.eventHandlers.set('${this.name.toLowerCase()}.deactivate', (data) => {
            this.deactivate(data);
        });

        // Register all event handlers
        for (const [event, handler] of this.eventHandlers) {
            window.eventBus.on(event, handler);
        }
    }

    onPlayerLevelUp(data) {
        // Handle player level up events
        console.log('${this.name} responding to level up:', data);
    }

    activate(data = {}) {
        this.state.isActive = true;
        this.onStateUpdate();
        
        if (window.eventBus) {
            window.eventBus.emit('${this.name.toLowerCase()}.activated', data);
        }
    }

    deactivate(data = {}) {
        this.state.isActive = false;
        this.onStateUpdate();
        
        if (window.eventBus) {
            window.eventBus.emit('${this.name.toLowerCase()}.deactivated', data);
        }
    }` : ''}

    ${this.config.hasAPI ? `
    async initAPI() {
        if (!window.dataService) return;

        // Set up API patterns for this feature
        if (window.apiPatterns) {
            this.registerAPIPatterns();
        }
    }

    registerAPIPatterns() {
        const patterns = window.apiPatterns;

        patterns.registerPattern('${this.name.toLowerCase()}.getData', {
            validate: (data) => true,
            execute: async (data) => {
                const result = await window.dataService.makeRequest('/api/${this.name.toLowerCase()}/data');
                if (result.success) {
                    this.updateState({ data: result.data });
                }
                return result;
            },
            rollback: (data) => {
                console.log('Rolling back ${this.name} data fetch');
            }
        });

        patterns.registerPattern('${this.name.toLowerCase()}.update', {
            validate: (data) => data.updates !== undefined,
            execute: async (data) => {
                const result = await window.dataService.makeRequest('/api/${this.name.toLowerCase()}/update', {
                    method: 'POST',
                    body: JSON.stringify(data.updates)
                });
                
                if (result.success) {
                    this.updateState(data.updates);
                }
                
                return result;
            },
            rollback: (data) => {
                // Restore previous state
                console.log('Rolling back ${this.name} update');
            }
        });
    }

    async getData() {
        if (window.apiPatterns) {
            return await window.apiPatterns.executePattern('${this.name.toLowerCase()}.getData');
        }
    }

    async updateData(updates) {
        if (window.apiPatterns) {
            return await window.apiPatterns.executePattern('${this.name.toLowerCase()}.update', { updates });
        }
    }` : ''}

    // Cleanup
    destroy() {
        if (this.eventHandlers && window.eventBus) {
            for (const [event, handler] of this.eventHandlers) {
                window.eventBus.off(event, handler.id);
            }
        }

        if (this.ui.container && this.ui.container.parentNode) {
            this.ui.container.parentNode.removeChild(this.ui.container);
        }

        this.initialized = false;
        console.log('${this.name}Manager destroyed');
    }

    // Status and debugging
    getStatus() {
        return {
            name: '${this.name}',
            initialized: this.initialized,
            hasUI: ${this.config.hasUI},
            hasState: ${this.config.hasState},
            hasAPI: ${this.config.hasAPI},
            hasEvents: ${this.config.hasEvents},
            state: this.state
        };
    }
}

// Export the manager
window.${this.name}Manager = new ${this.name}Manager();`;

        return managerCode;
    }

    generateAPIRoutes() {
        if (!this.config.hasAPI) return '';

        return `// API routes for ${this.name} feature
// Add to server/routes.ts

// GET /api/${this.name.toLowerCase()}/data
app.get('/api/${this.name.toLowerCase()}/data', async (req, res) => {
    try {
        const data = await storage.get${this.name}Data();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/${this.name.toLowerCase()}/update
app.post('/api/${this.name.toLowerCase()}/update', async (req, res) => {
    try {
        const updates = req.body;
        const result = await storage.update${this.name}(updates);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});`;
    }

    generateDatabaseSchema() {
        if (!this.config.hasDatabase) return '';

        return `// Database schema for ${this.name} feature
// Add to shared/schema.ts

export const ${this.name.toLowerCase()}Table = pgTable('${this.name.toLowerCase()}', {
    id: serial('id').primaryKey(),
    playerId: text('player_id').notNull(),
    data: jsonb('data').$type<any>().default({}),
    isActive: boolean('is_active').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const insert${this.name}Schema = createInsertSchema(${this.name.toLowerCase()}Table);
export type Insert${this.name} = z.infer<typeof insert${this.name}Schema>;
export type Select${this.name} = typeof ${this.name.toLowerCase()}Table.$inferSelect;`;
    }

    generateStorageInterface() {
        if (!this.config.hasDatabase) return '';

        return `// Storage interface methods for ${this.name} feature
// Add to server/storage.ts interface

async get${this.name}Data(playerId: string): Promise<Select${this.name}[]>;
async create${this.name}(data: Insert${this.name}): Promise<Select${this.name}>;
async update${this.name}(id: number, updates: Partial<Insert${this.name}>): Promise<Select${this.name}>;
async delete${this.name}(id: number): Promise<boolean>;`;
    }

    // Integration helpers
    generateIntegrationCode() {
        return `// Integration code for ${this.name} feature

// 1. Add to ModuleLoader.js dependencies
{ id: '${this.name.toLowerCase()}Manager', path: 'js/managers/${this.name}Manager.js', dependencies: ['stateManager', 'eventBus'${this.config.hasAPI ? ', \'dataService\'' : ''}] },

// 2. Add to index.html or main game initialization
if (window.${this.name}Manager) {
    await window.${this.name}Manager.init();
}

// 3. Add UI container to appropriate tab
${this.config.hasUI ? `
const ${this.name.toLowerCase()}Container = window.${this.name}Manager.ui.container;
if (${this.name.toLowerCase()}Container) {
    document.querySelector('#target-tab-content').appendChild(${this.name.toLowerCase()}Container);
}` : ''}

// 4. Event integration examples
${this.config.hasEvents ? `
window.eventBus.on('${this.name.toLowerCase()}.activated', (data) => {
    console.log('${this.name} activated:', data);
});

window.eventBus.on('${this.name.toLowerCase()}.dataChanged', (data) => {
    // Update other systems that depend on ${this.name}
});` : ''}`;
    }

    // Feature creation workflow
    async createFeature(targetDir = 'js/managers') {
        const files = new Map();
        
        // Generate manager file
        files.set(`${targetDir}/${this.name}Manager.js`, this.generateManager());
        
        // Generate API routes if needed
        if (this.config.hasAPI) {
            files.set(`docs/${this.name}_api_routes.js`, this.generateAPIRoutes());
        }
        
        // Generate database schema if needed
        if (this.config.hasDatabase) {
            files.set(`docs/${this.name}_schema.ts`, this.generateDatabaseSchema());
            files.set(`docs/${this.name}_storage.ts`, this.generateStorageInterface());
        }
        
        // Generate integration guide
        files.set(`docs/${this.name}_integration.js`, this.generateIntegrationCode());
        
        return files;
    }

    // Validation and testing
    validateFeature() {
        const issues = [];
        
        if (!this.name || this.name.length < 3) {
            issues.push('Feature name must be at least 3 characters');
        }
        
        if (this.config.hasAPI && !this.config.hasState) {
            issues.push('Features with API should typically have state management');
        }
        
        if (this.config.hasDatabase && !this.config.hasAPI) {
            issues.push('Features with database should typically have API endpoints');
        }
        
        return issues;
    }
}

// Feature template presets
FeatureTemplate.presets = {
    simpleUI: {
        hasUI: true,
        hasState: true,
        hasAPI: false,
        hasEvents: true,
        hasDatabase: false
    },
    
    fullFeature: {
        hasUI: true,
        hasState: true,
        hasAPI: true,
        hasEvents: true,
        hasDatabase: true
    },
    
    backgroundService: {
        hasUI: false,
        hasState: true,
        hasAPI: true,
        hasEvents: true,
        hasDatabase: false
    },
    
    dataOnlyFeature: {
        hasUI: false,
        hasState: false,
        hasAPI: true,
        hasEvents: false,
        hasDatabase: true
    }
};

// Export the template class
window.FeatureTemplate = FeatureTemplate;