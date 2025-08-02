import { useState, useEffect } from 'react';
import { GameState, TABS } from '@/../../shared/schema';
import { ZONES } from '@/../../shared/gameData';
import EquipmentTab from './tabs/EquipmentTab';
import InfusionTab from './tabs/InfusionTab';
import InventoryTab from './tabs/InventoryTab';
import StatsTab from './tabs/StatsTab';
import CombatTab from './tabs/CombatTab';
import QuestTab from './tabs/QuestTab';
import SettingsTab from './tabs/SettingsTab';
import SpellsTab from './tabs/SpellsTab';
import ZoneTeleportModal from './modals/ZoneTeleportModal';
import ChatSystem from './ChatSystem';
import MiniMap from './MiniMap';
import { useGameState } from '../hooks/useGameState';

export function Game() {
  const { gameState, updateGameState } = useGameState();
  const [activeTab, setActiveTab] = useState('equipment');
  const [focusMode, setFocusMode] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);

  // Movement controls  
  const handleMovement = (direction: string) => {
    console.log(`Moving ${direction}`);
  };

  const handleInteract = () => {
    console.log('Interacting with environment');
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipment':
        return <EquipmentTab gameState={gameState} updateGameState={updateGameState} />;
      case 'infusion':
        return <InfusionTab gameState={gameState} updateGameState={updateGameState} />;
      case 'inventory':
        return <InventoryTab gameState={gameState} updateGameState={updateGameState} />;
      case 'stats':
        return <StatsTab gameState={gameState} />;
      case 'combat':
        return <CombatTab gameState={gameState} updateGameState={updateGameState} />;
      case 'quest':
        return <QuestTab gameState={gameState} updateGameState={updateGameState} />;
      case 'spells':
        return <SpellsTab gameState={gameState} updateGameState={updateGameState} />;
      case 'settings':
        return <SettingsTab gameState={gameState} updateGameState={updateGameState} />;
      default:
        return <EquipmentTab gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="bg-black">
      <canvas id="smoke-canvas"></canvas>
      
      <div id="game-container" className="h-full">
        <div id="game-hud-screen" className="relative z-10 h-full">
          <div className="max-w-md mx-auto h-full flex flex-col p-2 gap-2">
            
            {/* Header */}
            <header id="game-section" className="glass-panel p-3 rounded-lg flex justify-between items-center flex-shrink-0">
              <section id="player-status-panel" className="flex-1">
                <div id="player-status-container" className="flex flex-col items-start space-y-2 flex-grow">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="level-label font-orbitron">Level: </span>
                      <span id="player-level-value" className="level-value font-orbitron">{gameState.player.level}</span>
                      <span id="player-name-value" className="name-value ml-2 font-orbitron">{gameState.player.name}</span>
                    </div>
                    <div id="transport-controls">
                      <button 
                        id="zone-teleport-trigger" 
                        className="teleport-trigger-btn" 
                        title="Teleport to Zone"
                        onClick={() => setShowZoneModal(true)}
                      >
                        🌀
                      </button>
                    </div>
                  </div>
                  <div className="health-bar-container w-full max-w-[150px]">
                    <div className="progress-bar-track h-3">
                      <div 
                        id="hp-bar" 
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
                    <div className="absolute -inset-1 rounded-full border border-dashed border-orange-500/30 animate-spin" style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden glass-panel border-2 border-[var(--border-color-main)]">
                      <MiniMap gameState={gameState} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div id="d-pad-controls">
                      <div 
                        className="game-key move-key" 
                        id="key-up" 
                        data-key="up"
                        onClick={() => handleMovement('up')}
                      >
                        <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
                      </div>
                      <div 
                        className="game-key move-key" 
                        id="key-left" 
                        data-key="left"
                        onClick={() => handleMovement('left')}
                      >
                        <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                      </div>
                      <div 
                        className="game-key move-key" 
                        id="key-down" 
                        data-key="down"
                        onClick={() => handleMovement('down')}
                      >
                        <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>
                      </div>
                      <div 
                        className="game-key move-key" 
                        id="key-right" 
                        data-key="right"
                        onClick={() => handleMovement('right')}
                      >
                        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                      </div>
                    </div>
                    <div 
                      className="game-key" 
                      id="key-interact" 
                      data-key="interact"
                      onClick={handleInteract}
                    >
                      Interact
                    </div>
                  </div>
                </div>
              </section>
            </header>
            
            {/* Main Content */}
            <section id="main-content-panel" className="flex-grow flex flex-col overflow-hidden">
              <main 
                id="main-content" 
                className={`flex-grow flex flex-col overflow-hidden glass-panel rounded-lg relative ${
                  focusMode ? 'focused' : ''
                }`}
              >
                <div id="main-tabs-container" className="flex-shrink-0 flex items-center overflow-x-auto whitespace-nowrap custom-scrollbar-x border-b border-[var(--border-color-main)]">
                  {TABS.map((tab) => (
                    <button 
                      key={tab.id}
                      className={`main-tab-button ${activeTab === tab.id ? 'active' : ''}`} 
                      data-tab={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div id="main-tab-content" className="flex-grow p-2 md:p-4 overflow-y-auto custom-scrollbar relative">
                  <div 
                    id={`tab-content-${activeTab}`} 
                    className="main-tab-panel active"
                  >
                    {renderTabContent()}
                  </div>
                </div>
                
                <button 
                  id="focus-mode-btn" 
                  title="Toggle Focus Mode"
                  onClick={() => setFocusMode(!focusMode)}
                >
                  <svg 
                    id="focus-icon-expand" 
                    className={focusMode ? 'hidden' : ''}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
                  </svg>
                  <svg 
                    id="focus-icon-collapse" 
                    className={focusMode ? '' : 'hidden'}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
              </main>
            </section>

            {/* Chat System */}
            {!focusMode && (
              <section id="communication-panel" className="flex-shrink-0">
                <ChatSystem />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Zone Teleport Modal */}
      {showZoneModal && (
        <ZoneTeleportModal
          zones={ZONES}
          currentZone={gameState.player.currentZone}
          playerLevel={gameState.player.level}
          onClose={() => setShowZoneModal(false)}
          onTeleport={(zoneId) => {
            updateGameState({
              player: { ...gameState.player, currentZone: zoneId }
            });
            setShowZoneModal(false);
          }}
        />
      )}
    </div>
  );
}