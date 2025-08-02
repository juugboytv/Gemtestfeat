import { useEffect, useRef, useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { ZONES } from '@/../../shared/gameData';

interface MiniMapProps {
  gameState: GameState;
}

interface HexTile {
  x: number;
  y: number;
  q: number;
  r: number;
  s: number;
  zone?: string;
  discovered: boolean;
}

export default function MiniMap({ gameState }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hexGrid, setHexGrid] = useState<HexTile[]>([]);
  const [playerPos, setPlayerPos] = useState({ q: 0, r: 0, s: 0 });

  // Initialize hexagonal grid
  useEffect(() => {
    const grid: HexTile[] = [];
    const radius = 3; // Grid radius
    
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      
      for (let r = r1; r <= r2; r++) {
        const s = -q - r;
        const x = 3/2 * q;
        const y = Math.sqrt(3) * (r + q/2);
        
        grid.push({
          x: x * 12 + 48, // Scale and center
          y: y * 12 + 48,
          q, r, s,
          zone: Math.abs(q) + Math.abs(r) + Math.abs(s) <= 2 ? `${Math.abs(q + r + s) + 1}` : undefined,
          discovered: Math.abs(q) + Math.abs(r) + Math.abs(s) <= 1 // Only center tiles discovered initially
        });
      }
    }
    
    setHexGrid(grid);
  }, []);

  // Render hexagonal map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 96;
    canvas.height = 96;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hexagonal tiles
    hexGrid.forEach(hex => {
      drawHexagon(ctx, hex.x, hex.y, 8, hex);
    });

    // Draw player position
    const playerHex = hexGrid.find(h => h.q === playerPos.q && h.r === playerPos.r);
    if (playerHex) {
      // Player glow effect
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(playerHex.x, playerHex.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

  }, [hexGrid, playerPos, gameState.player.currentZone]);

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hex: HexTile) => {
    ctx.beginPath();
    
    // Draw hexagon shape
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();

    // Fill based on discovery and zone status
    if (hex.discovered) {
      if (hex.zone) {
        const currentZone = ZONES[hex.zone];
        if (currentZone) {
          // Zone tile
          ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
          ctx.fill();
        }
      } else {
        // Empty discovered tile
        ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
        ctx.fill();
      }
    }

    // Draw border
    if (hex.discovered) {
      ctx.strokeStyle = hex.zone ? 'rgba(249, 115, 22, 0.6)' : 'rgba(100, 100, 100, 0.3)';
    } else {
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.2)';
    }
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw zone number if applicable
    if (hex.zone && hex.discovered) {
      ctx.fillStyle = '#f97316';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(hex.zone, x, y + 2);
    }
  };

  // Handle map click for zone travel
  const handleMapClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Find clicked hex
    const clickedHex = hexGrid.find(hex => {
      const distance = Math.sqrt((clickX - hex.x) ** 2 + (clickY - hex.y) ** 2);
      return distance <= 8 && hex.discovered && hex.zone;
    });

    if (clickedHex && clickedHex.zone) {
      // Travel to zone
      setPlayerPos({ q: clickedHex.q, r: clickedHex.r, s: clickedHex.s });
      console.log(`Traveling to zone ${clickedHex.zone}`);
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      id="mini-map-canvas"
      className="w-full h-full cursor-pointer"
      style={{ background: 'transparent' }}
      onClick={handleMapClick}
      title="Click to travel to discovered zones"
    />
  );
}