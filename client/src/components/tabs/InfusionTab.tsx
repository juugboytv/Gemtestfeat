import { useState } from 'react';
import { GameState } from '@/../../shared/schema';
import { BASE_ITEMS, GEMS } from '@/../../shared/gameData';

interface InfusionTabProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export default function InfusionTab({ gameState, updateGameState }: InfusionTabProps) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGem, setSelectedGem] = useState(null);

  return (
    <div className="h-full">
      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Gem Infusion</h2>
      
      <div className="infusion-grid h-[400px]">
        {/* Items Panel */}
        <div className="infusion-panel">
          <div className="infusion-panel-title text-orange-400">Items</div>
          <div className="infusion-content-area custom-scrollbar">
            {gameState.inventory.map((item, index) => {
              const baseItem = BASE_ITEMS.find(b => b.id === item.baseItemId);
              return (
                <div 
                  key={index} 
                  className={`item-entry ${selectedItem === item ? 'border-red-500' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {baseItem && (
                    <>
                      <img src={baseItem.imageUrl} alt={baseItem.name} />
                      <div>
                        <div className="font-orbitron text-white">{baseItem.name}</div>
                        <div className="text-xs text-gray-400">Tier {item.tier}</div>
                        <div className="text-xs text-gray-400">{item.socketedGems.length}/{baseItem.sockets} sockets</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Focused Item Panel */}
        <div className="infusion-panel">
          <div className="infusion-panel-title text-orange-400">Selected Item</div>
          <div className="infusion-content-area flex flex-col items-center justify-center">
            {selectedItem ? (
              <div className="focused-item-container">
                {(() => {
                  const baseItem = BASE_ITEMS.find(b => b.id === selectedItem.baseItemId);
                  return baseItem ? (
                    <>
                      <img src={baseItem.imageUrl} alt={baseItem.name} className="w-24 h-24" />
                      <div className="focused-item-details text-center">
                        <div className="font-orbitron text-lg text-orange-400">{baseItem.name}</div>
                        <div className="text-sm text-gray-400">Tier {selectedItem.tier}</div>
                      </div>
                      <div className="sockets-container">
                        {Array.from({ length: baseItem.sockets }).map((_, socketIndex) => {
                          const gem = selectedItem.socketedGems[socketIndex];
                          return (
                            <div key={socketIndex} className={`infusion-socket-slot ${gem ? 'has-gem' : ''}`}>
                              {gem ? (
                                <img src={gem.imageUrl} alt={gem.name} />
                              ) : (
                                <div className="text-gray-500 text-xs">Empty</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            ) : (
              <div className="text-gray-500">Select an item to infuse</div>
            )}
          </div>
        </div>

        {/* Gems Panel */}
        <div className="infusion-panel">
          <div className="infusion-panel-title text-orange-400">Gems</div>
          <div className="infusion-content-area custom-scrollbar">
            {gameState.gemPouch.map((gem, index) => (
              <div 
                key={index} 
                className={`item-entry ${selectedGem === gem ? 'border-red-500' : ''}`}
                onClick={() => setSelectedGem(gem)}
              >
                <img src={gem.imageUrl} alt={gem.name} />
                <div>
                  <div className="font-orbitron text-white">{gem.name}</div>
                  <div className="text-xs text-gray-400">{gem.abbreviation} T{gem.tier}</div>
                  <div className="text-xs text-orange-400">{gem.effect}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infusion Actions */}
      <div className="mt-4 flex gap-4">
        <button 
          className="glass-button px-4 py-2 rounded-md flex-1"
          disabled={!selectedItem || !selectedGem}
        >
          Socket Gem
        </button>
        <button 
          className="glass-button px-4 py-2 rounded-md flex-1"
          disabled={!selectedItem}
        >
          Remove Gems
        </button>
      </div>
    </div>
  );
}