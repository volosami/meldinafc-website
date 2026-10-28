import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { standingsService } from "../services/standings.service.js";

const updateStandingSchema = z.object({
  matches: z.number().int().nonnegative(),
  wins: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  goalsFor: z.number().int().nonnegative(),
  goalsAgainst: z.number().int().nonnegative(),
  form: z
    .string()
    .trim()
    .toUpperCase()
    .max(5, "Forma deve ter no máximo 5 caracteres")
    .regex(/^[WDL]*$/, "Forma deve conter apenas W, D ou L")
    .optional(),
});

export class StandingsController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const standings = await standingsService.getStandings();
      res.status(200).json({ success: true, data: standings });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = req.params.teamId as string;
      const validated = updateStandingSchema.parse(req.body);
      const updated = await standingsService.updateStanding(teamId, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const standingsController = new StandingsController();
