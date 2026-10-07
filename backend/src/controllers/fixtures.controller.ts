import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fixturesService } from "../services/fixtures.service.js";

const updateScoreSchema = z.object({
  homeScore: z.number().int().nonnegative("Placar não pode ser negativo"),
  awayScore: z.number().int().nonnegative("Placar não pode ser negativo"),
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

  async getNextMatch(_req: Request, res: Response, next: NextFunction) {
    try {
      const nextMatch = await fixturesService.getNextMatch();
      res.status(200).json({ success: true, data: nextMatch });
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
}

export const fixturesController = new FixturesController();
