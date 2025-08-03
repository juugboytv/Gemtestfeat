/**
 * DatabaseHelper.js - Utilities for rapid database integration
 * Generates database schemas and migrations for new features
 */

class DatabaseHelper {
    constructor() {
        this.schemaTemplates = new Map();
        this.migrationHistory = [];
        this.setupStandardSchemas();
    }

    init() {
        console.log('DatabaseHelper loaded - rapid database integration ready');
    }

    setupStandardSchemas() {
        // Player-related data schema
        this.schemaTemplates.set('playerData', {
            tableName: 'player_data',
            columns: {
                id: 'serial PRIMARY KEY',
                playerId: 'text NOT NULL',
                dataType: 'text NOT NULL',
                data: 'jsonb DEFAULT \'{}\'',
                createdAt: 'timestamp DEFAULT NOW()',
                updatedAt: 'timestamp DEFAULT NOW()'
            },
            indexes: ['playerId', 'dataType', 'createdAt'],
            relationships: []
        });

        // Feature state schema
        this.schemaTemplates.set('featureState', {
            tableName: 'feature_states',
            columns: {
                id: 'serial PRIMARY KEY',
                playerId: 'text NOT NULL',
                featureName: 'text NOT NULL',
                isEnabled: 'boolean DEFAULT true',
                state: 'jsonb DEFAULT \'{}\'',
                lastAccessed: 'timestamp DEFAULT NOW()',
                createdAt: 'timestamp DEFAULT NOW()'
            },
            indexes: ['playerId', 'featureName', 'isEnabled'],
            relationships: []
        });

        // Game events schema
        this.schemaTemplates.set('gameEvents', {
            tableName: 'game_events',
            columns: {
                id: 'serial PRIMARY KEY',
                playerId: 'text NOT NULL',
                eventType: 'text NOT NULL',
                eventData: 'jsonb DEFAULT \'{}\'',
                timestamp: 'timestamp DEFAULT NOW()',
                processed: 'boolean DEFAULT false'
            },
            indexes: ['playerId', 'eventType', 'timestamp', 'processed'],
            relationships: []
        });

        // Inventory items schema
        this.schemaTemplates.set('inventoryItems', {
            tableName: 'inventory_items',
            columns: {
                id: 'serial PRIMARY KEY',
                playerId: 'text NOT NULL',
                itemId: 'text NOT NULL',
                itemType: 'text NOT NULL',
                quantity: 'integer DEFAULT 1',
                data: 'jsonb DEFAULT \'{}\'',
                equipped: 'boolean DEFAULT false',
                slot: 'text NULL',
                createdAt: 'timestamp DEFAULT NOW()'
            },
            indexes: ['playerId', 'itemType', 'equipped', 'slot'],
            relationships: []
        });
    }

    // Generate Drizzle schema
    generateDrizzleSchema(featureName, schemaType = 'playerData', customColumns = {}) {
        const template = this.schemaTemplates.get(schemaType);
        if (!template) {
            throw new Error(`Schema template '${schemaType}' not found`);
        }

        const tableName = `${featureName.toLowerCase()}_${template.tableName}`;
        const columns = { ...template.columns, ...customColumns };

        let schemaCode = `// Generated Drizzle schema for ${featureName}
import { pgTable, serial, text, jsonb, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ${featureName.toLowerCase()}Table = pgTable('${tableName}', {
`;

        // Generate column definitions
        for (const [columnName, columnDef] of Object.entries(columns)) {
            const drizzleColumn = this.convertToDrizzle(columnName, columnDef);
            schemaCode += `    ${columnName}: ${drizzleColumn},\n`;
        }

        schemaCode += `});

// Zod schemas
export const insert${featureName}Schema = createInsertSchema(${featureName.toLowerCase()}Table);
export type Insert${featureName} = z.infer<typeof insert${featureName}Schema>;
export type Select${featureName} = typeof ${featureName.toLowerCase()}Table.$inferSelect;

// Relations (add as needed)
// export const ${featureName.toLowerCase()}Relations = relations(${featureName.toLowerCase()}Table, ({ one, many }) => ({
//     // Define relationships here
// }));
`;

        return schemaCode;
    }

