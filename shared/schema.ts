import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table for authentication and basic account data
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
});

// Characters table - core player data following GDD specifications
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  race: text('race').notNull(), // One of 24 racial starting zones
  level: integer('level').notNull().default(1),
  experience: integer('experience').notNull().default(0),
  currentZone: integer('current_zone').notNull().default(1), // Zone 1-101
  
  // Core stats from GDD
  health: integer('health').notNull().default(100),
  maxHealth: integer('max_health').notNull().default(100),
  attack: integer('attack').notNull().default(10),
  defense: integer('defense').notNull().default(10),
  
  // Resources
  gold: integer('gold').notNull().default(100),
  bankGold: integer('bank_gold').notNull().default(0),
  
  // Equipment slots (item IDs)
  equippedWeapon: integer('equipped_weapon'),
  equippedArmor: integer('equipped_armor'),
  equippedShield: integer('equipped_shield'),
  equippedHelmet: integer('equipped_helmet'),
  equippedBoots: integer('equipped_boots'),
  equippedGloves: integer('equipped_gloves'),
  equippedRing: integer('equipped_ring'),
  equippedAmulet: integer('equipped_amulet'),
  
  // Combat and progression
  combatTarget: text('combat_target'),
  lastCombatAction: timestamp('last_combat_action'),
  autoFightEnabled: boolean('auto_fight_enabled').default(false),
  
  // Character creation and updates
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Items table - comprehensive equipment system with 20 gear tiers
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  
  // Item identification
  name: text('name').notNull(),
  type: text('type').notNull(), // weapon, armor, shield, helmet, boots, gloves, ring, amulet
  gearTier: integer('gear_tier').notNull(), // 1-20 (Crude to Ascended)
  quality: text('quality').notNull().default('normal'), // normal, enhanced, superior, legendary
  
  // Stats - following GDD mathematical progression
  attackBonus: integer('attack_bonus').default(0),
  defenseBonus: integer('defense_bonus').default(0),
  healthBonus: integer('health_bonus').default(0),
  
  // Special properties
  enchantments: jsonb('enchantments'), // Special effects and bonuses
  durability: integer('durability').default(100),
  maxDurability: integer('max_durability').default(100),
  
  // Trading and economy
  value: integer('value').notNull(),
  isEquipped: boolean('is_equipped').default(false),
  inBank: boolean('in_bank').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Combat logs for tracking battles and rewards
export const combatLogs = pgTable('combat_logs', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  
  // Combat details
  zoneId: integer('zone_id').notNull(),
  monsterName: text('monster_name').notNull(),
  monsterLevel: integer('monster_level').notNull(),
  isBoss: boolean('is_boss').default(false),
  
  // Results
  victory: boolean('victory').notNull(),
  experienceGained: integer('experience_gained').default(0),
  goldGained: integer('gold_gained').default(0),
  itemsDropped: jsonb('items_dropped'), // Array of dropped items
  
  // Combat metrics
  damageDealt: integer('damage_dealt').default(0),
  damageTaken: integer('damage_taken').default(0),
  combatDuration: integer('combat_duration'), // in seconds
  criticalHits: integer('critical_hits').default(0),
  
  timestamp: timestamp('timestamp').defaultNow(),
});

// Zone progression tracking
export const zoneProgress = pgTable('zone_progress', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  zoneId: integer('zone_id').notNull(),
  
  // Progress metrics
  monstersDefeated: integer('monsters_defeated').default(0),
  bossesDefeated: integer('bosses_defeated').default(0),
  totalExperience: integer('total_experience').default(0),
  totalGold: integer('total_gold').default(0),
  
  // Zone mastery
  firstClear: timestamp('first_clear'),
  fastestClear: integer('fastest_clear'), // in seconds
  highestDamage: integer('highest_damage'),
  
  unlocked: boolean('unlocked').default(false),
  lastVisit: timestamp('last_visit'),
});

