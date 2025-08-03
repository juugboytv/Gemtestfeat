/**
 * GameAPI.js - Handles all server communication
 * Centralized API calls for game data and state management
 */

class GameAPI {
    constructor() {
        this.baseURL = '';  // Relative URLs work fine
    }

    async makeRequest(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Game initialization
    async initGame() {
        return await this.makeRequest('/api/game/init', {
            method: 'POST'
        });
    }

    // Zone management
    async getZones() {
        return await this.makeRequest('/api/game/zones');
    }

    async getCurrentZone() {
        return await this.makeRequest('/api/game/current-zone');
    }

    async teleportToZone(zoneId) {
        return await this.makeRequest('/api/game/teleport', {
            method: 'POST',
            body: JSON.stringify({ zoneId })
        });
    }

    // Player movement
    async movePlayer(q, r) {
        return await this.makeRequest('/api/game/move', {
            method: 'POST',
            body: JSON.stringify({ q, r })
        });
    }

    // Combat system
    async attackMonster(monsterId) {
        return await this.makeRequest('/api/game/attack', {
            method: 'POST',
            body: JSON.stringify({ monsterId })
        });
    }

    async getMonsters() {
        return await this.makeRequest('/api/game/monsters');
    }

    // Inventory management
    async getInventory() {
        return await this.makeRequest('/api/game/inventory');
    }

    async useItem(itemId) {
        return await this.makeRequest('/api/game/use-item', {
            method: 'POST',
            body: JSON.stringify({ itemId })
        });
    }

    async equipItem(itemId, slot) {
        return await this.makeRequest('/api/game/equip', {
            method: 'POST',
            body: JSON.stringify({ itemId, slot })
        });
    }

    // Player stats
    async getPlayerStats() {
        return await this.makeRequest('/api/game/player');
    }

    async updatePlayerStats(stats) {
        return await this.makeRequest('/api/game/player', {
            method: 'PATCH',
            body: JSON.stringify(stats)
        });
    }

    // Dev Suite API calls
    async getDevSuiteData() {
        return await this.makeRequest('/api/dev-suite/data');
    }

    async updateDevSuiteData(data) {
        return await this.makeRequest('/api/dev-suite/data', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Error handling wrapper
    async safeRequest(requestFn, fallbackValue = null) {
        try {
            return await requestFn();
        } catch (error) {
            console.error('Safe request failed:', error);
            if (window.uiElements) {
                window.uiElements.showToast('Network error. Please check your connection.', true);
            }
            return fallbackValue;
        }
    }

    // Batch requests
    async batchRequest(requests) {
        const results = await Promise.allSettled(
            requests.map(req => this.makeRequest(req.endpoint, req.options))
        );

        return results.map((result, index) => ({
            id: requests[index].id || index,
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    }
}

// Export singleton instance
window.gameAPI = new GameAPI();