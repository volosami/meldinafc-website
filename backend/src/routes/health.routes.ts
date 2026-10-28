import { Router, Request, Response } from "express";
import { getDatabaseStatus } from "../config/database.js";
import { storageService } from "../services/storage.service.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    club: "Meldina FC",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: getDatabaseStatus(),
    storage: storageService.getStorageStatus(),
  });
});
