import { useState, useEffect, useCallback } from 'react';
import { GameState, GameStateSchema } from '@shared/schema';

const STORAGE_KEY = 'geminus-save';

const defaultGameState: GameState = {
  player: {
    name: 'Adventurer',
    level: 1,
    health: 100,
    maxHealth: 100,
    experience: 0,
    gold: 0,
    attributes: {
      strength: 10,
      agility: 10,
      intelligence: 10,
      vitality: 10
    },
    availablePoints: 0
  },
  currentZone: 'tutorial-cave',
  inventory: {},
  equipment: {},
  spells: ['heal'],
  settings: {
    animations: true,
    sounds: true
  }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const saveGame = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      return { success: true, message: 'Game saved successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to save game' };
    }
  }, [gameState]);

  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        const validatedState = GameStateSchema.parse(parsedState);
        setGameState(validatedState);
        return { success: true, message: 'Game loaded successfully!' };
      } else {
        return { success: false, message: 'No saved game found' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to load game' };
    }
  }, []);

  const newGame = useCallback(() => {
    setGameState(defaultGameState);
    return { success: true, message: 'New game started!' };
  }, []);

  const updatePlayer = useCallback((updater: (player: GameState['player']) => GameState['player']) => {
    setGameState(prev => ({
      ...prev,
      player: updater(prev.player)
    }));
  }, []);

  const updateSettings = useCallback((updater: (settings: GameState['settings']) => GameState['settings']) => {
    setGameState(prev => ({
      ...prev,
      settings: updater(prev.settings)
    }));
  }, []);

  const setCurrentZone = useCallback((zone: string) => {
    setGameState(prev => ({
      ...prev,
      currentZone: zone
    }));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        const validatedState = GameStateSchema.parse(parsedState);
        setGameState(validatedState);
      } catch (error) {
        console.warn('Invalid saved game state, using default');
      }
    }
  }, []);

  return {
    gameState,
    saveGame,
    loadGame,
    newGame,
    updatePlayer,
    updateSettings,
    setCurrentZone
  };
}
