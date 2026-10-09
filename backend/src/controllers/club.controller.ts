import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { clubService } from "../services/club.service.js";

const updateClubSchema = z.object({
  stadium: z.string().optional(),
  season: z.number().int().optional(),
  foundationYear: z.number().int().optional(),
  coach: z.string().optional(),
  president: z.string().optional(),
  league: z.string().optional(),
  division: z.string().optional(),
  programName: z.string().optional(),
  motto: z.string().optional(),
});

export class ClubController {
  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      const info = await clubService.getClubInfo();
      res.status(200).json({ success: true, data: info });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateClubSchema.parse(req.body);
      const updated = await clubService.updateClubInfo(validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const clubController = new ClubController();
