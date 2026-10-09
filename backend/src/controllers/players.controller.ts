import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { playersService } from "../services/players.service.js";

const updateStatsSchema = z.object({
  matches: z.number().int().nonnegative().optional(),
  goals: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
});

const updatePlayerSchema = z.object({
  name: z.string().optional(),
  number: z.number().int().optional(),
  position: z.string().optional(),
  group: z.string().optional(),
  photoUrl: z.string().optional(),
  preferredFoot: z.string().optional(),
  joinedYear: z.number().int().optional(),
  matches: z.number().int().nonnegative().optional(),
  goals: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
  extraKey: z.string().nullable().optional(),
  extraValue: z.string().nullable().optional(),
  bio: z.string().optional(),
  isCaptain: z.boolean().optional(),
  roleTitle: z.string().nullable().optional(),
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
      const id = req.params.id as string;
      const player = await playersService.getPlayerById(id);
      res.status(200).json({ success: true, data: player });
    } catch (err) {
      next(err);
    }
  }

  async updateStats(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateStatsSchema.parse(req.body);
      const updated = await playersService.updatePlayerStats(id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updatePlayerSchema.parse(req.body);
      const updated = await playersService.updatePlayer(id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const playersController = new PlayersController();
