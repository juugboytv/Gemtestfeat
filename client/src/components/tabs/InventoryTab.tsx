import { useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { BASE_ITEMS, GEMS } from '@/../../shared/gameData';

interface InventoryTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function InventoryTab({ gameState, updateGameState }: InventoryTabProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedGem, setSelectedGem] = useState<number | null>(null);
  const [showItemActions, setShowItemActions] = useState(false);
  const [showGemActions, setShowGemActions] = useState(false);

  // Create grid of 25 slots (5x5)
  const inventorySlots = Array.from({ length: 25 }, (_, index) => {
    return gameState.inventory[index] || null;
  });

  const handleItemClick = (index: number) => {
    const item = inventorySlots[index];
    if (item) {
      setSelectedItem(index);
      setShowItemActions(true);
    }
  };

  const handleGemClick = (index: number) => {
    setSelectedGem(index);
    setShowGemActions(true);
  };

  const handleEquipItem = () => {
    if (selectedItem !== null) {
      const item = inventorySlots[selectedItem];
      if (item) {
        // Equipment logic - move item to equipment slot
        console.log(`Equipping item: ${item.baseItemId}`);
        setShowItemActions(false);
        setSelectedItem(null);
      }
    }
  };

  const handleDropItem = () => {
    if (selectedItem !== null) {
      // Remove item from inventory
      const newInventory = gameState.inventory.filter((_, i) => i !== selectedItem);
      updateGameState({
        inventory: newInventory
      });
      setShowItemActions(false);
      setSelectedItem(null);
    }
  };

  const handleSellItem = () => {
    if (selectedItem !== null) {
      const item = inventorySlots[selectedItem];
      if (item) {
        const sellPrice = item.tier * 25;
        
        // Add gold and remove item
        const newInventory = gameState.inventory.filter((_, i) => i !== selectedItem);
        updateGameState({
          inventory: newInventory,
          player: {
            ...gameState.player,
            gold: gameState.player.gold + sellPrice
          }
        });
        
        setShowItemActions(false);
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Inventory</h2>
      
      {/* Main Inventory Grid */}
      <div className="inventory-grid mb-6">
        {inventorySlots.map((item, index) => {
          const baseItem = item ? BASE_ITEMS.find(b => b.id === item.baseItemId) : null;
          return (
            <div 
              key={index} 
              className={`inventory-slot ${selectedItem === index ? 'selected' : ''}`}
              onClick={() => handleItemClick(index)}
            >
              {item && baseItem && (
                <>
                  <img src={baseItem.imageUrl} alt={baseItem.name} />
                  <div className="item-label font-orbitron">T{item.tier}</div>
                  {item.socketedGems.length > 0 && (
                    <div className="gem-dot-container">
                      {item.socketedGems.map((_, gemIndex) => (
                        <div key={gemIndex} className="gem-dot" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Gem Pouch */}
      <div className="mb-6">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Gem Pouch</h3>
        <div className="gem-pouch-grid">
          {gameState.gemPouch.map((gem, index) => (
            <div 
              key={index} 
              className={`gem-item ${selectedGem === index ? 'selected' : ''}`}
              onClick={() => handleGemClick(index)}
            >
              <img src={gem.imageUrl} alt={gem.name} className="w-10 h-10" />
              <div className="item-label font-orbitron">T{gem.tier}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Inventory Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Items:</span>
              <span className="text-white">{gameState.inventory.length}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gems:</span>
              <span className="text-purple-400">{gameState.gemPouch.length}/20</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Value:</span>
              <span className="text-yellow-400">{gameState.inventory.reduce((sum, item) => sum + (item.tier * 25), 0)}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight:</span>
              <span className="text-white">{gameState.inventory.length * 1.5}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Item Action Modal */}
      {showItemActions && (
        <div className="modal-backdrop" onClick={() => setShowItemActions(false)}>
          <div className="glass-panel p-6 rounded-lg max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-orbitron text-lg mb-4 text-orange-400">Item Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleEquipItem}
                className="glass-button w-full py-2 rounded-md font-orbitron"
              >
                Equip Item
              </button>
              <button 
                onClick={handleSellItem}
                className="glass-button w-full py-2 rounded-md font-orbitron"
              >
                Sell Item
              </button>
              <button 
                onClick={handleDropItem}
                className="glass-button w-full py-2 rounded-md font-orbitron text-red-400"
              >
                Drop Item
              </button>
              <button 
                onClick={() => setShowItemActions(false)}
                className="glass-button w-full py-2 rounded-md font-orbitron"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gem Action Modal */}
      {showGemActions && (
        <div className="modal-backdrop" onClick={() => setShowGemActions(false)}>
          <div className="glass-panel p-6 rounded-lg max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-orbitron text-lg mb-4 text-orange-400">Gem Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowGemActions(false)}
                className="glass-button w-full py-2 rounded-md font-orbitron"
              >
                Socket Gem
              </button>
              <button 
                onClick={() => setShowGemActions(false)}
                className="glass-button w-full py-2 rounded-md font-orbitron text-red-400"
              >
                Sell Gem
              </button>
              <button 
                onClick={() => setShowGemActions(false)}
                className="glass-button w-full py-2 rounded-md font-orbitron"
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