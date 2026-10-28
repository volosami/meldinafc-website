import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { playersService } from "../services/players.service.js";
import { normalizeAssetUrl } from "../models/news.schema.js";

const updateStatsSchema = z.object({
  matches: z.number().int().nonnegative().optional(),
  goals: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
});

export const createPlayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  number: z.number().int(),
  position: z.string().min(1, "Posição é obrigatória"),
  group: z.string().default("Atacantes"),
  photoUrl: z
    .string()
    .default("/assets/img/escudo.png")
    .transform((v) => normalizeAssetUrl(v) || "/assets/img/escudo.png"),
  preferredFoot: z.string().default("Direito"),
  joinedYear: z.number().int().default(2026),
  matches: z.number().int().nonnegative().default(0),
  goals: z.number().int().nonnegative().default(0),
  assists: z.number().int().nonnegative().default(0),
  extraKey: z.string().nullable().optional(),
  extraValue: z.string().nullable().optional(),
  bio: z.string().default(""),
  isCaptain: z.boolean().default(false),
  roleTitle: z.string().nullable().optional(),
});

export const updatePlayerSchema = z.object({
  name: z.string().min(2).optional(),
  number: z.number().int().optional(),
  position: z.string().optional(),
  group: z.string().optional(),
  photoUrl: z
    .string()
    .transform((v) => normalizeAssetUrl(v))
    .optional(),
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createPlayerSchema.parse(req.body);
      const created = await playersService.createPlayer(validated);
      res.status(201).json({ success: true, data: created });
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

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await playersService.deletePlayer(id);
      res.status(200).json({ success: true, message: "Atleta removido com sucesso" });
    } catch (err) {
      next(err);
    }
  }
}

export const playersController = new PlayersController();
