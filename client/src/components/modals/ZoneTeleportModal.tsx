import { useState } from 'react';

interface Zone {
  id: string;
  name: string;
  description: string;
  locked: boolean;
}

interface ZoneTeleportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleport: (zoneId: string) => void;
}

const zones: Zone[] = [
  {
    id: 'tutorial-cave',
    name: 'Tutorial Cave',
    description: 'Beginner area',
    locked: false
  },
  {
    id: 'dark-forest',
    name: 'Dark Forest',
    description: 'Level 5+ recommended',
    locked: false
  },
  {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    description: 'Locked - Complete Dark Forest',
    locked: true
  }
];

export function ZoneTeleportModal({ isOpen, onClose, onTeleport }: ZoneTeleportModalProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedZone) {
      onTeleport(selectedZone);
      onClose();
      setSelectedZone(null);
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedZone(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="glass-panel p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="font-orbitron text-xl mb-4">Choose Destination</h2>
        
        <div className="space-y-2 mb-6">
          {zones.map(zone => (
            <button
              key={zone.id}
              className={`glass-button w-full p-3 rounded-lg text-left ${
                zone.locked ? 'opacity-50' : ''
              } ${selectedZone === zone.id ? 'border-orange-500' : ''}`}
              disabled={zone.locked}
              onClick={() => setSelectedZone(zone.id)}
            >
              <div>{zone.name}</div>
              <div className="text-xs text-gray-400 block">{zone.description}</div>
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button className="glass-button flex-1 p-3 rounded-lg" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            className="glass-button flex-1 p-3 rounded-lg"
            disabled={!selectedZone}
            onClick={handleConfirm}
          >
            Teleport
          </button>
        </div>
      </div>
    </div>
  );
}
