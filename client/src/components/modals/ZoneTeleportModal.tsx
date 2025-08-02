import { X } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  levelRequirement: number;
  description: string;
}

interface ZoneTeleportModalProps {
  zones: Record<string, Zone>;
  currentZone: string;
  playerLevel: number;
  onClose: () => void;
  onTeleport: (zoneId: string) => void;
}

export default function ZoneTeleportModal({ 
  zones, 
  currentZone, 
  playerLevel, 
  onClose, 
  onTeleport 
}: ZoneTeleportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-orange-500/30">
          <h2 className="font-orbitron text-xl text-orange-400">Zone Teleporter</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-orange-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          {Object.entries(zones).map(([zoneId, zone]) => {
            const isCurrentZone = zoneId === currentZone;
            const isLocked = zone.levelRequirement > playerLevel;
            
            return (
              <button
                key={zoneId}
                onClick={() => !isCurrentZone && !isLocked && onTeleport(zoneId)}
                disabled={isCurrentZone || isLocked}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isCurrentZone 
                    ? 'border-green-500 bg-green-500/10 cursor-default' 
                    : isLocked
                    ? 'border-red-500/30 bg-red-500/5 cursor-not-allowed opacity-50'
                    : 'border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-orbitron text-white">{zone.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{zone.description}</p>
                    <div className="text-xs text-orange-400 mt-2">
                      Level {zone.levelRequirement} required
                    </div>
                  </div>
                  <div className="text-right">
                    {isCurrentZone && (
                      <span className="text-green-400 text-sm font-orbitron">Current</span>
                    )}
                    {isLocked && (
                      <span className="text-red-400 text-sm">🔒</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-orange-500/30">
          <div className="text-sm text-gray-400 text-center">
            Your Level: {playerLevel}
          </div>
        </div>
      </div>
    </div>
  );
}