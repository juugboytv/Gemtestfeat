import { GameState, EQUIPMENT_SLOTS, EquipmentSlots } from '@/../../shared/schema';
import { BASE_ITEMS } from '@/../../shared/gameData';

interface EquipmentTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function EquipmentTab({ gameState, updateGameState }: EquipmentTabProps) {
  const equipment = gameState.equipment;

  const handleEquipmentClick = (slotId: string) => {
    const item = equipment[slotId as keyof EquipmentSlots];
    if (item) {
      // Handle item actions (unequip, socket gems, etc.)
      console.log('Equipment clicked:', item);
    }
  };

  const renderEquipmentSlot = (slot: typeof EQUIPMENT_SLOTS[0]) => {
    const item = equipment[slot.id as keyof EquipmentSlots];
    const baseItem = item ? BASE_ITEMS.find(b => b.id === item.baseItemId) : null;

    return (
      <div key={slot.id} className="equipment-slot-wrapper">
        <div className="equipment-slot-title">
          <span>{slot.icon}</span>
          <span className="font-orbitron">{slot.name}</span>
        </div>
        <div 
          className="equipment-slot-content"
          onClick={() => handleEquipmentClick(slot.id)}
        >
          {item && baseItem ? (
            <div className="flex flex-col items-center relative">
              <img src={baseItem.imageUrl} alt={baseItem.name} className="w-12 h-12 object-contain" />
              <div className="text-xs text-center mt-1">
                <div className="font-orbitron text-orange-400">{baseItem.name}</div>
                <div className="text-gray-400">T{item.tier}</div>
                {item.socketedGems.length > 0 && (
                  <div className="gem-dot-container">
                    {item.socketedGems.map((_, index) => (
                      <div key={index} className="gem-dot" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Empty</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Equipment</h2>
      <div className="equipment-grid">
        {EQUIPMENT_SLOTS.map(renderEquipmentSlot)}
      </div>
      
      <div className="mt-6 glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Equipment Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Weapon Class:</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Armor Class:</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Spell Class:</span>
              <span className="text-white">0</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Hit Chance:</span>
              <span className="text-white">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Critical:</span>
              <span className="text-white">5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dodge:</span>
              <span className="text-white">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}