    convertToDrizzle(columnName, columnDef) {
        // Convert SQL column definitions to Drizzle format
        const def = columnDef.toLowerCase();

        if (def.includes('serial') && def.includes('primary key')) {
            return 'serial(\'id\').primaryKey()';
        }
        if (def.includes('text not null')) {
            return `text('${columnName}').notNull()`;
        }
        if (def.includes('text null') || def.includes('text')) {
            return `text('${columnName}')`;
        }
        if (def.includes('jsonb')) {
            const defaultValue = def.includes('default') ? '.default({})' : '';
            return `jsonb('${columnName}').$type<any>()${defaultValue}`;
        }
        if (def.includes('boolean')) {
            const defaultValue = def.includes('default true') ? '.default(true)' : 
                                def.includes('default false') ? '.default(false)' : '';
            return `boolean('${columnName}')${defaultValue}`;
        }
        if (def.includes('integer')) {
            const defaultValue = def.match(/default (\d+)/);
            const defaultPart = defaultValue ? `.default(${defaultValue[1]})` : '';
            return `integer('${columnName}')${defaultPart}`;
        }
        if (def.includes('timestamp')) {
            const defaultValue = def.includes('default now()') ? '.defaultNow()' : '';
            return `timestamp('${columnName}')${defaultValue}`;
        }

        return `text('${columnName}')`;
    }

    // Generate storage interface methods
    generateStorageInterface(featureName, operations = ['create', 'read', 'update', 'delete']) {
        const interfaceCode = `// Generated storage interface methods for ${featureName}
// Add these methods to the IStorage interface in server/storage.ts

interface ${featureName}StorageInterface {
${operations.includes('create') ? `    async create${featureName}(data: Insert${featureName}): Promise<Select${featureName}>;` : ''}
${operations.includes('read') ? `    async get${featureName}Data(playerId: string): Promise<Select${featureName}[]>;
    async get${featureName}ById(id: number): Promise<Select${featureName} | null>;` : ''}
${operations.includes('update') ? `    async update${featureName}(id: number, updates: Partial<Insert${featureName}>): Promise<Select${featureName}>;` : ''}
${operations.includes('delete') ? `    async delete${featureName}(id: number): Promise<boolean>;` : ''}
}

// Implementation for MemStorage class
class ${featureName}MemStorage {
    private ${featureName.toLowerCase()}Data: Map<number, Select${featureName}> = new Map();
    private ${featureName.toLowerCase()}IdCounter = 1;

${operations.includes('create') ? `    async create${featureName}(data: Insert${featureName}): Promise<Select${featureName}> {
        const id = this.${featureName.toLowerCase()}IdCounter++;
        const record = {
            id,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        } as Select${featureName};
        
        this.${featureName.toLowerCase()}Data.set(id, record);
        return record;
    }` : ''}

${operations.includes('read') ? `    async get${featureName}Data(playerId: string): Promise<Select${featureName}[]> {
        return Array.from(this.${featureName.toLowerCase()}Data.values())
            .filter(record => record.playerId === playerId);
    }

    async get${featureName}ById(id: number): Promise<Select${featureName} | null> {
        return this.${featureName.toLowerCase()}Data.get(id) || null;
    }` : ''}

${operations.includes('update') ? `    async update${featureName}(id: number, updates: Partial<Insert${featureName}>): Promise<Select${featureName}> {
        const existing = this.${featureName.toLowerCase()}Data.get(id);
        if (!existing) {
            throw new Error('${featureName} record not found');
        }

        const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date()
        };

        this.${featureName.toLowerCase()}Data.set(id, updated);
        return updated;
    }` : ''}

${operations.includes('delete') ? `    async delete${featureName}(id: number): Promise<boolean> {
        return this.${featureName.toLowerCase()}Data.delete(id);
    }` : ''}
}`;

