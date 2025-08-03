import { Router, Request, Response } from 'express';
import { storage } from './storage';

const router = Router();

// Get current game state and zone
router.get('/api/game/current-zone', async (req: Request, res: Response) => {
  try {
    // Get current player state - for now using a mock player
    const player = {
      id: 'player1',
      level: 1, 
      health: 100,
      maxHealth: 100,
      experience: 0,
      gold: 100,
      currentZoneId: 1,
      position: { q: 0, r: 0 }
    };

    // Get current zone data from database
    const zones = await storage.getAllZones();
    const currentZone = zones.find((z: any) => z.zoneId === player.currentZoneId);
    
    if (!currentZone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }

    // Format zone data for frontend
    const formattedZone = {
      id: currentZone.zoneId,
      name: currentZone.name,
      gridSize: currentZone.gridSize,
      features: (currentZone.features as any).features.map((f: any) => ({
        q: f.q,
        r: f.r,
        type: f.type,
        name: getFeatureName(f.type)
      }))
    };

    res.json({
      success: true,
      gameState: {
        player,
        currentZone: formattedZone
      }
    });
  } catch (error) {
    console.error('Error getting current zone:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Handle player movement
router.post('/api/game/move', async (req: Request, res: Response) => {
  try {
    const { dq, dr } = req.body;
    
    if (typeof dq !== 'number' || typeof dr !== 'number') {
      return res.status(400).json({ success: false, error: 'Invalid movement parameters' });
    }

    // For now, just validate the movement is within reasonable bounds
    if (Math.abs(dq) > 1 || Math.abs(dr) > 1) {
      return res.status(400).json({ success: false, error: 'Movement too large' });
    }

    // In a real implementation, this would update the player's position in the database
    // For now, just return success
    res.json({ success: true, message: 'Movement successful' });
  } catch (error) {
    console.error('Error handling movement:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get zone list for teleportation
router.get('/api/game/zones', async (req: Request, res: Response) => {
  try {
    const zones = await storage.getAllZones();
    
    const formattedZones = zones.map((zone: any) => ({
      id: zone.zoneId,
      name: zone.name,
      levelRequirement: zone.levelRequirement,
      unlocked: zone.levelRequirement <= 1 // Player level is 1 for now
    }));

    res.json({ success: true, zones: formattedZones });
  } catch (error) {
    console.error('Error getting zones:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Teleport to zone
router.post('/api/game/teleport', async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.body;
    
    if (typeof zoneId !== 'number') {
      return res.status(400).json({ success: false, error: 'Invalid zone ID' });
    }

    const zones = await storage.getAllZones();
    const targetZone = zones.find((z: any) => z.zoneId === zoneId);
    
    if (!targetZone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }

    // Check level requirement (player level is 1 for now)
    if (targetZone.levelRequirement > 1) {
      return res.status(403).json({ success: false, error: 'Level requirement not met' });
    }

    res.json({ success: true, message: 'Teleportation successful' });
  } catch (error) {
    console.error('Error handling teleportation:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Helper function to get feature display names
function getFeatureName(featureType: string): string {
  const featureNames: Record<string, string> = {
    'Sanctuary': 'Sanctuary (Heal)',
    'Armory': 'Weapons Shop',
    'Arcanum': 'Magic Shop', 
    'AetheriumConduit': 'Bank',
    'Teleporter': 'Teleporter',
    'GemCrucible': 'Gem Crucible',
    'Monster Zone': 'Monster Zone'
  };
  return featureNames[featureType] || featureType;
}

export default router;