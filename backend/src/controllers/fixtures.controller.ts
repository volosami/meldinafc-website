import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fixturesService } from "../services/fixtures.service.js";

const updateScoreSchema = z.object({
  homeScore: z.number().int().nonnegative("Placar não pode ser negativo"),
  awayScore: z.number().int().nonnegative("Placar não pode ser negativo"),
});

export const createFixtureSchema = z.object({
  id: z.string().optional(),
  matchDate: z.union([z.string().min(1, "Data da partida é obrigatória"), z.date()]),
  competition: z.string().default("Pro Clubs · Série A"),
  round: z.string().min(1, "Rodada é obrigatória"),
  isHome: z.boolean().default(true),
  opponentId: z.string().min(1, "Adversário é obrigatório"),
  homeScore: z.number().int().nonnegative().nullable().optional(),
  awayScore: z.number().int().nonnegative().nullable().optional(),
  venue: z.string().nullable().optional(),
  newsId: z.string().nullable().optional(),
  isNext: z.boolean().optional().default(false),
});

export const updateFixtureSchema = z.object({
  matchDate: z.union([z.string().min(1), z.date()]).optional(),
  competition: z.string().optional(),
  round: z.string().optional(),
  isHome: z.boolean().optional(),
  opponentId: z.string().optional(),
  homeScore: z.number().int().nonnegative().nullable().optional(),
  awayScore: z.number().int().nonnegative().nullable().optional(),
  venue: z.string().nullable().optional(),
  newsId: z.string().nullable().optional(),
  isNext: z.boolean().optional(),
});

export class FixturesController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const fixtures = await fixturesService.getAllFixtures();
      res.status(200).json({ success: true, data: fixtures });
    } catch (err) {
      next(err);
    }
  }

  async listTeams(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await fixturesService.getAllTeams();
      res.status(200).json({ success: true, data: teams });
    } catch (err) {
      next(err);
    }
  }

  async getNextMatch(_req: Request, res: Response, next: NextFunction) {
    try {
      const nextMatch = await fixturesService.getNextMatch();
      res.status(200).json({ success: true, data: nextMatch });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createFixtureSchema.parse(req.body);
      const created = await fixturesService.createFixture(validated);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateFixtureSchema.parse(req.body);
      const updated = await fixturesService.updateFixture(id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async updateScore(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { homeScore, awayScore } = updateScoreSchema.parse(req.body);
      const updated = await fixturesService.updateScore(id, homeScore, awayScore);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await fixturesService.deleteFixture(id);
      res.status(200).json({ success: true, message: "Partida removida com sucesso" });
    } catch (err) {
      next(err);
    }
  }
}

export const fixturesController = new FixturesController();
