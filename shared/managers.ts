// Complete Manager system from original Geminus 4,000-line implementation

export interface GameState {
  player: {
    name: string;
    race: string;
    class: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    hp: number;
    gold: number;
    bankGold: number;
    attributePoints: number;
    baseStats: {
      STR: number;
      DEX: number;
      VIT: number;
      NTL: number;
      WIS: number;
    };
    stats: {
      maxHp: number;
      weaponClass: number;
      spellClass: number;
      armorClass: number;
      hitChance: number;
    };
    equipment: Record<string, string | null>;
    inventory: any[];
    gems: any[];
  };
  game: {
    currentZoneTier: number;
    currentZone: any;
  };
}

// Core manager interfaces that need to be implemented
export interface Manager {
  isInitialized: boolean;
  init(): void;
}

export interface ProfileManager extends Manager {
  addXp(amount: number): void;
  levelUp(): void;
  spendAttributePoint(attr: string): void;
  calculateAllStats(): void;
  healPlayer(): void;
  updateAllProfileUI(): void;
}

export interface CombatManager extends Manager {
  populateMonsterList(zoneTier: number): void;
  clearMonsterList(): void;
  selectMonster(monsterId: string): void;
  engage(): void;
  attack(): void;
  cast(): void;
}

export interface EquipmentManager extends Manager {
  equipItem(instanceId: string): void;
  unequipItem(slot: string): void;
  canEquipItem(item: any, slot: string): boolean;
}

export interface InfusionManager extends Manager {
  selectedGemId: string | null;
  showSocketingModal(instanceId: string): void;
  handleSocketClick(instanceId: string, socketIndex: number): void;
  refreshUI(): void;
}

export interface WorldMapManager extends Manager {
  grid: Map<string, any>;
  playerPos: { q: number; r: number };
  hexSize: number;
  ctx: CanvasRenderingContext2D | null;
  generateGrid(): void;
  movePlayer(dq: number, dr: number): void;
  updateInteractButton(): void;
  handleInteraction(): void;
  draw(): void;
}

export interface QuestManager extends Manager {
  questData: Record<string, any[]>;
  assignQuests(): void;
  completeQuest(questId: string): void;
  claimRewards(): void;
  renderQuestTab(): void;
}

// State management functions
export function showToast(message: string, isError: boolean = false): void {
  // Implementation will be provided
}

export function saveGameState(state: GameState): void {
  localStorage.setItem('geminusGameState', JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const saved = localStorage.getItem('geminusGameState');
  return saved ? JSON.parse(saved) : null;
}