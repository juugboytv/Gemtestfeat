import { type User, type InsertUser, type Character, type InsertCharacter, type Zone, type InsertZone } from "@shared/schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Database connection setup for PostgreSQL
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Character management
  getCharacter(id: number): Promise<Character | undefined>;
  getCharactersByUserId(userId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined>;
  
  // Item management - simplified for now
  // getItem(id: number): Promise<any>;
  // createItem(item: any): Promise<any>;
  
  // Zone management
  getAllZones(): Promise<Zone[]>;
  getZone(id: number): Promise<Zone | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private zones: Map<number, Zone>;
  private nextUserId: number = 1;
  private nextCharacterId: number = 1;
  private nextItemId: number = 1;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.zones = new Map();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { 
      id, 
      username: insertUser.username,
      passwordHash: insertUser.passwordHash,
      email: insertUser.email || null,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharactersByUserId(userId: number): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(
      (character) => character.userId === userId,
    );
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.nextCharacterId++;
    const character: Character = {
      id,
      userId: insertCharacter.userId,
      name: insertCharacter.name,
      race: insertCharacter.race,
      level: insertCharacter.level || 1,
      experience: insertCharacter.experience || 0,
      currentZone: insertCharacter.currentZone || 1,
      health: insertCharacter.health || 100,
      maxHealth: insertCharacter.maxHealth || 100,
      attack: insertCharacter.attack || 10,
      defense: insertCharacter.defense || 10,
      gold: insertCharacter.gold || 100,
      bankGold: insertCharacter.bankGold || 0,
      equippedWeapon: insertCharacter.equippedWeapon || null,
      equippedArmor: insertCharacter.equippedArmor || null,
      equippedShield: insertCharacter.equippedShield || null,
      equippedHelmet: insertCharacter.equippedHelmet || null,
      equippedBoots: insertCharacter.equippedBoots || null,
      equippedGloves: insertCharacter.equippedGloves || null,
      equippedRing: insertCharacter.equippedRing || null,
      equippedAmulet: insertCharacter.equippedAmulet || null,
      combatTarget: insertCharacter.combatTarget || null,
      lastCombatAction: insertCharacter.lastCombatAction || null,
      autoFightEnabled: insertCharacter.autoFightEnabled || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter: Character = {
      ...character,
      ...updates,
      updatedAt: new Date(),
    };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  // Item methods removed for now - focus on zone functionality

  // Zone methods - use database for production
  async getAllZones(): Promise<Zone[]> {
    if (process.env.NODE_ENV === 'development') {
      // In development, fetch from database
      return await db.select().from(schema.zones);
    }
    // Fallback to memory storage (should not be used in production)
    return Array.from(this.zones.values());
  }

  async getZone(id: number): Promise<Zone | undefined> {
    if (process.env.NODE_ENV === 'development') {
      // In development, fetch from database
      const result = await db.select().from(schema.zones).where(eq(schema.zones.zoneId, id)).limit(1);
      return result[0];
    }
    // Fallback to memory storage
    return this.zones.get(id);
  }
}

export const storage = new MemStorage();
