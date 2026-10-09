import { prisma } from "../config/database.js";
import { FALLBACK_STANDINGS } from "../data/fallbackData.js";

export class StandingsRepository {
  async findAll() {
    try {
      const standings = await prisma.standing.findMany({
        include: { team: true },
        orderBy: [{ wins: "desc" }, { goalsFor: "desc" }],
      });
      return standings.length > 0 ? standings : FALLBACK_STANDINGS;
    } catch {
      return FALLBACK_STANDINGS;
    }
  }
}

export const standingsRepository = new StandingsRepository();
