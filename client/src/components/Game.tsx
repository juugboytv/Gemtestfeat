import { useState, useCallback } from 'react';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';
import { AdventureTab } from './tabs/AdventureTab';
import { CharacterTab } from './tabs/CharacterTab';
import { InventoryTab } from './tabs/InventoryTab';
import { EquipmentTab } from './tabs/EquipmentTab';
import { SpellsTab } from './tabs/SpellsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ZoneTeleportModal } from './modals/ZoneTeleportModal';
import { StatInfoModal } from './modals/StatInfoModal';
import { Toast } from './Toast';
import { SmokeCanvas } from './SmokeCanvas';
import { useGameState } from '@/hooks/useGameState';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { TabType, Direction, ToastMessage, AttributeType, StatInfo } from '@/types/game';

export function Game() {
  const { gameState, saveGame, loadGame, newGame, updatePlayer, updateSettings, setCurrentZone } = useGameState();
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('adventure');
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [currentStatInfo, setCurrentStatInfo] = useState<StatInfo | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Game Actions
  const handleMove = useCallback((direction: Direction) => {
    console.log(`Moving player ${direction}`);
    // TODO: Implement movement logic
  }, []);

  const handleInteract = useCallback(() => {
    console.log('Interacting with environment');
    // TODO: Implement interaction logic
  }, []);

  // Use keyboard controls
  useKeyboardControls({ onMove: handleMove, onInteract: handleInteract });

  // Toast management
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Zone teleportation
  const handleTeleport = useCallback((zoneId: string) => {
    setCurrentZone(zoneId);
    showToast(`Teleported to ${zoneId.replace('-', ' ')}`);
  }, [setCurrentZone, showToast]);

  // Attribute management
  const handleAttributeIncrease = useCallback((attribute: AttributeType) => {
    updatePlayer(player => {
      if (player.availablePoints > 0) {
        return {
          ...player,
          attributes: {
            ...player.attributes,
            [attribute]: player.attributes[attribute] + 1
          },
          availablePoints: player.availablePoints - 1
        };
      }
      return player;
    });
    showToast(`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} increased!`);
  }, [updatePlayer, showToast]);

  // Settings handlers
  const handleSave = useCallback(() => {
    const result = saveGame();
    showToast(result.message, result.success ? 'success' : 'error');
  }, [saveGame, showToast]);

  const handleLoad = useCallback(() => {
    const result = loadGame();
    showToast(result.message, result.success ? 'success' : 'error');
  }, [loadGame, showToast]);

  const handleNewGame = useCallback(() => {
    if (confirm('Are you sure you want to start a new game? This will erase your current progress.')) {
      const result = newGame();
      showToast(result.message);
    }
  }, [newGame, showToast]);

  const handleResetCharacter = useCallback(() => {
    if (confirm('Are you sure you want to reset your character? This will reset all attributes.')) {
      updatePlayer(player => ({
        ...player,
        attributes: {
          strength: 10,
          agility: 10,
          intelligence: 10,
          vitality: 10
        }
      }));
      showToast('Character reset!');
    }
  }, [updatePlayer, showToast]);

  const handleToggleAnimations = useCallback(() => {
    updateSettings(settings => ({
      ...settings,
      animations: !settings.animations
    }));
    showToast(`Animations ${gameState.settings.animations ? 'disabled' : 'enabled'}`);
  }, [updateSettings, showToast, gameState.settings.animations]);

  const handleToggleSounds = useCallback(() => {
    updateSettings(settings => ({
      ...settings,
      sounds: !settings.sounds
    }));
    showToast(`Sound effects ${gameState.settings.sounds ? 'disabled' : 'enabled'}`);
  }, [updateSettings, showToast, gameState.settings.sounds]);

  const handleNameChange = useCallback((name: string) => {
    updatePlayer(player => ({
      ...player,
      name
    }));
  }, [updatePlayer]);

  // Render current tab
  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'adventure':
        return (
          <AdventureTab
            currentZone={gameState.currentZone}
            onMove={handleMove}
            onInteract={handleInteract}
          />
        );
      case 'character':
        return (
          <CharacterTab
            player={gameState.player}
            onAttributeIncrease={handleAttributeIncrease}
          />
        );
      case 'inventory':
        return <InventoryTab inventory={gameState.inventory} />;
      case 'equipment':
        return <EquipmentTab equipment={gameState.equipment} gems={{}} />;
      case 'spells':
        return <SpellsTab knownSpells={gameState.spells} />;
      case 'settings':
        return (
          <SettingsTab
            settings={gameState.settings}
            playerName={gameState.player.name}
            onSave={handleSave}
            onLoad={handleLoad}
            onNewGame={handleNewGame}
            onResetCharacter={handleResetCharacter}
            onToggleAnimations={handleToggleAnimations}
            onToggleSounds={handleToggleSounds}
            onNameChange={handleNameChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
      
      <SmokeCanvas />
      
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
        <Header
          player={gameState.player}
          currentZone={gameState.currentZone}
          onTeleportClick={() => setShowZoneModal(true)}
        />

        <div className="glass-panel flex-1 m-2 p-4 rounded-lg overflow-hidden">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {renderCurrentTab()}
        </div>
      </div>

      <ZoneTeleportModal
        isOpen={showZoneModal}
        onClose={() => setShowZoneModal(false)}
        onTeleport={handleTeleport}
      />

      <StatInfoModal
        isOpen={showStatModal}
        statInfo={currentStatInfo}
        onClose={() => {
          setShowStatModal(false);
          setCurrentStatInfo(null);
        }}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
