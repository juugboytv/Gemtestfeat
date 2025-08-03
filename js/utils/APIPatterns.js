/**
 * APIPatterns.js - Standardized patterns for API communication and state management
 * Provides consistent interfaces for common game operations
 */

class APIPatterns {
    constructor() {
        this.patterns = new Map();
        this.setupStandardPatterns();
    }

    init() {
        console.log('APIPatterns initialized with standard game patterns');
    }

    setupStandardPatterns() {
        // Player action patterns
        this.registerPattern('player.move', {
            validate: (data) => data.q !== undefined && data.r !== undefined,
            execute: async (data) => {
                const result = await window.dataService?.movePlayer(data.q, data.r);
                if (result?.success) {
                    window.eventBus?.emitPlayerEvent('positionChange', { 
                        q: data.q, 
                        r: data.r, 
                        zone: window.stateManager?.getPlayer().currentZoneId 
                    });
                }
                return result;
            },
            rollback: (data) => {
                // Restore previous position if needed
                console.log('Rolling back player movement');
            }
        });

        this.registerPattern('player.teleport', {
            validate: (data) => data.zoneId && typeof data.zoneId === 'number',
            execute: async (data) => {
                const result = await window.dataService?.teleportToZone(data.zoneId);
                if (result?.success) {
                    window.eventBus?.emitGameEvent('zoneChanged', { 
                        newZoneId: data.zoneId,
                        playerId: window.stateManager?.getPlayer().id 
                    });
                }
                return result;
            },
            rollback: (data) => {
                console.log('Rolling back teleportation');
            }
        });

        // Inventory patterns
        this.registerPattern('inventory.equip', {
            validate: (data) => data.itemId && data.slot,
            execute: async (data) => {
                // Update local state immediately for responsiveness
                const success = window.stateManager?.equipItem(data.itemId, data.slot);
                if (success) {
                    // Sync with server
                    const result = await window.dataService?.equipItem(data.itemId, data.slot);
                    if (!result?.success) {
                        // Rollback on server failure
                        window.stateManager?.unequipItem(data.slot);
                        return result;
                    }
                    
                    window.eventBus?.emitInventoryEvent('itemEquipped', {
                        itemId: data.itemId,
                        slot: data.slot,
                        playerId: window.stateManager?.getPlayer().id
                    });
                    
                    return { success: true };
                }
                return { success: false, error: 'Failed to equip item locally' };
            },
            rollback: (data) => {
                window.stateManager?.unequipItem(data.slot);
            }
        });

        // Combat patterns
        this.registerPattern('combat.attack', {
            validate: (data) => data.monsterId,
            execute: async (data) => {
                window.eventBus?.emitCombatEvent('started', { monsterId: data.monsterId });
                
                const result = await window.dataService?.attackMonster(data.monsterId);
                
                if (result?.success) {
                    window.eventBus?.emitCombatEvent('attack', {
                        monsterId: data.monsterId,
                        damage: result.data?.damage,
                        playerHealth: result.data?.playerHealth
                    });
                    
                    // Update player health
                    if (result.data?.playerHealth !== undefined) {
                        window.stateManager?.updatePlayer({ 
                            health: result.data.playerHealth 
                        });
                    }
                }
                
                return result;
            },
            rollback: (data) => {
                window.eventBus?.emitCombatEvent('ended', { monsterId: data.monsterId });
            }
        });

        // UI patterns
        this.registerPattern('ui.showModal', {
            validate: (data) => data.modalId,
            execute: async (data) => {
                const modal = document.getElementById(data.modalId);
                if (modal) {
                    modal.style.display = 'block';
                    window.eventBus?.emitUIEvent('modalOpened', { 
                        modalId: data.modalId,
                        data: data.modalData 
                    });
                    return { success: true };
                }
                return { success: false, error: 'Modal not found' };
            },
            rollback: (data) => {
                const modal = document.getElementById(data.modalId);
                if (modal) {
                    modal.style.display = 'none';
                    window.eventBus?.emitUIEvent('modalClosed', { modalId: data.modalId });
                }
            }
        });

        // State persistence patterns
        this.registerPattern('state.save', {
            validate: () => true,
            execute: async (data) => {
                window.stateManager?.saveToLocalStorage();
                return { success: true };
            },
            rollback: () => {
                console.log('Cannot rollback state save');
            }
        });
    }

    registerPattern(name, pattern) {
        if (!pattern.validate || !pattern.execute) {
            throw new Error(`Pattern ${name} must have validate and execute methods`);
        }
        
        this.patterns.set(name, {
            ...pattern,
            rollback: pattern.rollback || (() => {}),
            metrics: {
                calls: 0,
                successes: 0,
                failures: 0,
                lastCalled: null
            }
        });
    }

