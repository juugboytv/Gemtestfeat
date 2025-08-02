import { GameState } from '@/../../shared/schema';
import { BASE_ITEMS } from '@/../../shared/gameData';

interface InventoryTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function InventoryTab({ gameState, updateGameState }: InventoryTabProps) {
  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Inventory</h2>
      
      <div className="inventory-grid">
        {gameState.inventory.map((item, index) => {
          const baseItem = BASE_ITEMS.find(b => b.id === item.baseItemId);
          return (
            <div key={index} className="inventory-slot">
              {baseItem && (
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

      <div className="mt-6">
        <h3 className="font-orbitron text-lg mb-3 text-orange-400">Gem Pouch</h3>
        <div className="gem-pouch-grid">
          {gameState.gemPouch.map((gem, index) => (
            <div key={index} className="gem-item">
              <img src={gem.imageUrl} alt={gem.name} className="w-10 h-10" />
              <div className="item-label font-orbitron">T{gem.tier}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}