import { useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { BASE_ITEMS } from '@/../../shared/gameData';

interface EquipmentTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function EquipmentTab({ gameState, updateGameState }: EquipmentTabProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showUnequipModal, setShowUnequipModal] = useState(false);

  const equipmentSlots = [
    { key: 'helmet', name: 'Helmet', icon: '🪖' },
    { key: 'armor', name: 'Armor', icon: '🛡️' },
    { key: 'leggings', name: 'Leggings', icon: '🩳' },
    { key: 'boots', name: 'Boots', icon: '🥾' },
    { key: 'gauntlets', name: 'Gauntlets', icon: '🧤' },
    { key: 'amulet', name: 'Amulet', icon: '📿' },
    { key: 'ring', name: 'Ring', icon: '💍' },
    { key: 'weapon', name: 'Weapon', icon: '⚔️' },
    { key: 'offhand', name: 'Off-Hand', icon: '🛡️' },
    { key: 'spellbook', name: 'Spellbook', icon: '📖' }
  ];

  const handleSlotClick = (slotKey: string) => {
    const equippedItem = gameState.equipment[slotKey as keyof typeof gameState.equipment];
    if (equippedItem) {
      setSelectedSlot(slotKey);
      setShowUnequipModal(true);
    }
  };

  const handleUnequip = () => {
    if (selectedSlot) {
      const equippedItem = gameState.equipment[selectedSlot as keyof typeof gameState.equipment];
      if (equippedItem) {
        // Move item back to inventory
        updateGameState({
          equipment: {
            ...gameState.equipment,
            [selectedSlot]: null
          },
          inventory: [...gameState.inventory, equippedItem]
        });
      }
      setShowUnequipModal(false);
      setSelectedSlot(null);
    }
  };

  const calculateTotalStats = () => {
    let totalClassValue = 0;
    let totalSockets = 0;
    let totalGems = 0;

    Object.values(gameState.equipment).forEach(item => {
      if (item) {
        totalClassValue += item.classValue;
        const baseItem = BASE_ITEMS.find(b => b.id === item.baseItemId);
        if (baseItem) {
          totalSockets += baseItem.sockets;
          totalGems += item.socketedGems.length;
        }
      }
    });

    return { totalClassValue, totalSockets, totalGems };
  };

  const stats = calculateTotalStats();

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Equipment</h2>
      
      {/* Equipment Grid */}
      <div className="equipment-grid mb-6">
        {equipmentSlots.map((slot) => {
          const equippedItem = gameState.equipment[slot.key as keyof typeof gameState.equipment];
          const baseItem = equippedItem ? BASE_ITEMS.find(b => b.id === equippedItem.baseItemId) : null;
          
          return (
            <div key={slot.key} className="equipment-slot-wrapper">
              <div className="equipment-slot-title">
                <span>{slot.icon}</span>
                <span className="font-orbitron">{slot.name}</span>
              </div>
              <div 
                className="equipment-slot-content" 
                onClick={() => handleSlotClick(slot.key)}
              >
                {equippedItem && baseItem ? (
                  <>
                    <img 
                      src={baseItem.imageUrl} 
                      alt={baseItem.name}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="text-white font-orbitron">T{equippedItem.tier}</span>
                      <span className="text-orange-400">{Math.round(equippedItem.classValue)}</span>
                      {equippedItem.socketedGems.length > 0 && (
                        <div className="flex gap-1">
                          {equippedItem.socketedGems.map((_, index) => (
                            <div key={index} className="w-2 h-2 bg-purple-500 rounded-full" />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-4xl">{slot.icon}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Equipment Stats */}
      <div className="glass-panel p-4 rounded-lg mb-4">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Equipment Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total Power:</span>
              <span className="text-orange-400 font-orbitron">{Math.round(stats.totalClassValue)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Socket Usage:</span>
              <span className="text-purple-400">{stats.totalGems}/{stats.totalSockets}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Items Equipped:</span>
              <span className="text-white">{Object.values(gameState.equipment).filter(Boolean).length}/10</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Set Bonus:</span>
              <span className="text-green-400">None</span>
            </div>
          </div>
        </div>
      </div>

      {/* Character Stats Preview */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Character Overview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-white font-orbitron">{gameState.player.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-red-400">{gameState.player.health}/{gameState.player.maxHealth}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Experience:</span>
              <span className="text-green-400">{gameState.player.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gold:</span>
              <span className="text-yellow-400">{gameState.player.gold}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unequip Modal */}
      {showUnequipModal && selectedSlot && (
        <div className="modal-backdrop" onClick={() => setShowUnequipModal(false)}>
          <div className="glass-panel p-6 rounded-lg max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-orbitron text-lg mb-4 text-orange-400">Unequip Item</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to unequip this item? It will be moved back to your inventory.
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={handleUnequip}
                className="glass-button flex-1 py-2 rounded-md font-orbitron"
              >
                Unequip
              </button>
              <button 
                onClick={() => setShowUnequipModal(false)}
                className="glass-button flex-1 py-2 rounded-md font-orbitron"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}