import { Request, Response, NextFunction } from "express";
import { standingsService } from "../services/standings.service.js";

export class StandingsController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const standings = await standingsService.getStandings();
      res.status(200).json({ success: true, data: standings });
    } catch (err) {
      next(err);
    }
  }
}

export const standingsController = new StandingsController();
