import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { playersService } from "../services/players.service.js";

const updateStatsSchema = z.object({
  matches: z.number().int().nonnegative().optional(),
  goals: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
});

export class PlayersController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playersService.getAllPlayers();
      res.status(200).json({ success: true, data: players });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const player = await playersService.getPlayerById(id);
      res.status(200).json({ success: true, data: player });
    } catch (err) {
      next(err);
    }
  }

  async updateStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = updateStatsSchema.parse(req.body);
      const updated = await playersService.updatePlayerStats(id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const playersController = new PlayersController();
