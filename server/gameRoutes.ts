/**
 * Game API Routes
 * RESTful endpoints for all game actions
 */

import { Router } from 'express';
import { gameLogic } from './gameLogic.js';
import { seedZoneData } from './zoneSeeder.js';

const router = Router();

// Seed zone data endpoint (development only)
router.post('/api/game/seed-zones', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Only available in development' });
  }
  
  try {
    await seedZoneData();
    res.json({ success: true, message: 'Zone data seeded successfully' });
  } catch (error) {
    console.error('Zone seeding error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed zone data' });
  }
});

// Initialize player session
router.post('/api/game/init', (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  const gameState = gameLogic.initializePlayer(playerId);
  
  res.json({
    success: true,
    playerId,
    gameState: {
      player: gameState.player,
      currentZone: gameLogic.getCurrentZone(playerId)
    }
  });
});

// Get current game state
router.get('/api/game/state', (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  const gameState = gameLogic.getGameState(playerId);
  
  if (!gameState) {
    return res.status(404).json({ success: false, message: 'Player not found' });
  }

  res.json({
    success: true,
    gameState: {
      player: gameState.player,
      currentZone: gameLogic.getCurrentZone(playerId)
    }
  });
});

// Get available zones for teleportation
router.get('/api/game/zones', async (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  try {
    const zones = await gameLogic.getAvailableZones(playerId);
    res.json({
      success: true,
      zones
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch zones'
    });
  }
});

// Teleport to a zone
router.post('/api/game/teleport', (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  const { zoneId } = req.body;
  
  if (!zoneId || isNaN(parseInt(zoneId))) {
    return res.status(400).json({ success: false, message: 'Invalid zone ID' });
  }

  const result = gameLogic.teleportToZone(playerId, parseInt(zoneId));
  
  if (result.success) {
    res.json({
      success: true,
      message: result.message,
      zoneData: result.zoneData,
      playerPosition: { q: 0, r: 0 }
    });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

// Move player within current zone
router.post('/api/game/move', (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  const { deltaQ, deltaR } = req.body;
  
  if (deltaQ === undefined || deltaR === undefined) {
    return res.status(400).json({ success: false, message: 'Invalid movement delta' });
  }

  const result = gameLogic.movePlayer(playerId, deltaQ, deltaR);
  
  if (result.success) {
    res.json({
      success: true,
      message: result.message,
      newPosition: result.newPosition
    });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

// Get current zone details
router.get('/api/game/current-zone', (req, res) => {
  const playerId = (req.session as any)?.id || req.ip || 'default_player';
  const currentZone = gameLogic.getCurrentZone(playerId);
  
  if (!currentZone) {
    return res.status(404).json({ success: false, message: 'Current zone not found' });
  }

  res.json({
    success: true,
    zone: currentZone
  });
});

export default router;