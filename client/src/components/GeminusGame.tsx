import { useState, useEffect, useRef } from 'react';

// Game state interface matching the original structure
interface GameItem {
  instanceId: string;
  name: string;
  type: string;
  imageUrl: string;
  baseItemId: string;
  socketedGems?: GemInfo[];
  sockets?: number;
}

interface GemInfo {
  id: string;
  grade: number;
  abbreviation: string;
}

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
  equipment: Record<string, GameItem | null>;
  inventory: GameItem[];
  gemPouch: GemInfo[];
  zones: Record<string, {
    name: string;
    levelReq: number;
    biome: string;
    gearTier: number;
  }>;
  currentTab: string;
  focusMode: boolean;
  combatState: {
    selectedMonster: string;
    monsterHp: number;
    maxMonsterHp: number;
    inCombat: boolean;
  };
  infusionState: {
    selectedItem: GameItem | null;
    selectedGems: GemInfo[];
  };
}

export default function GeminusGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniMapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sample equipment item for testing
  const sampleHelmet: GameItem = {
    instanceId: "helmet_001",
    name: "Steel Helmet",
    type: "Helmet",
    imageUrl: "https://placehold.co/48x48/1f2937/f97316?text=H",
    baseItemId: "steel_helmet",
    socketedGems: [
      { id: "ruby", grade: 1, abbreviation: "R" },
      { id: "sapphire", grade: 2, abbreviation: "S" }
    ],
    sockets: 3
  };

  const sampleWeapon: GameItem = {
    instanceId: "weapon_001", 
    name: "Iron Sword",
    type: "Weapon",
    imageUrl: "https://placehold.co/48x48/1f2937/f97316?text=W",
    baseItemId: "iron_sword",
    socketedGems: [
      { id: "emerald", grade: 1, abbreviation: "E" }
    ],
    sockets: 2
  };

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
      "Helmet": sampleHelmet,
      "Weapon 1": sampleWeapon,
      "Armor": null,
      "Weapon 2": null,
      "Gauntlets": null,
      "Leggings": null,
      "Boots": null,
      "Necklace": null,
      "Spell 1": null,
      "Ring": null,
      "Spell 2": null
    },
    inventory: [
      {
        instanceId: "armor_001",
        name: "Steel Chestplate", 
        type: "Armor",
        imageUrl: "https://placehold.co/48x48/1f2937/f97316?text=A",
        baseItemId: "steel_armor",
        socketedGems: [],
        sockets: 2
      },
      {
        instanceId: "boots_001",
        name: "Iron Boots",
        type: "Boots", 
        imageUrl: "https://placehold.co/48x48/1f2937/f97316?text=B",
        baseItemId: "iron_boots",
        socketedGems: [
          { id: "ruby", grade: 1, abbreviation: "R" }
        ],
        sockets: 1
      }
    ],
    gemPouch: [
      { id: "lorestone", grade: 1, abbreviation: "LST" },
      { id: "mindrite", grade: 2, abbreviation: "MDR" },
      { id: "warstone", grade: 1, abbreviation: "WST" },
      { id: "true_core", grade: 3, abbreviation: "TRC" },
      { id: "vital_core", grade: 1, abbreviation: "VTC" },
      { id: "flame_core", grade: 2, abbreviation: "FLC" }
    ],
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
  const [equipmentView, setEquipmentView] = useState("equipment"); // "equipment" or "socket"
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  const [socketingModal, setSocketingModal] = useState<{ open: boolean; item: GameItem | null }>({ open: false, item: null });
  
  // Equipment slot configuration from original
  const equipmentSlotConfig = [
    { name: 'Helmet', type: 'Helmet' },
    { name: 'Weapon 1', type: 'Weapon' },
    { name: 'Armor', type: 'Armor' },
    { name: 'Weapon 2', type: 'Weapon' },
    { name: 'Gauntlets', type: 'Gauntlets' },
    { name: 'Leggings', type: 'Leggings' },
    { name: 'Boots', type: 'Boots' },
    { name: 'Necklace', type: 'Amulet' },
    { name: 'Spell 1', type: 'Spellbook' },
    { name: 'Ring', type: 'Ring' },
    { name: 'Spell 2', type: 'Spellbook' }
  ];

  // Inventory bags configuration from original
  const inventoryBags = {
    'Weapon Chest': ['Weapon'],
    'Bag of Gear': ['Helmet', 'Armor', 'Leggings', 'Boots', 'Gauntlets'],
    'Jewelry Box': ['Amulet', 'Ring'],
    'Spell Satchel': ['Spellbook'],
  };

  // Import your complete game data structure
  const GameData = {
    ItemFactory: {
      baseItemTemplates: [
        // Only showing a few key ones for now - the complete list will be imported from gameData.ts
        { id: 'base_helm_1', name: 'Iron Helm', type: 'Helmet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1396.png', proportion: 0.75, sockets: 2 },
        { id: 'base_armor_1', name: 'Steel Plate Armor', type: 'Armor', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1401.png', proportion: 1.0, sockets: 2 },
        { id: 'base_sword_1', name: 'Knightly Sword', type: 'Weapon', subType: 'Sword', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1412.png', proportion: 1.0, sockets: 2 }
      ]
    },
    Gems: {
      lorestone: { name: 'LoreStone', abbreviation: 'LST', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1500.png', effect: "Increase Base Spell Class", values: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
      mindrite: { name: 'Mindrite', abbreviation: 'MDR', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1504.png', effect: "Increase Wisdom", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
      warstone: { name: 'WarStone', abbreviation: 'WST', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1503.png', effect: "Increase Base Weapon Class", values: [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
      true_core: { name: 'True-Core', abbreviation: 'TRC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1538.png', effect: "Increase Hit Chance", values: [3, 6, 9, 12, 15, 18, 21, 25, 30] },
      vital_core: { name: 'Vital-Core', abbreviation: 'VTC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1533.png', effect: "Heals", values: [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
      flame_core: { name: 'Flame-Core', abbreviation: 'FLC', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1530.png', effect: "Damages Enemy", values: [8, 10, 12, 14, 16, 19, 22, 26, 30] }
    },
    equipmentSlotConfig: [
      { name: 'Helmet', type: 'Helmet' },
      { name: 'Weapon 1', type: 'Weapon' },
      { name: 'Armor', type: 'Armor' },
      { name: 'Weapon 2', type: 'Weapon' },
      { name: 'Gauntlets', type: 'Gauntlets' },
      { name: 'Leggings', type: 'Leggings' },
      { name: 'Boots', type: 'Boots' },
      { name: 'Necklace', type: 'Amulet' },
      { name: 'Spell 1', type: 'Spellbook' },
      { name: 'Ring', type: 'Ring' },
      { name: 'Spell 2', type: 'Spellbook' }
    ]
  };

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
                      {/* Equipment View Toggle Buttons */}
                      <div className="flex gap-2 mb-2">
                        <button 
                          className={`glass-button flex-1 py-1 text-sm rounded-md ${equipmentView === 'equipment' ? 'active' : ''}`}
                          onClick={() => setEquipmentView('equipment')}
                        >
                          Equipment
                        </button>
                        <button 
                          className={`glass-button flex-1 py-1 text-sm rounded-md ${equipmentView === 'socket' ? 'active' : ''}`}
                          onClick={() => setEquipmentView('socket')}
                        >
                          Socket
                        </button>
                      </div>

                      {/* Equipment View Content */}
                      <div id="equipment-view-content">
                        {equipmentView === 'equipment' ? (
                          <div className="equipment-grid">
                            {equipmentSlotConfig.map((slot) => {
                              const item = gameState.equipment[slot.name];
                              return (
                                <div key={slot.name} className="equipment-slot-wrapper">
                                  <div className="equipment-slot-title">
                                    {slot.name}
                                  </div>
                                  <div className="equipment-slot-content">
                                    {item ? (
                                      <div className="flex items-center gap-2 relative">
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12" />
                                        <div className="flex flex-col">
                                          <span className="text-xs text-white">{item.name}</span>
                                          <span className="text-xs text-gray-400">{item.type}</span>
                                        </div>
                                        {/* Gem dots indicator */}
                                        {item.socketedGems && item.socketedGems.filter((g: GemInfo | null) => g).length > 0 && (
                                          <div className="gem-dot-container">
                                            {item.socketedGems.filter((g: GemInfo | null) => g).map((_: GemInfo | null, index: number) => (
                                              <div key={index} className="gem-dot"></div>
                                            ))}
                                          </div>
                                        )}
                                        {/* Equipment gem list */}
                                        {item.socketedGems && item.socketedGems.filter((g: GemInfo | null) => g).length > 0 && (
                                          <div className="equipment-gem-list">
                                            {item.socketedGems.filter((g: GemInfo | null) => g).map((gemInfo: GemInfo | null, index: number) => (
                                              <div key={index}>
                                                {gemInfo?.abbreviation}{gemInfo?.grade}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">Empty</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center p-8 font-orbitron">
                            Select an item from your inventory to socket gems.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Infusion Tab */}
                  {gameState.currentTab === 'infusion' && (
                    <div className="h-full">
                      <p className="text-xs text-center text-gray-400 mb-2">Select a gem, then tap an item to open the socketing panel.</p>
                      
                      {/* Sort & Filter Items */}
                      <div className="stat-accordion-item open mb-2">
                        <button className="stat-accordion-header">
                          <h3 className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9M3 12h9m-9 4h6"></path>
                            </svg>
                            Sort & Filter Items
                          </h3>
                          <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="stat-accordion-content !p-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-400">Category</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Weapon Chest">Weapon Chest</option>
                                <option value="Bag of Gear">Bag of Gear</option>
                                <option value="Jewelry Box">Jewelry Box</option>
                                <option value="Spell Satchel">Spell Satchel</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Sub-Type</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Tier</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All Tiers</option>
                                <option value="1">Tier 1</option>
                                <option value="2">Tier 2</option>
                                <option value="3">Tier 3</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Quality</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Dropper">Dropper</option>
                                <option value="Shadow">Shadow</option>
                                <option value="Echo">Echo</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Socketed</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-700 pt-2">
                            <div>
                              <label className="text-xs text-gray-400">Sort By</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="tier">Tier</option>
                                <option value="name">Name</option>
                                <option value="type">Type</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Order</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item Bags */}
                      {Object.entries(inventoryBags).map(([bagName, itemTypes]) => {
                        const bagItems = gameState.inventory.filter(item => itemTypes.includes(item.type));
                        return (
                          <div key={bagName} className="stat-accordion-item mb-2" data-bag-container={bagName}>
                            <button className="stat-accordion-header">
                              <h3>{bagName} <span className="text-xs text-gray-500 font-sans">({bagItems.length})</span></h3>
                              <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="stat-accordion-content !p-2">
                              <div className="inventory-grid">
                                {bagItems.map((item) => (
                                  <div 
                                    key={item.instanceId} 
                                    className="inventory-slot" 
                                    data-instance-id={item.instanceId}
                                    onClick={() => setSocketingModal({ open: true, item })}
                                  >
                                    <div className="inventory-slot-content">
                                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12" />
                                      <span className="item-label text-xs">T1</span>
                                      {item.socketedGems && item.socketedGems.filter(g => g).length > 0 && (
                                        <div className="gem-dot-container">
                                          {item.socketedGems.filter(g => g).map((_, index) => (
                                            <div key={index} className="gem-dot"></div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Sort & Filter Gems */}
                      <div className="stat-accordion-item open mb-2">
                        <button className="stat-accordion-header">
                          <h3 className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9M3 12h9m-9 4h6"></path>
                            </svg>
                            Sort & Filter Gems
                          </h3>
                          <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="stat-accordion-content !p-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-400">Category</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Spell">Spell</option>
                                <option value="Melee">Melee</option>
                                <option value="Ranged">Ranged</option>
                                <option value="Defense">Defense</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Element</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Fire">Fire</option>
                                <option value="Air">Air</option>
                                <option value="Earth">Earth</option>
                                <option value="Cold">Cold</option>
                                <option value="Death">Death</option>
                                <option value="Arcane">Arcane</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Grade</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All Grades</option>
                                <option value="1">Grade 1</option>
                                <option value="2">Grade 2</option>
                                <option value="3">Grade 3</option>
                                <option value="4">Grade 4</option>
                                <option value="5">Grade 5</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-700 pt-2">
                            <div>
                              <label className="text-xs text-gray-400">Sort By</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="grade">Grade</option>
                                <option value="name">Name</option>
                                <option value="category">Category</option>
                                <option value="element">Element</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Order</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gem Pouch */}
                      <div className="stat-accordion-item open">
                        <button className="stat-accordion-header">
                          <h3>Gem Pouch <span className="text-xs text-gray-500 font-sans">({gameState.gemPouch.length})</span></h3>
                          <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="stat-accordion-content !p-2">
                          <div className="gem-pouch-grid">
                            {gameState.gemPouch.map((gemInfo, index) => (
                              <div 
                                key={`${gemInfo.id}-${index}`}
                                className={`gem-item ${selectedGemId === `${gemInfo.id}-${index}` ? 'selected' : ''}`}
                                data-gem-id={`${gemInfo.id}-${index}`}
                                onClick={() => setSelectedGemId(selectedGemId === `${gemInfo.id}-${index}` ? null : `${gemInfo.id}-${index}`)}
                              >
                                <img 
                                  src={`https://placehold.co/40x40/1f2937/f97316?text=${gemInfo.abbreviation}`} 
                                  className="w-10 h-10" 
                                  alt={`${gemInfo.abbreviation} Grade ${gemInfo.grade}`}
                                />
                                <span className="item-label">{gemInfo.abbreviation}{gemInfo.grade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inventory Tab */}
                  {gameState.currentTab === 'inventory' && (
                    <div className="h-full">
                      <h2 className="font-orbitron text-xl mb-4 text-orange-400">Inventory</h2>
                      
                      {/* Main Inventory Grid */}
                      <div className="inventory-grid mb-6">
                        {Array.from({length: 25}).map((_, i) => (
                          <div key={i} className="inventory-slot">
                            <span className="text-gray-500 text-xs absolute inset-0 flex items-center justify-center">{i + 1}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sort & Filter Gems */}
                      <div className="stat-accordion-item open mb-2">
                        <button className="stat-accordion-header">
                          <h3 className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9M3 12h9m-9 4h6"></path>
                            </svg>
                            Sort & Filter Gems
                          </h3>
                          <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="stat-accordion-content !p-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs text-gray-400">Category</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Gem Pouch">Gem Pouch</option>
                                <option value="Spell">Spell</option>
                                <option value="Melee">Melee</option>
                                <option value="Ranged">Ranged</option>
                                <option value="Defense">Defense</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Element</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All</option>
                                <option value="Fire">Fire</option>
                                <option value="Air">Air</option>
                                <option value="Earth">Earth</option>
                                <option value="Cold">Cold</option>
                                <option value="Death">Death</option>
                                <option value="Arcane">Arcane</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Grade</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="All">All Grades</option>
                                <option value="1">Grade 1</option>
                                <option value="2">Grade 2</option>
                                <option value="3">Grade 3</option>
                                <option value="4">Grade 4</option>
                                <option value="5">Grade 5</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-700 pt-2">
                            <div>
                              <label className="text-xs text-gray-400">Sort By</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="grade">Grade</option>
                                <option value="name">Name</option>
                                <option value="category">Category</option>
                                <option value="element">Element</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Order</label>
                              <select className="editor-input !w-full !text-xs">
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gem Pouch */}
                      <div className="stat-accordion-item open">
                        <button className="stat-accordion-header">
                          <h3>Gem Pouch <span className="text-xs text-gray-500 font-sans">({gameState.gemPouch.length})</span></h3>
                          <svg className="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="stat-accordion-content !p-2">
                          <div className="gem-pouch-grid">
                            {gameState.gemPouch.map((gemInfo, index) => (
                              <div 
                                key={`${gemInfo.id}-${index}`}
                                className={`gem-item ${selectedGemId === `${gemInfo.id}-${index}` ? 'selected' : ''}`}
                                data-gem-id={`${gemInfo.id}-${index}`}
                                onClick={() => setSelectedGemId(selectedGemId === `${gemInfo.id}-${index}` ? null : `${gemInfo.id}-${index}`)}
                              >
                                <img 
                                  src={`https://placehold.co/40x40/1f2937/f97316?text=${gemInfo.abbreviation}`} 
                                  className="w-10 h-10" 
                                  alt={`${gemInfo.abbreviation} Grade ${gemInfo.grade}`}
                                />
                                <span className="item-label">{gemInfo.abbreviation}{gemInfo.grade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
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

                {/* Socketing Modal */}
                {socketingModal.open && socketingModal.item && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSocketingModal({ open: false, item: null })}>
                    <div className="glass-panel p-4 rounded-lg w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="font-orbitron text-xl text-white">{socketingModal.item.name}</h2>
                        <button 
                          onClick={() => setSocketingModal({ open: false, item: null })}
                          className="text-2xl leading-none transition-colors hover:text-orange-400"
                        >
                          &times;
                        </button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="flex justify-center items-center gap-4 mt-2">
                          {Array(socketingModal.item.sockets || 0).fill(0).map((_, index) => {
                            const gemInfo = socketingModal.item?.socketedGems?.[index];
                            return (
                              <div 
                                key={index}
                                className={`infusion-socket-slot ${gemInfo ? 'has-gem' : ''}`}
                                data-socket-index={index}
                                onClick={() => {
                                  // Handle socket click logic here
                                  const updatedInventory = gameState.inventory.map(item => {
                                    if (item.instanceId === socketingModal.item?.instanceId) {
                                      const newItem = { ...item };
                                      if (!newItem.socketedGems) newItem.socketedGems = [];
                                      
                                      if (gemInfo) {
                                        // Remove gem
                                        newItem.socketedGems[index] = null as any;
                                        setGameState(prev => ({
                                          ...prev,
                                          inventory: prev.inventory.map(i => i.instanceId === item.instanceId ? newItem : i),
                                          gemPouch: [...prev.gemPouch, gemInfo]
                                        }));
                                      } else if (selectedGemId) {
                                        // Add gem
                                        const gemIndex = parseInt(selectedGemId.split('-')[1]);
                                        const gemToSocket = gameState.gemPouch[gemIndex];
                                        if (gemToSocket) {
                                          newItem.socketedGems[index] = gemToSocket;
                                          setGameState(prev => ({
                                            ...prev,
                                            inventory: prev.inventory.map(i => i.instanceId === item.instanceId ? newItem : i),
                                            gemPouch: prev.gemPouch.filter((_, i) => i !== gemIndex)
                                          }));
                                          setSelectedGemId(null);
                                        }
                                      }
                                    }
                                    return item;
                                  });
                                  
                                  // Update the modal item
                                  setSocketingModal(prev => ({
                                    ...prev,
                                    item: updatedInventory.find(item => item.instanceId === socketingModal.item?.instanceId) || null
                                  }));
                                }}
                              >
                                {gemInfo ? (
                                  <>
                                    <img 
                                      src={`https://placehold.co/44x44/1f2937/f97316?text=${gemInfo.abbreviation}`} 
                                      className="w-11 h-11"
                                      alt={`${gemInfo.abbreviation} Grade ${gemInfo.grade}`}
                                    />
                                    <span className="item-label">{gemInfo.abbreviation}{gemInfo.grade}</span>
                                  </>
                                ) : (
                                  <div className="w-11 h-11 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">Empty</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Focus Mode Button - Fixed positioning to prevent disappearing */}
                <button 
                  id="focus-mode-btn"
                  onClick={toggleFocusMode}
                  title="Toggle Focus Mode - Now Fixed!"
                  className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-red-600 border-2 border-white/50 flex items-center justify-center cursor-pointer transition-all hover:bg-red-700 hover:scale-110 z-[999] shadow-xl"
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