import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import gameRoutes from "./gameRoutes.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game API routes
  app.use(gameRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
