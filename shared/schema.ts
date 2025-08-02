import { z } from "zod";

// Core Player Types
export const PlayerSchema = z.object({
  name: z.string().default("Player"),
  level: z.number().default(1),
  health: z.number().default(100),
  maxHealth: z.number().default(100),
  experience: z.number().default(0),
  gold: z.number().default(0),
  currentZone: z.string().default("1"),
  activeQuests: z.array(z.any()).default([]),
  questStreak: z.number().default(0),
  questPool: z.object({
    xp: z.number().default(0),
    gold: z.number().default(0),
    items: z.array(z.any()).default([])
  }).default({ xp: 0, gold: 0, items: [] }),
});

// Equipment and Items
export const GemSchema = z.object({
  name: z.string(),
  abbreviation: z.string(),
  imageUrl: z.string(),
  effect: z.string(),
  values: z.union([z.array(z.number()), z.record(z.array(z.number()))]),
  tier: z.number().optional()
});

export const ItemSchema = z.object({
  instanceId: z.string(),
  baseItemId: z.string(),
  type: z.enum(["Normal", "Shadow", "Echo"]),
  tier: z.number(),
  socketedGems: z.array(GemSchema).default([]),
  special: z.record(z.number()).nullable().default(null),
  quality: z.number().optional(),
  kills: z.number().optional(),
  classValue: z.number()
});

export const BaseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  subType: z.string().optional(),
  imageUrl: z.string(),
  proportion: z.number(),
  sockets: z.number(),
  special: z.record(z.number()).optional()
});

export const EquipmentSlotsSchema = z.object({
  helmet: ItemSchema.nullable().default(null),
  armor: ItemSchema.nullable().default(null),
  leggings: ItemSchema.nullable().default(null),
  boots: ItemSchema.nullable().default(null),
  gauntlets: ItemSchema.nullable().default(null),
  amulet: ItemSchema.nullable().default(null),
  ring: ItemSchema.nullable().default(null),
  weapon: ItemSchema.nullable().default(null),
  offhand: ItemSchema.nullable().default(null),
  spellbook: ItemSchema.nullable().default(null)
});

// Zone Types
export const ZoneSchema = z.object({
  name: z.string(),
  levelReq: z.number(),
  biome: z.string(),
  gearTier: z.number()
});

// Game State
export const GameStateSchema = z.object({
  player: PlayerSchema,
  equipment: EquipmentSlotsSchema.default({}),
  inventory: z.array(ItemSchema).default([]),
  gemPouch: z.array(GemSchema).default([]),
  zones: z.record(ZoneSchema).default({}),
  currentTab: z.string().default("equipment"),
  focusMode: z.boolean().default(false)
});

// Chat System
export const ChatMessageSchema = z.object({
  id: z.string(),
  username: z.string(),
  content: z.string(),
  timestamp: z.number(),
  channel: z.string(),
  replyTo: z.string().optional()
});

export const ChatStateSchema = z.object({
  channels: z.object({
    main: z.array(ChatMessageSchema).default([]),
    sales: z.array(ChatMessageSchema).default([]),
    clan: z.array(ChatMessageSchema).default([])
  }).default({ main: [], sales: [], clan: [] }),
  activeChannel: z.string().default("main"),
  isModalOpen: z.boolean().default(false)
});

// Export Types
export type Player = z.infer<typeof PlayerSchema>;
export type Gem = z.infer<typeof GemSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type BaseItem = z.infer<typeof BaseItemSchema>;
export type EquipmentSlots = z.infer<typeof EquipmentSlotsSchema>;
export type Zone = z.infer<typeof ZoneSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatState = z.infer<typeof ChatStateSchema>;

// Game Constants
export const EQUIPMENT_SLOTS = [
  { id: 'helmet', name: 'Helmet', icon: '⛑️' },
  { id: 'armor', name: 'Armor', icon: '🛡️' },
  { id: 'leggings', name: 'Leggings', icon: '👖' },
  { id: 'boots', name: 'Boots', icon: '👢' },
  { id: 'gauntlets', name: 'Gauntlets', icon: '🧤' },
  { id: 'amulet', name: 'Amulet', icon: '📿' },
  { id: 'ring', name: 'Ring', icon: '💍' },
  { id: 'weapon', name: 'Weapon', icon: '⚔️' },
  { id: 'offhand', name: 'Off-Hand', icon: '🛡️' },
  { id: 'spellbook', name: 'Spellbook', icon: '📚' }
];

export const TABS = [
  { id: 'equipment', label: 'Equipment' },
  { id: 'infusion', label: 'Infusion' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'stats', label: 'Stats' },
  { id: 'combat', label: 'Combat' },
  { id: 'quest', label: 'Quest' },
  { id: 'settings', label: 'Settings' }
];
