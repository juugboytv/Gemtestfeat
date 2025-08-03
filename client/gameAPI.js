/**
 * Client-side Game API Handler
 * Handles all communication with the server for game state
 */

class GameAPI {
  constructor() {
    this.baseUrl = '';
    this.isServerMode = false;
    this.gameState = null;
  }

  async init() {
    try {
      const response = await fetch('/api/game/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isServerMode = true;
        this.gameState = data.gameState;
        console.log('Server-side game initialized:', data);
        return data;
      }
    } catch (error) {
      console.log('Server not available, using client-side mode');
    }
    
    this.isServerMode = false;
    return null;
  }

  async getGameState() {
    if (!this.isServerMode) return null;
    
    try {
      const response = await fetch('/api/game/state');
      if (response.ok) {
        const data = await response.json();
        this.gameState = data.gameState;
        return data.gameState;
      }
    } catch (error) {
      console.error('Failed to get game state:', error);
    }
    return null;
  }

  async getAvailableZones() {
    if (!this.isServerMode) return null;
    
    try {
      const response = await fetch('/api/game/zones');
      if (response.ok) {
        const data = await response.json();
        return data.zones;
      }
    } catch (error) {
      console.error('Failed to get zones:', error);
    }
    return null;
  }

  async teleportToZone(zoneId) {
    if (!this.isServerMode) return null;
    
    try {
      const response = await fetch('/api/game/teleport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Server teleport response:', data);
        return data;
      } else {
        const error = await response.json();
        console.error('Teleport failed:', error);
      }
    } catch (error) {
      console.error('Failed to teleport:', error);
    }
    return null;
  }

  async movePlayer(deltaQ, deltaR) {
    if (!this.isServerMode) return null;
    
    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deltaQ, deltaR })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to move player:', error);
    }
    return null;
  }

  async getCurrentZone() {
    if (!this.isServerMode) return null;
    
    try {
      const response = await fetch('/api/game/current-zone');
      if (response.ok) {
        const data = await response.json();
        return data.zone;
      }
    } catch (error) {
      console.error('Failed to get current zone:', error);
    }
    return null;
  }
}

// Global instance
window.gameAPI = new GameAPI();