        return interfaceCode;
    }

    // Generate API routes for database operations
    generateAPIRoutes(featureName, operations = ['create', 'read', 'update', 'delete']) {
        const routesCode = `// Generated API routes for ${featureName}
// Add these routes to server/routes.ts

${operations.includes('create') ? `// Create ${featureName}
app.post('/api/${featureName.toLowerCase()}', async (req, res) => {
    try {
        const data = insert${featureName}Schema.parse(req.body);
        const result = await storage.create${featureName}(data);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});` : ''}

${operations.includes('read') ? `// Get ${featureName} data
app.get('/api/${featureName.toLowerCase()}', async (req, res) => {
    try {
        const playerId = req.query.playerId as string;
        if (!playerId) {
            return res.status(400).json({ success: false, error: 'Player ID required' });
        }
        
        const data = await storage.get${featureName}Data(playerId);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific ${featureName} by ID
app.get('/api/${featureName.toLowerCase()}/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await storage.get${featureName}ById(id);
        
        if (!data) {
            return res.status(404).json({ success: false, error: '${featureName} not found' });
        }
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});` : ''}

${operations.includes('update') ? `// Update ${featureName}
app.patch('/api/${featureName.toLowerCase()}/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        
        const result = await storage.update${featureName}(id, updates);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});` : ''}

${operations.includes('delete') ? `// Delete ${featureName}
app.delete('/api/${featureName.toLowerCase()}/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = await storage.delete${featureName}(id);
        
        if (!success) {
            return res.status(404).json({ success: false, error: '${featureName} not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});` : ''}`;

        return routesCode;
    }

    // Complete database setup generator
    generateCompleteSetup(featureName, options = {}) {
        const {
            schemaType = 'playerData',
            customColumns = {},
            operations = ['create', 'read', 'update', 'delete']
        } = options;

        return {
            schema: this.generateDrizzleSchema(featureName, schemaType, customColumns),
            storage: this.generateStorageInterface(featureName, operations),
            routes: this.generateAPIRoutes(featureName, operations),
            migration: this.generateMigrationInstructions(featureName)
        };
    }

    generateMigrationInstructions(featureName) {
        return `# Database Migration Instructions for ${featureName}

## Steps to integrate:

1. **Add schema to shared/schema.ts:**
   - Copy the generated schema code
   - Import and export the new table and types

2. **Update server/storage.ts:**
   - Add the interface methods to IStorage
   - Implement the methods in MemStorage class
   - Implement the methods in PgStorage class if using PostgreSQL

3. **Add API routes to server/routes.ts:**
   - Copy the generated route handlers
   - Test each endpoint

4. **Run database migration (if using PostgreSQL):**
   \`\`\`bash
   npm run db:push
   \`\`\`

5. **Test the integration:**
   - Test API endpoints with curl or Postman
   - Verify data persistence
   - Check error handling

## Example usage:
\`\`\`javascript
// Create new record
const result = await fetch('/api/${featureName.toLowerCase()}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        playerId: 'player123',
        // other fields...
    })
});

// Get player data
const data = await fetch('/api/${featureName.toLowerCase()}?playerId=player123');
\`\`\`
`;
    }

    // Quick setup commands
    quickSetup(featureName, preset = 'standard') {
        const presets = {
            standard: {
                schemaType: 'playerData',
                operations: ['create', 'read', 'update', 'delete']
            },
            readOnly: {
                schemaType: 'playerData',
                operations: ['read']
            },
            eventLog: {
                schemaType: 'gameEvents',
                operations: ['create', 'read']
            },
            inventory: {
                schemaType: 'inventoryItems',
                operations: ['create', 'read', 'update', 'delete']
            }
        };

        const config = presets[preset] || presets.standard;
        return this.generateCompleteSetup(featureName, config);
    }
}

// Development commands
window.dbHelper = new DatabaseHelper();

// Quick database setup commands
window.dbCommands = {
    setupFeature: (featureName, preset = 'standard') => 
        window.dbHelper.quickSetup(featureName, preset),
    
    generateSchema: (featureName, schemaType = 'playerData') => 
        window.dbHelper.generateDrizzleSchema(featureName, schemaType),
    
    generateStorage: (featureName) => 
        window.dbHelper.generateStorageInterface(featureName),
    
    generateRoutes: (featureName) => 
        window.dbHelper.generateAPIRoutes(featureName),
    
    listTemplates: () => {
        console.log('Available schema templates:', Array.from(window.dbHelper.schemaTemplates.keys()));
        return Array.from(window.dbHelper.schemaTemplates.keys());
    }
};