// Gems table - comprehensive gem system with grades T1-T9
export const gems = pgTable('gems', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  
  // Gem identification
  gemType: text('gem_type').notNull(), // warstone, warheart, etc.
  grade: integer('grade').notNull(), // 1-9 (T1-T9)
  category: text('category').notNull(), // Fighter, Caster, Utility, Farming
  
  // Stats based on gem type and grade
  statBonus: integer('stat_bonus').notNull(), // Primary stat bonus
  secondaryBonus: integer('secondary_bonus').default(0), // Secondary effect if any
  
  // Special properties
  enchantments: jsonb('enchantments'), // Special gem effects
  isSocketed: boolean('is_socketed').default(false),
  socketedItemId: integer('socketed_item_id'), // Reference to item it's socketed in
  
  // Economy
  value: integer('value').notNull(),
  inBank: boolean('in_bank').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Shadow items table - procedural gear with tiers T1-T20
export const shadowItems = pgTable('shadow_items', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  
  // Shadow item identification
  baseItemName: text('base_item_name').notNull(), // Base item type
  shadowTier: integer('shadow_tier').notNull(), // 1-20 (T1-T20)
  quality: text('quality').notNull(), // normal, enhanced, superior, legendary
  
  // Procedural stats
  weaponClass: integer('weapon_class').default(0),
  spellClass: integer('spell_class').default(0),
  armorClass: integer('armor_class').default(0),
  
  // Special properties
  enchantments: jsonb('enchantments'), // Procedural enchantments
  sockets: integer('sockets').default(0), // Number of gem sockets
  socketedGems: jsonb('socketed_gems'), // Array of socketed gem IDs
  
  // Equipment properties
  equipRequirements: jsonb('equip_requirements'), // Level and stat requirements
  isEquipped: boolean('is_equipped').default(false),
  equipSlot: text('equip_slot'), // weapon, armor, shield, etc.
  
  // Economy
  value: integer('value').notNull(),
  inBank: boolean('in_bank').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Game configuration and balancing data
export const gameConfig = pgTable('game_config', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations for data integrity and efficient queries
export const usersRelations = relations(users, ({ many }) => ({
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
  items: many(items),
  combatLogs: many(combatLogs),
  zoneProgress: many(zoneProgress),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  character: one(characters, {
    fields: [items.characterId],
    references: [characters.id],
  }),
}));

export const combatLogsRelations = relations(combatLogs, ({ one }) => ({
  character: one(characters, {
    fields: [combatLogs.characterId],
    references: [characters.id],
  }),
}));

export const zoneProgressRelations = relations(zoneProgress, ({ one }) => ({
  character: one(characters, {
    fields: [zoneProgress.characterId],
    references: [characters.id],
  }),
}));

export const gemsRelations = relations(gems, ({ one }) => ({
  character: one(characters, {
    fields: [gems.characterId],
    references: [characters.id],
  }),
}));

export const shadowItemsRelations = relations(shadowItems, ({ one }) => ({
  character: one(characters, {
    fields: [shadowItems.characterId],
    references: [characters.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

export const insertCombatLogSchema = createInsertSchema(combatLogs).omit({
  id: true,
  timestamp: true,
});

export const insertZoneProgressSchema = createInsertSchema(zoneProgress).omit({
  id: true,
  lastVisit: true,
});

export const insertGameConfigSchema = createInsertSchema(gameConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertGemSchema = createInsertSchema(gems).omit({
  id: true,
  createdAt: true,
});

export const insertShadowItemSchema = createInsertSchema(shadowItems).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type CombatLog = typeof combatLogs.$inferSelect;
export type InsertCombatLog = z.infer<typeof insertCombatLogSchema>;
export type ZoneProgress = typeof zoneProgress.$inferSelect;
export type InsertZoneProgress = z.infer<typeof insertZoneProgressSchema>;
export type GameConfig = typeof gameConfig.$inferSelect;
export type InsertGameConfig = z.infer<typeof insertGameConfigSchema>;
export type Gem = typeof gems.$inferSelect;
export type InsertGem = z.infer<typeof insertGemSchema>;
export type ShadowItem = typeof shadowItems.$inferSelect;
export type InsertShadowItem = z.infer<typeof insertShadowItemSchema>;