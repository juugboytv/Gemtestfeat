// Game State Management and Integration Layer
// Bridges the original HTML game with the new backend and mathematical systems

import { Character, Item } from './schema';
import { 
  GEAR_TIERS, 
  ZONE_DATA,
  calculateMonsterStats, 
  calculateEquipmentStats, 
  calculatePlayerStats,
  getExperienceRequired,
  calculateDamage,
  rollCriticalHit,
  isZoneUnlocked
} from './gameData';

export interface GameState {
  character: Character | null;
  inventory: Item[];
  equippedItems: Record<string, Item | null>;
  currentZone: number;
  isInCombat: boolean;
  combatTarget: any;
  autoFightEnabled: boolean;
}

export interface CombatResult {
  victory: boolean;
  experienceGained: number;
  goldGained: number;
  itemsDropped: Item[];
  damageDealt: number;
  damageTaken: number;
  criticalHits: number;
  combatDuration: number;
}

export class GameStateManager {
  private gameState: GameState;
  private combatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.gameState = {
      character: null,
      inventory: [],
      equippedItems: {},
      currentZone: 1,
      isInCombat: false,
      combatTarget: null,
      autoFightEnabled: false
    };
  }

  // Initialize character with proper GDD scaling
  initializeCharacter(character: Character): void {
    this.gameState.character = character;
    this.updateCharacterStats();
  }

  // Update character stats based on level and equipment
  updateCharacterStats(): void {
    if (!this.gameState.character) return;

    const level = this.gameState.character.level;
    const baseStats = calculatePlayerStats(level);
    
    // Calculate equipment bonuses
    let totalAttackBonus = 0;
    let totalDefenseBonus = 0;
    let totalHealthBonus = 0;

    Object.values(this.gameState.equippedItems).forEach(item => {
      if (item) {
        totalAttackBonus += item.attackBonus || 0;
        totalDefenseBonus += item.defenseBonus || 0;
        totalHealthBonus += item.healthBonus || 0;
      }
    });

    // Update character with calculated stats
    this.gameState.character.attack = baseStats.baseAttack + totalAttackBonus;
    this.gameState.character.defense = baseStats.baseDefense + totalDefenseBonus;
    this.gameState.character.maxHealth = baseStats.baseHealth + totalHealthBonus;
    
    // Ensure health doesn't exceed max
    if (this.gameState.character.health > this.gameState.character.maxHealth) {
      this.gameState.character.health = this.gameState.character.maxHealth;
    }
  }

  // Level up system with proper experience requirements
  checkLevelUp(): boolean {
    if (!this.gameState.character) return false;

    const currentLevel = this.gameState.character.level;
    const requiredXP = getExperienceRequired(currentLevel + 1);
    
    if (this.gameState.character.experience >= requiredXP) {
      this.gameState.character.level++;
      this.gameState.character.experience -= requiredXP;
      this.updateCharacterStats();
      return true;
    }
    
    return false;
  }

  // Zone management with unlock requirements
  canTravelToZone(zoneId: number): boolean {
    if (!this.gameState.character) return false;
    return isZoneUnlocked(zoneId, this.gameState.character.level);
  }

  travelToZone(zoneId: number): boolean {
    if (!this.canTravelToZone(zoneId)) return false;
    
    this.gameState.currentZone = zoneId;
    this.gameState.character!.currentZone = zoneId;
    return true;
  }

  // Combat system with proper mathematical scaling
  startCombat(monster: any): void {
    if (!this.gameState.character) return;

    // Calculate monster stats based on zone and level
    const monsterLevel = this.calculateMonsterLevel();
    const monsterStats = calculateMonsterStats(
      this.gameState.currentZone, 
      monsterLevel, 
      monster.isBoss || false
    );

    this.gameState.combatTarget = {
      ...monster,
      level: monsterLevel,
      currentHp: monsterStats.hp,
      maxHp: monsterStats.hp,
      attack: monsterStats.attack,
      defense: monsterStats.defense,
      xpReward: monsterStats.xp,
      goldReward: monsterStats.gold
    };

    this.gameState.isInCombat = true;
  }

  // Calculate appropriate monster level for current zone and player
  private calculateMonsterLevel(): number {
    if (!this.gameState.character) return 1;

    const zoneData = ZONE_DATA.find(z => z.id === this.gameState.currentZone);
    if (!zoneData) return this.gameState.character.level;

    // Monster level should be within zone range and scale with player level
    const playerLevel = this.gameState.character.level;
    const minLevel = Math.max(zoneData.levelRange.min, Math.floor(playerLevel * 0.8));
    const maxLevel = Math.min(zoneData.levelRange.max, Math.floor(playerLevel * 1.2));
    
    return Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
  }

  // Execute single combat round
  executeCombatRound(): { playerDamage: number; monsterDamage: number; playerCrit: boolean; monsterCrit: boolean } | null {
    if (!this.gameState.isInCombat || !this.gameState.character || !this.gameState.combatTarget) {
      return null;
    }

    const character = this.gameState.character;
    const monster = this.gameState.combatTarget;

    // Player attacks monster
    const playerCrit = rollCriticalHit();
    const playerDamage = calculateDamage(character.attack, monster.defense, playerCrit);
    monster.currentHp = Math.max(0, monster.currentHp - playerDamage);

    // Monster attacks player (if still alive)
    let monsterDamage = 0;
    let monsterCrit = false;
    
    if (monster.currentHp > 0) {
      monsterCrit = rollCriticalHit();
      monsterDamage = calculateDamage(monster.attack, character.defense, monsterCrit);
      character.health = Math.max(0, character.health - monsterDamage);
    }

    return { playerDamage, monsterDamage, playerCrit, monsterCrit };
  }

  // Check if combat is finished and handle rewards
  checkCombatEnd(): CombatResult | null {
    if (!this.gameState.isInCombat || !this.gameState.character || !this.gameState.combatTarget) {
      return null;
    }

    const character = this.gameState.character;
    const monster = this.gameState.combatTarget;

    // Player defeated
    if (character.health <= 0) {
      this.gameState.isInCombat = false;
      return {
        victory: false,
        experienceGained: 0,
        goldGained: 0,
        itemsDropped: [],
        damageDealt: 0,
        damageTaken: 0,
        criticalHits: 0,
        combatDuration: 0
      };
    }

    // Monster defeated
    if (monster.currentHp <= 0) {
      this.gameState.isInCombat = false;
      
      // Award experience and gold
      character.experience += monster.xpReward;
      character.gold += monster.goldReward;

      // Check for level up
      const leveledUp = this.checkLevelUp();

      // Generate item drops (simple system for now)
      const itemsDropped = this.generateItemDrops(monster);

      return {
        victory: true,
        experienceGained: monster.xpReward,
        goldGained: monster.goldReward,
        itemsDropped,
        damageDealt: 0, // TODO: Track throughout combat
        damageTaken: 0, // TODO: Track throughout combat
        criticalHits: 0, // TODO: Track throughout combat
        combatDuration: 0 // TODO: Track combat time
      };
    }

    return null; // Combat continues
  }

  // Generate item drops based on monster and zone
  private generateItemDrops(monster: any): Item[] {
    const drops: Item[] = [];
    
    // 20% chance for normal monsters, 80% for bosses
    const dropChance = monster.isBoss ? 0.8 : 0.2;
    
    if (Math.random() < dropChance) {
      const item = this.generateRandomItem();
      if (item) drops.push(item);
    }

    return drops;
  }

  // Generate random equipment appropriate for current zone/level
  private generateRandomItem(): Item | null {
    if (!this.gameState.character) return null;

    const playerLevel = this.gameState.character.level;
    const zoneData = ZONE_DATA.find(z => z.id === this.gameState.currentZone);
    
    // Determine appropriate gear tier based on player level
    const availableTiers = GEAR_TIERS.filter(tier => 
      tier.levelRequirement <= playerLevel && 
      tier.levelRequirement >= Math.max(1, playerLevel - 50)
    );
    
    if (availableTiers.length === 0) return null;

    const randomTier = availableTiers[Math.floor(Math.random() * availableTiers.length)];
    const equipmentTypes = ['weapon', 'armor', 'shield', 'helmet', 'boots', 'gloves', 'ring', 'amulet'];
    const randomType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    
    const itemLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 21) - 10); // ±10 levels
    const stats = calculateEquipmentStats(randomTier.id, itemLevel, randomType);

    return {
      id: 0, // Will be set by storage
      characterId: this.gameState.character.id,
      name: `${randomTier.name} ${randomType}`,
      type: randomType,
      gearTier: randomTier.id,
      quality: 'normal',
      attackBonus: stats.attack,
      defenseBonus: stats.defense,
      healthBonus: stats.health,
      enchantments: null,
      durability: 100,
      maxDurability: 100,
      value: stats.value,
      isEquipped: false,
      inBank: false,
      createdAt: new Date()
    };
  }

  // Equipment management
  equipItem(itemId: number): boolean {
    const item = this.gameState.inventory.find(i => i.id === itemId);
    if (!item || !this.gameState.character) return false;

    // Unequip current item in slot if any
    const currentEquipped = this.gameState.equippedItems[item.type];
    if (currentEquipped) {
      currentEquipped.isEquipped = false;
      this.gameState.equippedItems[item.type] = null;
    }

    // Equip new item
    item.isEquipped = true;
    this.gameState.equippedItems[item.type] = item;
    
    this.updateCharacterStats();
    return true;
  }

  unequipItem(itemType: string): boolean {
    const equippedItem = this.gameState.equippedItems[itemType];
    if (!equippedItem) return false;

    equippedItem.isEquipped = false;
    this.gameState.equippedItems[itemType] = null;
    
    this.updateCharacterStats();
    return true;
  }

  // Auto-fight system
  enableAutoFight(): void {
    if (this.gameState.autoFightEnabled || !this.gameState.character) return;

    this.gameState.autoFightEnabled = true;
    this.gameState.character.autoFightEnabled = true;
    
    // Start auto-combat loop
    this.combatInterval = setInterval(() => {
      this.autoFightTick();
    }, 1000); // 1 second per round
  }

  disableAutoFight(): void {
    this.gameState.autoFightEnabled = false;
    if (this.gameState.character) {
      this.gameState.character.autoFightEnabled = false;
    }
    
    if (this.combatInterval) {
      clearInterval(this.combatInterval);
      this.combatInterval = null;
    }
  }

  private autoFightTick(): void {
    if (!this.gameState.autoFightEnabled || !this.gameState.character) {
      this.disableAutoFight();
      return;
    }

    // If not in combat, find a new monster
    if (!this.gameState.isInCombat) {
      // TODO: Select random monster from current zone
      // For now, this would integrate with the existing monster selection logic
    }

    // Execute combat round if in combat
    if (this.gameState.isInCombat) {
      this.executeCombatRound();
      const result = this.checkCombatEnd();
      
      if (result && !result.victory) {
        // Player died, disable auto-fight
        this.disableAutoFight();
      }
    }
  }

  // Getters for game state
  getCharacter(): Character | null {
    return this.gameState.character;
  }

  getInventory(): Item[] {
    return this.gameState.inventory;
  }

  getCurrentZone(): number {
    return this.gameState.currentZone;
  }

  isInCombat(): boolean {
    return this.gameState.isInCombat;
  }

  getCombatTarget(): any {
    return this.gameState.combatTarget;
  }

  // Save/load integration points for persistence
  serializeState(): string {
    return JSON.stringify({
      character: this.gameState.character,
      inventory: this.gameState.inventory,
      currentZone: this.gameState.currentZone,
      autoFightEnabled: this.gameState.autoFightEnabled
    });
  }

  loadState(serializedState: string): void {
    try {
      const state = JSON.parse(serializedState);
      this.gameState.character = state.character;
      this.gameState.inventory = state.inventory || [];
      this.gameState.currentZone = state.currentZone || 1;
      this.gameState.autoFightEnabled = state.autoFightEnabled || false;
      
      // Rebuild equipped items map
      this.gameState.equippedItems = {};
      this.gameState.inventory
        .filter(item => item.isEquipped)
        .forEach(item => {
          this.gameState.equippedItems[item.type] = item;
        });
        
      this.updateCharacterStats();
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }
}

// Global game state manager instance
export const gameManager = new GameStateManager();