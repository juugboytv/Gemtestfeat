import { useState, useEffect, useCallback } from 'react';
import { GameState, GameStateSchema } from '@/../../shared/schema';

const STORAGE_KEY = 'geminus-save';

const defaultGameState: GameState = {
  player: {
    name: 'Adventurer',
    level: 1,
    health: 100,
    maxHealth: 100,
    experience: 0,
    gold: 0,
    currentZone: '1',
    activeQuests: [],
    questStreak: 0,
    questPool: { xp: 0, gold: 0, items: [] }
  },
  equipment: {
    helmet: null,
    armor: null,
    leggings: null,
    boots: null,
    gauntlets: null,
    amulet: null,
    ring: null,
    weapon: null,
    offhand: null,
    spellbook: null
  },
  inventory: [],
  gemPouch: [],
  zones: {},
  currentTab: 'equipment',
  focusMode: false
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

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const updatePlayer = useCallback((updater: (player: GameState['player']) => GameState['player']) => {
    setGameState(prev => ({
      ...prev,
      player: updater(prev.player)
    }));
  }, []);

  const setCurrentZone = useCallback((zone: string) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        currentZone: zone
      }
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
    updateGameState,
    saveGame,
    loadGame,
    newGame,
    updatePlayer,
    setCurrentZone
  };
}
