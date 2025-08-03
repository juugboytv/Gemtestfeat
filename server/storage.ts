import { type User, type InsertUser, type Character, type InsertCharacter, type Item, type InsertItem } from "@shared/schema";
import { drizzle } from 'drizzle-orm/postgres-js';
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
  
  // Item management
  getItem(id: number): Promise<Item | undefined>;
  getItemsByCharacterId(characterId: number): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, updates: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private items: Map<number, Item>;
  private nextUserId: number = 1;
  private nextCharacterId: number = 1;
  private nextItemId: number = 1;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.items = new Map();
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
      ...insertUser,
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
      ...insertCharacter,
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

  // Item methods
  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getItemsByCharacterId(characterId: number): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.characterId === characterId,
    );
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.nextItemId++;
    const item: Item = {
      id,
      ...insertItem,
      createdAt: new Date(),
    };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: number, updates: Partial<Item>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem: Item = { ...item, ...updates };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id);
  }
}

export const storage = new MemStorage();
