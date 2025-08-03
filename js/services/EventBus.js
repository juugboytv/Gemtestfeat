/**
 * EventBus.js - Centralized event system for decoupled communication
 * Enables modules to communicate without direct dependencies
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.middlewares = [];
        this.debugMode = false;
    }

    init() {
        this.setupGameEvents();
        console.log('EventBus initialized');
    }

    setupGameEvents() {
        // Set up standard game event patterns
        this.registerEventTypes([
            'player.levelUp',
            'player.experienceGain',
            'player.goldGain',
            'player.healthChange',
            'player.positionChange',
            'inventory.itemAdded',
            'inventory.itemRemoved',
            'inventory.itemEquipped',
            'inventory.itemUnequipped',
            'combat.started',
            'combat.ended',
            'combat.attack',
            'combat.damage',
            'ui.tabChanged',
            'ui.themeChanged',
            'ui.modalOpened',
            'ui.modalClosed',
            'game.zoneChanged',
            'game.questCompleted',
            'game.achievement',
            'system.error',
            'system.networkChange'
        ]);
    }

    registerEventTypes(types) {
        types.forEach(type => {
            if (!this.events.has(type)) {
                this.events.set(type, new Set());
            }
        });
    }

    // Core event methods
    on(event, callback, options = {}) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        const listener = {
            callback,
            once: options.once || false,
            priority: options.priority || 0,
            id: options.id || `listener_${Date.now()}_${Math.random()}`
        };

        this.events.get(event).add(listener);

        if (this.debugMode) {
            console.log(`EventBus: Registered listener for '${event}'`);
        }

        // Return unsubscribe function
        return () => this.off(event, listener.id);
    }

    once(event, callback, options = {}) {
        return this.on(event, callback, { ...options, once: true });
    }

    off(event, listenerId) {
        const listeners = this.events.get(event);
        if (!listeners) return false;

        for (const listener of listeners) {
            if (listener.id === listenerId) {
                listeners.delete(listener);
                if (this.debugMode) {
                    console.log(`EventBus: Removed listener ${listenerId} for '${event}'`);
                }
                return true;
            }
        }
        return false;
    }

    emit(event, data = null, options = {}) {
        if (this.debugMode) {
            console.log(`EventBus: Emitting '${event}'`, data);
        }

        // Run through middlewares first
        for (const middleware of this.middlewares) {
            try {
                const result = middleware(event, data, options);
                if (result === false) {
                    if (this.debugMode) {
                        console.log(`EventBus: Event '${event}' blocked by middleware`);
                    }
                    return false;
                }
                if (result && typeof result === 'object') {
                    data = result;
                }
            } catch (error) {
                console.error('EventBus middleware error:', error);
            }
        }

        const listeners = this.events.get(event);
        if (!listeners || listeners.size === 0) {
            if (this.debugMode) {
                console.log(`EventBus: No listeners for '${event}'`);
            }
            return false;
        }

        // Sort listeners by priority (higher first)
        const sortedListeners = Array.from(listeners).sort((a, b) => b.priority - a.priority);

        let executedCount = 0;
        for (const listener of sortedListeners) {
            try {
                listener.callback(data, event);
                executedCount++;

                // Remove once listeners
                if (listener.once) {
                    listeners.delete(listener);
                }
            } catch (error) {
                console.error(`EventBus: Error in listener for '${event}':`, error);
            }
        }

        if (this.debugMode) {
            console.log(`EventBus: Executed ${executedCount} listeners for '${event}'`);
        }

        return executedCount > 0;
    }

    // Middleware system
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware must be a function');
        }
        this.middlewares.push(middleware);
    }

    // Game-specific event helpers
    emitPlayerEvent(subtype, data) {
        return this.emit(`player.${subtype}`, data);
    }

    emitInventoryEvent(subtype, data) {
        return this.emit(`inventory.${subtype}`, data);
    }

    emitCombatEvent(subtype, data) {
        return this.emit(`combat.${subtype}`, data);
    }

    emitUIEvent(subtype, data) {
        return this.emit(`ui.${subtype}`, data);
    }

    emitGameEvent(subtype, data) {
        return this.emit(`game.${subtype}`, data);
    }

    emitSystemEvent(subtype, data) {
        return this.emit(`system.${subtype}`, data);
    }

    // Advanced patterns
    emitSequence(events, delay = 0) {
        events.forEach((eventData, index) => {
            setTimeout(() => {
                if (Array.isArray(eventData)) {
                    this.emit(eventData[0], eventData[1]);
                } else {
                    this.emit(eventData);
                }
            }, delay * index);
        });
    }

    createEventGroup(groupName) {
        return {
            emit: (subEvent, data) => this.emit(`${groupName}.${subEvent}`, data),
            on: (subEvent, callback, options) => this.on(`${groupName}.${subEvent}`, callback, options),
            once: (subEvent, callback, options) => this.once(`${groupName}.${subEvent}`, callback, options),
            off: (subEvent, listenerId) => this.off(`${groupName}.${subEvent}`, listenerId)
        };
    }

    // Debug and utility methods
    enableDebug() {
        this.debugMode = true;
        console.log('EventBus: Debug mode enabled');
    }

    disableDebug() {
        this.debugMode = false;
    }

    getListenerCount(event) {
        const listeners = this.events.get(event);
        return listeners ? listeners.size : 0;
    }

    getAllEvents() {
        return Array.from(this.events.keys());
    }

    getEventStats() {
        const stats = {};
        for (const [event, listeners] of this.events) {
            stats[event] = listeners.size;
        }
        return stats;
    }

    clearAllListeners() {
        this.events.clear();
        console.log('EventBus: All listeners cleared');
    }

    clearEvent(event) {
        if (this.events.has(event)) {
            this.events.get(event).clear();
            if (this.debugMode) {
                console.log(`EventBus: Cleared all listeners for '${event}'`);
            }
        }
    }

    // Pattern matching
    emitPattern(pattern, data) {
        const regex = new RegExp(pattern);
        let count = 0;
        
        for (const event of this.events.keys()) {
            if (regex.test(event)) {
                this.emit(event, data);
                count++;
            }
        }
        
        return count;
    }

    onPattern(pattern, callback, options = {}) {
        const regex = new RegExp(pattern);
        const unsubscribers = [];
        
        for (const event of this.events.keys()) {
            if (regex.test(event)) {
                const unsub = this.on(event, callback, options);
                unsubscribers.push(unsub);
            }
        }
        
        // Return function to unsubscribe from all matching events
        return () => unsubscribers.forEach(unsub => unsub());
    }
}

// Create middleware examples
EventBus.middlewares = {
    // Logging middleware
    logger: (event, data, options) => {
        console.log(`[EventBus] ${event}:`, data);
        return data;
    },

    // Rate limiting middleware
    rateLimit: (maxEvents = 100, timeWindow = 1000) => {
        const eventCounts = new Map();
        
        return (event, data, options) => {
            const now = Date.now();
            const key = `${event}_${Math.floor(now / timeWindow)}`;
            
            const count = eventCounts.get(key) || 0;
            if (count >= maxEvents) {
                console.warn(`EventBus: Rate limit exceeded for '${event}'`);
                return false;
            }
            
            eventCounts.set(key, count + 1);
            return data;
        };
    },

    // Validation middleware
    validator: (schemas) => {
        return (event, data, options) => {
            const schema = schemas[event];
            if (schema && typeof schema === 'function') {
                if (!schema(data)) {
                    console.error(`EventBus: Validation failed for '${event}'`);
                    return false;
                }
            }
            return data;
        };
    }
};

// Export singleton instance
window.eventBus = new EventBus();