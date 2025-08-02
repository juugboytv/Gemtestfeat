import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { GameState, TABS } from '@/../../shared/schema';
import { ZONES } from '@/../../shared/gameData';
import EquipmentTab from './tabs/EquipmentTab';
import InfusionTab from './tabs/InfusionTab';
import InventoryTab from './tabs/InventoryTab';
import StatsTab from './tabs/StatsTab';
import CombatTab from './tabs/CombatTab';
import QuestTab from './tabs/QuestTab';
import SettingsTab from './tabs/SettingsTab';
import ZoneTeleportModal from './modals/ZoneTeleportModal';
import ChatSystem from './ChatSystem';
import { useGameState } from '../hooks/useGameState';
import { useToast } from '@/hooks/use-toast';

export function Game() {
  const { gameState, updateGameState } = useGameState();
  const [activeTab, setActiveTab] = useState('equipment');
  const [focusMode, setFocusMode] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const { toast } = useToast();

  // Movement controls
  const handleMovement = (direction: string) => {
    toast({
      title: "Movement",
      description: `Moving ${direction}`,
    });
  };

  const handleInteract = () => {
    toast({
      title: "Interact",
      description: "Interacting with environment",
    });
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
      case 'settings':
        return <SettingsTab />;
      default:
        return <EquipmentTab gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background smoke canvas effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-red-900/20"></div>
        {/* Animated smoke particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500/5 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              filter: 'blur(60px)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-screen max-w-md mx-auto flex flex-col p-2 gap-2">
        {/* Header */}
        <header className="glass-panel p-3 rounded-lg flex justify-between items-center flex-shrink-0">
          <section className="flex-1">
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center gap-4">
                <div>
                  <span className="font-orbitron text-sm text-gray-400">Level: </span>
                  <span className="font-orbitron text-white">{gameState.player.level}</span>
                  <span className="font-orbitron text-orange-400 ml-2 font-bold">{gameState.player.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => setShowZoneModal(true)}
                    className="text-xl hover:scale-110 transition-transform hover:text-orange-400"
                    title="Teleport to Zone"
                  >
                    🌀
                  </button>
                </div>
              </div>
              <div className="w-full max-w-[150px]">
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 block text-center mt-1">
                  {gameState.player.health} / {gameState.player.maxHealth}
                </span>
              </div>
            </div>
          </section>

          <section className="flex-1 flex justify-end">
            <div className="flex items-center gap-2">
              {/* Mini Map */}
              <div className="relative w-24 h-24" title="World Map">
                <div className="absolute -inset-1 rounded-full border border-dashed border-orange-500/30 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="relative w-full h-full rounded-full overflow-hidden glass-panel border-2 border-orange-500/30">
                  <div className="w-full h-full bg-gradient-to-br from-orange-900/40 via-black to-red-900/40 flex items-center justify-center">
                    <span className="text-xs font-orbitron text-orange-400">
                      {ZONES[gameState.player.currentZone]?.name.split(' ')[0] || 'Zone'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Movement Controls */}
              <div className="flex flex-col items-center gap-1">
                <div className="grid grid-cols-3 grid-rows-2 gap-1" style={{ gridTemplateAreas: '". up ." "left down right"' }}>
                  <button
                    onClick={() => handleMovement('up')}
                    className="game-key w-10 h-10 flex items-center justify-center"
                    style={{ gridArea: 'up' }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMovement('left')}
                    className="game-key w-10 h-10 flex items-center justify-center"
                    style={{ gridArea: 'left' }}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMovement('down')}
                    className="game-key w-10 h-10 flex items-center justify-center"
                    style={{ gridArea: 'down' }}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleMovement('right')}
                    className="game-key w-10 h-10 flex items-center justify-center"
                    style={{ gridArea: 'right' }}
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={handleInteract}
                  className="game-key px-4 py-2 text-sm font-bold"
                >
                  Interact
                </button>
              </div>
            </div>
          </section>
        </header>

        {/* Main Content */}
        <section className="flex-grow flex flex-col overflow-hidden">
          <main className="flex-grow flex flex-col overflow-hidden glass-panel rounded-lg relative">
            {/* Tab Navigation */}
            <div className="flex-shrink-0 flex items-center overflow-x-auto whitespace-nowrap border-b border-orange-500/30">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-orbitron transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                      : 'text-gray-400 hover:text-orange-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-grow p-4 overflow-y-auto relative">
              {renderTabContent()}
            </div>

            {/* Focus Mode Button */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-500 border border-white/30 flex items-center justify-center hover:bg-red-400 transition-colors z-50"
              title="Toggle Focus Mode"
            >
              {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </main>
        </section>

        {/* Chat System */}
        {!focusMode && <ChatSystem />}
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
            toast({
              title: "Teleported",
              description: `Teleported to ${ZONES[zoneId]?.name}`,
            });
          }}
        />
      )}
    </div>
  );
}