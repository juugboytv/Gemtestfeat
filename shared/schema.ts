import { z } from "zod";

// Game State Types
export const PlayerAttributesSchema = z.object({
  strength: z.number().default(10),
  agility: z.number().default(10),
  intelligence: z.number().default(10),
  vitality: z.number().default(10),
});

export const PlayerSchema = z.object({
  name: z.string().default("Adventurer"),
  level: z.number().default(1),
  health: z.number().default(100),
  maxHealth: z.number().default(100),
  experience: z.number().default(0),
  gold: z.number().default(0),
  attributes: PlayerAttributesSchema,
  availablePoints: z.number().default(0),
});

export const GameSettingsSchema = z.object({
  animations: z.boolean().default(true),
  sounds: z.boolean().default(true),
});

export const GameStateSchema = z.object({
  player: PlayerSchema,
  currentZone: z.string().default("tutorial-cave"),
  inventory: z.record(z.any()).default({}),
  equipment: z.record(z.any()).default({}),
  spells: z.array(z.string()).default(["heal"]),
  settings: GameSettingsSchema,
});

// Types
export type PlayerAttributes = z.infer<typeof PlayerAttributesSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type GameSettings = z.infer<typeof GameSettingsSchema>;
export type GameState = z.infer<typeof GameStateSchema>;

// Zone and Combat Types
export interface Zone {
  id: string;
  name: string;
  description: string;
  levelRequirement: number;
  locked: boolean;
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  defense: number;
}

export interface CombatState {
  enemy: Enemy | null;
  playerTurn: boolean;
  combatLog: string[];
}

// Item Types
export interface Item {
  id: string;
  name: string;
  type: string;
  description: string;
  stats?: Record<string, number>;
}

export interface EquipmentSlots {
  weapon?: Item;
  armor?: Item;
  helmet?: Item;
  accessory?: Item;
}
