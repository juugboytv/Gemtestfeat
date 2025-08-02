import { useState, useEffect, useRef } from 'react';

// Game state interface matching the original structure
interface GameState {
  player: {
    name: string;
    level: number;
    health: number;
    maxHealth: number;
    experience: number;
    gold: number;
    currentZone: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    statPoints: number;
    questStreak: number;
    activeQuests: Array<{
      id: string;
      type: string;
      target: string;
      progress: number;
      goal: number;
      reward: { gold: number; xp: number };
    }>;
  };
  equipment: {
    helmet: any;
    armor: any;
    leggings: any;
    boots: any;
    gauntlets: any;
    amulet: any;
    ring: any;
    weapon: any;
    offhand: any;
    spellbook: any;
  };
  inventory: any[];
  gemPouch: any[];
  zones: Record<string, any>;
  currentTab: string;
  focusMode: boolean;
  combatState: {
    selectedMonster: string;
    monsterHp: number;
    maxMonsterHp: number;
    inCombat: boolean;
  };
  infusionState: {
    selectedItem: any;
    selectedGems: any[];
  };
}

export default function GeminusGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniMapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Game state matching the original structure
  const [gameState, setGameState] = useState<GameState>({
    player: {
      name: "Player",
      level: 1,
      health: 100,
      maxHealth: 100,
      experience: 0,
      gold: 100,
      currentZone: 1,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      statPoints: 0,
      questStreak: 0,
      activeQuests: []
    },
    equipment: {
      helmet: null,
      armor: null,
      leggings: null,
      boots: null,
      gauntlets: null,
      amulet: null,
      ring: null,
      weapon: null,
      offhand: null,
      spellbook: null
    },
    inventory: [],
    gemPouch: [],
    zones: {
      "1": { name: "Crystal Caves (Dwarf)", levelReq: 1, biome: "mountain", gearTier: 1 },
      "2": { name: "Glimmerwood (Elf)", levelReq: 1, biome: "forest", gearTier: 1 },
      "3": { name: "The Shifting Maze (Halfling)", levelReq: 1, biome: "plains", gearTier: 1 }
    },
    currentTab: "equipment",
    focusMode: false,
    combatState: {
      selectedMonster: "",
      monsterHp: 0,
      maxMonsterHp: 0,
      inCombat: false
    },
    infusionState: {
      selectedItem: null,
      selectedGems: []
    }
  });

  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [statInfoModal, setStatInfoModal] = useState({ open: false, stat: "", info: "" });
  const [itemActionModal, setItemActionModal] = useState({ open: false, item: null });

  // Tab switching function
  const switchTab = (tabName: string) => {
    setGameState(prev => ({ ...prev, currentTab: tabName }));
  };

  // Focus mode toggle
  const toggleFocusMode = () => {
    setGameState(prev => ({ ...prev, focusMode: !prev.focusMode }));
  };

  // Touch controls for mobile (matching original D-pad structure)
  const handleKeyPress = (key: string) => {
    // Handle directional movement and interact
    console.log(`Key pressed: ${key}`);
  };

  // Initialize smoke canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple smoke effect
    const particles: Array<{x: number, y: number, vx: number, vy: number, alpha: number}> = [];
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles occasionally
      if (Math.random() < 0.02) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.5 - 0.2,
          alpha: 0.1
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.001;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(100, 50, 0, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Initialize mini-map canvas
  useEffect(() => {
    const canvas = miniMapCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 96;
    canvas.height = 96;

    // Draw hexagonal mini-map
    const centerX = 48;
    const centerY = 48;
    const radius = 35;

    ctx.fillStyle = 'rgba(20, 20, 22, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw hexagon zones
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = centerX + radius * 0.7 * Math.cos(angle);
      const y = centerY + radius * 0.7 * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#f97316' : 'rgba(249, 115, 22, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw center (current zone)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }, [gameState.player.currentZone]);

  return (
    <div className="h-full bg-black">
      <canvas 
        ref={canvasRef}
        id="smoke-canvas" 
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-50"
      />
      
      <div id="game-container" className="h-full">
        <div id="game-hud-screen" className="relative z-10 h-full">
          <div className="max-w-md mx-auto h-full flex flex-col p-2 gap-2">
            
            {/* Header - Player Status & Navigation */}
            <header id="game-section" className="glass-panel p-3 rounded-lg flex justify-between items-center flex-shrink-0">
              <section id="player-status-panel" className="flex-1">
                <div id="player-status-container" className="flex flex-col items-start space-y-2 flex-grow">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="level-label font-orbitron">Level: </span>
                      <span className="level-value font-orbitron">{gameState.player.level}</span>
                      <span className="name-value ml-2 font-orbitron">{gameState.player.name}</span>
                    </div>
                    <div id="transport-controls">
                      <button 
                        onClick={() => setZoneModalOpen(true)}
                        className="teleport-trigger-btn" 
                        title="Teleport to Zone"
                      >
                        🌀
                      </button>
                    </div>
                  </div>
                  <div className="health-bar-container w-full max-w-[150px]">
                    <div className="progress-bar-track h-3">
                      <div 
                        className="progress-bar-fill h-full" 
                        style={{ 
                          width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%`,
                          backgroundColor: 'var(--hp-color)'
                        }}
                      />
                    </div>
                    <span id="player-health-numeric">{gameState.player.health} / {gameState.player.maxHealth}</span>
                  </div>
                </div>
              </section>
              
              <section id="navigation-panel" className="flex-1 flex justify-end">
                <div className="flex items-center gap-2">
                  <div id="mini-map-container" className="relative w-24 h-24" title="World Map">
                    <div className="absolute -inset-1 rounded-full border border-dashed border-orange-500/30 animate-spin" style={{animationDuration: '20s', animationTimingFunction: 'linear'}} />
                    <div className="relative w-full h-full rounded-full overflow-hidden glass-panel border-2 border-[var(--border-color-main)]">
                      <canvas ref={miniMapCanvasRef} className="w-full h-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div id="d-pad-controls" className="grid gap-1" style={{gridTemplateAreas: '". up ." "left down right"'}}>
                      <div className="game-key move-key" style={{gridArea: 'up'}} onClick={() => handleKeyPress('up')}>
                        <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
                      </div>
                      <div className="game-key move-key" style={{gridArea: 'left'}} onClick={() => handleKeyPress('left')}>
                        <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                      </div>
                      <div className="game-key move-key" style={{gridArea: 'down'}} onClick={() => handleKeyPress('down')}>
                        <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>
                      </div>
                      <div className="game-key move-key" style={{gridArea: 'right'}} onClick={() => handleKeyPress('right')}>
                        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                      </div>
                    </div>
                    <div className="game-key" id="key-interact" onClick={() => handleKeyPress('interact')}>Interact</div>
                  </div>
                </div>
              </section>
            </header>
            
            {/* Main Content Panel */}
            <section id="main-content-panel" className="flex-grow flex flex-col overflow-hidden">
              <main id="main-content" className={`flex-grow flex flex-col overflow-hidden glass-panel rounded-lg relative ${gameState.focusMode ? 'focused' : ''}`}>
                
                {/* Tab Navigation */}
                <div id="main-tabs-container" className="flex-shrink-0 flex items-center overflow-x-auto whitespace-nowrap custom-scrollbar-x border-b border-[var(--border-color-main)]">
                  {['equipment', 'infusion', 'inventory', 'stats', 'combat', 'quest', 'settings'].map(tab => (
                    <button 
                      key={tab}
                      className={`main-tab-button ${gameState.currentTab === tab ? 'active' : ''}`}
                      onClick={() => switchTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div id="main-tab-content" className="flex-grow p-2 md:p-4 overflow-y-auto custom-scrollbar relative">
                  
                  {/* Equipment Tab */}
                  {gameState.currentTab === 'equipment' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Equipment</h2>
                      
                      <div className="equipment-grid">
                        {Object.entries(gameState.equipment).map(([slot, item]) => (
                          <div key={slot} className="equipment-slot-wrapper">
                            <div className="equipment-slot-title">
                              {slot.charAt(0).toUpperCase() + slot.slice(1)}
                            </div>
                            <div className="equipment-slot-content">
                              {item ? (
                                <div className="flex items-center gap-2">
                                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12" />
                                  <div className="flex flex-col">
                                    <span className="text-xs text-white">{item.name}</span>
                                    <span className="text-xs text-gray-400">{item.type}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">Empty</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Infusion Tab */}
                  {gameState.currentTab === 'infusion' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Infusion Chamber</h2>
                      
                      <div className="infusion-grid">
                        <div className="infusion-panel">
                          <div className="infusion-panel-title">Inventory</div>
                          <div className="infusion-content-area">
                            {gameState.inventory.length === 0 ? (
                              <div className="text-center text-gray-400 py-8">No items available</div>
                            ) : (
                              gameState.inventory.map((item, index) => (
                                <div key={index} className="infusion-item-entry">
                                  <img src={item.imageUrl} alt={item.name} />
                                  <div className="infusion-item-info">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-details">{item.type}</div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="infusion-panel">
                          <div className="infusion-panel-title">Focused Item</div>
                          <div className="infusion-content-area">
                            {gameState.infusionState.selectedItem ? (
                              <div className="focused-item-container">
                                <img src={gameState.infusionState.selectedItem.imageUrl} alt={gameState.infusionState.selectedItem.name} />
                                <div className="focused-item-details">
                                  <div className="item-name">{gameState.infusionState.selectedItem.name}</div>
                                  <div className="item-tier">{gameState.infusionState.selectedItem.type}</div>
                                </div>
                                <div className="sockets-container">
                                  {Array.from({length: gameState.infusionState.selectedItem.sockets || 0}).map((_, i) => (
                                    <div key={i} className="infusion-socket-slot">
                                      <span className="text-gray-500 text-xs">○</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-400 py-8">Select an item to infuse</div>
                            )}
                          </div>
                        </div>

                        <div className="infusion-panel">
                          <div className="infusion-panel-title">Gem Pouch</div>
                          <div className="infusion-content-area">
                            {gameState.gemPouch.length === 0 ? (
                              <div className="text-center text-gray-400 py-8">No gems available</div>
                            ) : (
                              <div className="gem-pouch-grid">
                                {gameState.gemPouch.map((gem, index) => (
                                  <div key={index} className="gem-item">
                                    <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-contain" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other tabs - placeholder content for now */}
                  {gameState.currentTab === 'inventory' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Inventory</h2>
                      <div className="inventory-grid">
                        {Array.from({length: 25}).map((_, i) => (
                          <div key={i} className="inventory-slot">
                            <span className="text-gray-500 text-xs absolute inset-0 flex items-center justify-center">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gameState.currentTab === 'stats' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Character Stats</h2>
                      <div className="space-y-4">
                        {Object.entries({
                          Strength: gameState.player.strength,
                          Dexterity: gameState.player.dexterity,
                          Constitution: gameState.player.constitution,
                          Intelligence: gameState.player.intelligence,
                          Wisdom: gameState.player.wisdom,
                          Charisma: gameState.player.charisma
                        }).map(([stat, value]) => (
                          <div key={stat} className="stat-line">
                            <span className="stat-name">{stat}</span>
                            <span className="stat-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gameState.currentTab === 'combat' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Combat</h2>
                      <div className="text-center text-gray-400">
                        Select a monster to fight
                      </div>
                    </div>
                  )}

                  {gameState.currentTab === 'quest' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Quest Log</h2>
                      <div className="text-center text-gray-400">
                        No active quests
                      </div>
                    </div>
                  )}

                  {gameState.currentTab === 'settings' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Settings</h2>
                      <div className="space-y-4">
                        <button className="glass-button p-2 rounded-md w-full">Save Game</button>
                        <button className="glass-button p-2 rounded-md w-full">Load Game</button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Focus Mode Button */}
                <button 
                  id="focus-mode-btn"
                  onClick={toggleFocusMode}
                  title="Toggle Focus Mode"
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-500 border border-white/30 flex items-center justify-center cursor-pointer transition-colors hover:bg-red-600 z-50"
                >
                  {gameState.focusMode ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                    </svg>
                  )}
                </button>

              </main>
            </section>

            {/* Communication Panel - Chat Footer */}
            <section id="communication-panel" className="flex-shrink-0">
              <div className="glass-panel w-full p-2 rounded-lg flex flex-col">
                <div className="flex-shrink-0 flex flex-wrap gap-1 mb-2">
                  <button className="footer-tab-button active">Main</button>
                  <button className="footer-tab-button">Sales</button>
                  <button className="footer-tab-button">Clan</button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="footer-chat-input flex-1 px-2 py-1 rounded text-sm"
                  />
                  <button className="glass-button px-3 py-1 rounded text-sm">Send</button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Zone Teleport Modal */}
      {zoneModalOpen && (
        <div className="modal-backdrop" onClick={() => setZoneModalOpen(false)}>
          <div className="glass-panel p-4 rounded-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-orbitron text-lg mb-4 text-orange-400">Select Zone</h3>
            <ul className="space-y-2">
              {Object.entries(gameState.zones).map(([id, zone]) => (
                <li 
                  key={id}
                  className="p-3 bg-orange-500/5 border border-orange-500/10 rounded cursor-pointer transition-colors hover:bg-orange-500/15 hover:border-orange-500"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, player: { ...prev.player, currentZone: parseInt(id) } }));
                    setZoneModalOpen(false);
                  }}
                >
                  <div className="font-medium">{zone.name}</div>
                  <div className="text-sm text-gray-400">Level {zone.levelReq} • {zone.biome}</div>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setZoneModalOpen(false)}
              className="glass-button w-full mt-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}