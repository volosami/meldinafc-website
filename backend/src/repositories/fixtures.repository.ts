import { prisma } from "../config/database.js";
import { FALLBACK_FIXTURES } from "../data/fallbackData.js";

export class FixturesRepository {
  async findAll() {
    try {
      const fixtures = await prisma.fixture.findMany({
        include: { opponent: true },
        orderBy: { matchDate: "asc" },
      });
      return fixtures.length > 0 ? fixtures : FALLBACK_FIXTURES;
    } catch {
      return FALLBACK_FIXTURES;
    }
  }

  async findNextMatch() {
    try {
      const nextMatch = await prisma.fixture.findFirst({
        where: { isNext: true },
        include: { opponent: true },
      });
      if (nextMatch) return nextMatch;
      return FALLBACK_FIXTURES.find((f) => f.isNext) ?? FALLBACK_FIXTURES[8];
    } catch {
      return FALLBACK_FIXTURES.find((f) => f.isNext) ?? FALLBACK_FIXTURES[8];
    }
  }

  async updateScore(id: string, homeScore: number, awayScore: number) {
    try {
      return await prisma.fixture.update({
        where: { id },
        data: { homeScore, awayScore, isNext: false },
        include: { opponent: true },
      });
    } catch {
      const f = FALLBACK_FIXTURES.find((fx) => fx.id === id);
      if (!f) return null;
      return { ...f, homeScore, awayScore, isNext: false };
    }
  }
}

export const fixturesRepository = new FixturesRepository();
