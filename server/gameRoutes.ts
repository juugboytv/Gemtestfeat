import { Router, Request, Response } from 'express';
import { storage } from './storage';

const router = Router();

// Get current game state and zone
router.get('/api/game/current-zone', async (req: Request, res: Response) => {
  try {
    // Get current player state - using session or default to zone 1
    const currentZoneId = parseInt(req.query.zoneId as string) || 1;
    const playerQ = parseInt(req.query.q as string) || 0;
    const playerR = parseInt(req.query.r as string) || 0;
    
    const player = {
      id: 'player1',
      level: 1, 
      health: 100,
      maxHealth: 100,
      experience: 0,
      gold: 100,
      currentZoneId,
      position: { q: playerQ, r: playerR }
    };

    // Get current zone data from database
    const zones = await storage.getAllZones();
    const currentZone = zones.find((z: any) => z.zoneId === player.currentZoneId);
    
    if (!currentZone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }

    // Parse and format zone features
    const zoneFeatures = (currentZone.features as any).features || [];
    
    // Ensure all 6 required buildings are present
    const requiredBuildings = ['Sanctuary', 'Armory', 'Arcanum', 'AetheriumConduit', 'Teleporter', 'GemCrucible'];
    const existingBuildings = zoneFeatures.filter((f: any) => requiredBuildings.includes(f.type));
    
    // Add missing buildings if needed (this shouldn't happen with proper seeding)
    const missingBuildings = requiredBuildings.filter(building => 
      !existingBuildings.some((f: any) => f.type === building)
    );
    
    // Generate zone-specific hex color based on zone ID
    const getZoneHexColor = (zoneId: number) => {
      const colors = [
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan  
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#3b82f6', // Blue
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#84cc16', // Lime
        '#f97316'  // Orange
      ];
      return colors[zoneId % colors.length];
    };

    // Format zone data for frontend
    const formattedZone = {
      id: currentZone.zoneId,
      name: currentZone.name,
      gridSize: currentZone.gridSize,
      hexColor: getZoneHexColor(currentZone.zoneId),
      features: zoneFeatures.map((f: any) => ({
        q: f.q,
        r: f.r,
        type: f.type,
        name: getFeatureName(f.type),
        icon: getBuildingIcon(f.type)
      })),
      buildingCount: existingBuildings.length,
      missingBuildings: missingBuildings
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

// Helper function to get building icon
function getBuildingIcon(featureType: string): string {
  const buildingIcons: Record<string, string> = {
    'Sanctuary': '🆘',
    'Armory': '⚔️', 
    'Arcanum': '🔮',
    'AetheriumConduit': '🏧',  // Bank/ATM
    'Teleporter': '🌀',
    'GemCrucible': '💎'        // Gem/Diamond
  };
  return buildingIcons[featureType] || '👹';
}

export default router;