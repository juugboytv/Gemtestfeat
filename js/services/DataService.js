/**
 * DataService.js - Centralized data management and API communication
 * Handles all server communication with consistent patterns and caching
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.apiQueue = [];
        this.isOnline = navigator.onLine;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        this.setupNetworkHandling();
    }

    init() {
        this.setupEventListeners();
        console.log('DataService initialized');
    }

    setupNetworkHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueuedRequests();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    setupEventListeners() {
        // Listen for state changes to sync with server
        if (window.stateManager) {
            window.stateManager.subscribe('player', (data) => {
                this.queuePlayerUpdate(data.changes);
            });

            window.stateManager.subscribe('levelUp', (data) => {
                this.syncPlayerLevel(data);
            });
        }
    }

    // Core API communication
    async makeRequest(endpoint, options = {}) {
        const requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(endpoint, requestConfig);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache successful GET requests
            if (!options.method || options.method === 'GET') {
                this.setCache(endpoint, data);
            }

            return { success: true, data };
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            
            // Return cached data for GET requests if available
            if ((!options.method || options.method === 'GET') && this.hasCache(endpoint)) {
                console.log(`Returning cached data for ${endpoint}`);
                return { success: true, data: this.getCache(endpoint), cached: true };
            }

            return { success: false, error: error.message };
        }
    }

    async makeRequestWithRetry(endpoint, options = {}, attempts = this.retryAttempts) {
        for (let i = 0; i < attempts; i++) {
            const result = await this.makeRequest(endpoint, options);
            
            if (result.success) {
                return result;
            }
            
            if (i < attempts - 1) {
                await this.delay(this.retryDelay * Math.pow(2, i)); // Exponential backoff
            }
        }
        
        // Final failure - queue for retry when online
        if (!this.isOnline) {
            this.queueRequest(endpoint, options);
        }
        
        return { success: false, error: 'Max retry attempts exceeded' };
    }

    // Game-specific API methods
    async initializeGame() {
        const result = await this.makeRequest('/api/game/init', {
            method: 'POST'
        });

        if (result.success && window.stateManager) {
            window.stateManager.updatePlayer(result.data.gameState.player);
            window.stateManager.updateGame({ serverConnected: true });
        }

        return result;
    }

    async getZones() {
        const result = await this.makeRequest('/api/game/zones');
        
        if (result.success) {
            this.setCache('zones', result.data.zones);
        }
        
        return result;
    }

    async getCurrentZone() {
        return await this.makeRequest('/api/game/current-zone');
    }

    async teleportToZone(zoneId) {
        const result = await this.makeRequestWithRetry('/api/game/teleport', {
            method: 'POST',
            body: JSON.stringify({ zoneId })
        });

        if (result.success && window.stateManager) {
            window.stateManager.updatePlayer({ 
                currentZoneId: zoneId,
                position: { q: 0, r: 0 } // Reset position in new zone
            });
        }

        return result;
    }

    async movePlayer(q, r) {
        const result = await this.makeRequest('/api/game/move', {
            method: 'POST',
            body: JSON.stringify({ q, r })
        });

        if (result.success && window.stateManager) {
            window.stateManager.updatePlayer({ position: { q, r } });
        }

        return result;
    }

    async attackMonster(monsterId) {
        return await this.makeRequestWithRetry('/api/game/attack', {
            method: 'POST',
            body: JSON.stringify({ monsterId })
        });
    }

    async getPlayerInventory() {
        const result = await this.makeRequest('/api/game/inventory');
        
        if (result.success && window.stateManager) {
            window.stateManager.updatePlayer({ inventory: result.data.inventory });
        }
        
        return result;
    }

    async equipItem(itemId, slot) {
        const result = await this.makeRequestWithRetry('/api/game/equip', {
            method: 'POST',
            body: JSON.stringify({ itemId, slot })
        });

        if (result.success && window.stateManager) {
            window.stateManager.equipItem(itemId, slot);
        }

        return result;
    }

    // Batch operations for efficiency
    async syncPlayerData() {
        const batchRequests = [
            { id: 'zones', endpoint: '/api/game/zones' },
            { id: 'currentZone', endpoint: '/api/game/current-zone' },
            { id: 'inventory', endpoint: '/api/game/inventory' },
            { id: 'player', endpoint: '/api/game/player' }
        ];

        const results = await this.batchRequest(batchRequests);
        
        // Process results and update state
        results.forEach(result => {
            if (result.success && window.stateManager) {
                switch (result.id) {
                    case 'inventory':
                        window.stateManager.updatePlayer({ inventory: result.data.inventory });
                        break;
                    case 'player':
                        window.stateManager.updatePlayer(result.data.player);
                        break;
                    case 'currentZone':
                        // Update current zone info
                        break;
                }
            }
        });

        return results;
    }

    async batchRequest(requests) {
        const promises = requests.map(req => 
            this.makeRequest(req.endpoint, req.options).then(result => ({
                ...result,
                id: req.id
            }))
        );

        return await Promise.all(promises);
    }

    // Queue management for offline scenarios
    queueRequest(endpoint, options) {
        this.apiQueue.push({ endpoint, options, timestamp: Date.now() });
    }

    queuePlayerUpdate(changes) {
        // Queue player updates to sync when online
        this.queueRequest('/api/game/player', {
            method: 'PATCH',
            body: JSON.stringify(changes)
        });
    }

    async processQueuedRequests() {
        if (!this.isOnline || this.apiQueue.length === 0) return;

        console.log(`Processing ${this.apiQueue.length} queued requests`);

        const queue = [...this.apiQueue];
        this.apiQueue = [];

        for (const request of queue) {
            try {
                await this.makeRequest(request.endpoint, request.options);
            } catch (error) {
                console.error('Failed to process queued request:', error);
                // Re-queue failed requests
                this.apiQueue.push(request);
            }
        }
    }

    // Cache management
    setCache(key, data, ttl = 300000) { // 5 minutes default TTL
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    hasCache(key) {
        return this.getCache(key) !== null;
    }

    clearCache(pattern = null) {
        if (pattern) {
            const regex = new RegExp(pattern);
            for (const [key] of this.cache) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    // Specialized sync methods
    async syncPlayerLevel(levelData) {
        await this.queueRequest('/api/game/level-up', {
            method: 'POST',
            body: JSON.stringify({
                oldLevel: levelData.oldLevel,
                newLevel: levelData.newLevel,
                levelsGained: levelData.levelsGained
            })
        });
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getConnectionStatus() {
        return {
            online: this.isOnline,
            queuedRequests: this.apiQueue.length,
            cacheSize: this.cache.size
        };
    }

    // Error handling
    handleAPIError(error, context = '') {
        console.error(`API Error ${context}:`, error);
        
        if (window.uiElements) {
            if (error.message.includes('Network')) {
                window.uiElements.showToast('Network error. Some features may be limited.', true);
            } else {
                window.uiElements.showToast('Server error. Please try again.', true);
            }
        }
    }
}

// Export singleton instance
window.dataService = new DataService();