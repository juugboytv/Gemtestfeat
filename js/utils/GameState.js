/**
 * GameState.js - Centralized game state management
 * Handles all player data, UI state, and game configuration
 */

class GameState {
    constructor() {
        this.state = {
            player: {}, 
            ui: { 
                isFocused: false, 
                selectedInventoryId: null, 
                selectedGemId: null 
            },
            game: { 
                combatActive: false, 
                currentZoneTier: 1, 
                globalJackpot: 0 
            },
            keyState: { 
                up: false, 
                left: false, 
                down: false, 
                right: false, 
                interact: false 
            },
        };
    }

    // Player state management
    getPlayer() {
        return this.state.player;
    }

    updatePlayer(updates) {
        Object.assign(this.state.player, updates);
    }

    // UI state management
    getUI() {
        return this.state.ui;
    }

    updateUI(updates) {
        Object.assign(this.state.ui, updates);
    }

    // Game state management
    getGame() {
        return this.state.game;
    }

    updateGame(updates) {
        Object.assign(this.state.game, updates);
    }

    // Key state management
    getKeyState() {
        return this.state.keyState;
    }

    updateKeyState(updates) {
        Object.assign(this.state.keyState, updates);
    }

    // Full state access (for backward compatibility)
    getState() {
        return this.state;
    }

    // Reset functions
    resetPlayer() {
        this.state.player = {};
    }

    resetGame() {
        this.state.game = { 
            combatActive: false, 
            currentZoneTier: 1, 
            globalJackpot: 0 
        };
    }

    // Save/load functionality placeholder
    saveToLocalStorage() {
        try {
            localStorage.setItem('geminus_gamestate', JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('geminus_gamestate');
            if (saved) {
                const loadedState = JSON.parse(saved);
                // Merge with default state to ensure all properties exist
                this.state = { ...this.state, ...loadedState };
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
    }
}

// Export singleton instance
window.gameState = new GameState();