    async executePattern(name, data = {}) {
        const pattern = this.patterns.get(name);
        if (!pattern) {
            throw new Error(`Pattern ${name} not found`);
        }

        pattern.metrics.calls++;
        pattern.metrics.lastCalled = Date.now();

        try {
            // Validate input
            if (!pattern.validate(data)) {
                throw new Error(`Validation failed for pattern ${name}`);
            }

            // Execute pattern
            const result = await pattern.execute(data);
            
            if (result?.success) {
                pattern.metrics.successes++;
            } else {
                pattern.metrics.failures++;
                // Attempt rollback on failure
                try {
                    pattern.rollback(data);
                } catch (rollbackError) {
                    console.error(`Rollback failed for pattern ${name}:`, rollbackError);
                }
            }

            return result;
        } catch (error) {
            pattern.metrics.failures++;
            console.error(`Pattern execution failed for ${name}:`, error);
            
            // Attempt rollback
            try {
                pattern.rollback(data);
            } catch (rollbackError) {
                console.error(`Rollback failed for pattern ${name}:`, rollbackError);
            }
            
            return { success: false, error: error.message };
        }
    }

    // Convenience methods for common patterns
    async movePlayer(q, r) {
        return await this.executePattern('player.move', { q, r });
    }

    async teleportPlayer(zoneId) {
        return await this.executePattern('player.teleport', { zoneId });
    }

    async equipItem(itemId, slot) {
        return await this.executePattern('inventory.equip', { itemId, slot });
    }

    async attackMonster(monsterId) {
        return await this.executePattern('combat.attack', { monsterId });
    }

    async showModal(modalId, modalData = {}) {
        return await this.executePattern('ui.showModal', { modalId, modalData });
    }

    async saveGame() {
        return await this.executePattern('state.save');
    }

    // Batch execution for multiple patterns
    async executeBatch(patterns) {
        const results = await Promise.allSettled(
            patterns.map(p => this.executePattern(p.name, p.data))
        );

        return results.map((result, index) => ({
            pattern: patterns[index].name,
            success: result.status === 'fulfilled' && result.value?.success,
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : 
                   (result.value?.error || null)
        }));
    }

    // Pattern management
    getPattern(name) {
        return this.patterns.get(name);
    }

    getAllPatterns() {
        return Array.from(this.patterns.keys());
    }

    getPatternMetrics(name) {
        return this.patterns.get(name)?.metrics;
    }

    getAllMetrics() {
        const metrics = {};
        for (const [name, pattern] of this.patterns) {
            metrics[name] = pattern.metrics;
        }
        return metrics;
    }

    // Development helpers
    createCustomPattern(name, options) {
        const pattern = {
            validate: options.validate || (() => true),
            execute: options.execute || (async () => ({ success: true })),
            rollback: options.rollback || (() => {}),
            description: options.description || ''
        };

        this.registerPattern(name, pattern);
        return pattern;
    }

    // Error recovery
    async retryPattern(name, data, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            const result = await this.executePattern(name, data);
            
            if (result.success) {
                return result;
            }
            
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
        
        return { success: false, error: 'Max retries exceeded' };
    }

    // Pattern composition
    createCompositePattern(name, patternSequence) {
        this.registerPattern(name, {
            validate: (data) => patternSequence.every(p => 
                this.patterns.get(p.name)?.validate(data[p.name] || p.data || {})
            ),
            execute: async (data) => {
                const results = [];
                
                for (const step of patternSequence) {
                    const stepData = data[step.name] || step.data || {};
                    const result = await this.executePattern(step.name, stepData);
                    
                    results.push(result);
                    
                    if (!result.success && step.required !== false) {
                        // Rollback all previous steps
                        for (let i = results.length - 2; i >= 0; i--) {
                            const prevStep = patternSequence[i];
                            const prevData = data[prevStep.name] || prevStep.data || {};
                            this.patterns.get(prevStep.name)?.rollback(prevData);
                        }
                        
                        return result;
                    }
                }
                
                return { success: true, results };
            },
            rollback: (data) => {
                // Rollback in reverse order
                for (let i = patternSequence.length - 1; i >= 0; i--) {
                    const step = patternSequence[i];
                    const stepData = data[step.name] || step.data || {};
                    this.patterns.get(step.name)?.rollback(stepData);
                }
            }
        });
    }
}

// Export singleton instance
window.apiPatterns = new APIPatterns();