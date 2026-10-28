import { prisma } from "../config/database.js";
import { FALLBACK_FIXTURES, FALLBACK_TEAMS } from "../data/fallbackData.js";
import { standingsRepository } from "./standings.repository.js";

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export class FixturesRepository {
  async findAll() {
    if (isTestEnv()) {
      return [...FALLBACK_FIXTURES].sort(
        (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
      );
    }
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

  async findAllTeams() {
    if (isTestEnv()) {
      return FALLBACK_TEAMS;
    }
    try {
      const teams = await prisma.team.findMany({
        orderBy: { name: "asc" },
      });
      return teams.length > 0 ? teams : FALLBACK_TEAMS;
    } catch {
      return FALLBACK_TEAMS;
    }
  }

  async findNextMatch() {
    if (isTestEnv()) {
      return (
        FALLBACK_FIXTURES.find((f) => f.isNext) ??
        FALLBACK_FIXTURES.find((f) => f.homeScore === null) ??
        FALLBACK_FIXTURES[8]
      );
    }
    try {
      const markedNext = await prisma.fixture.findFirst({
        where: { isNext: true },
        include: { opponent: true },
      });
      if (markedNext) return markedNext;

      const upcomingUnplayed = await prisma.fixture.findFirst({
        where: { homeScore: null },
        include: { opponent: true },
        orderBy: { matchDate: "asc" },
      });
      if (upcomingUnplayed) return upcomingUnplayed;

      return (
        FALLBACK_FIXTURES.find((f) => f.isNext) ??
        FALLBACK_FIXTURES.find((f) => f.homeScore === null) ??
        FALLBACK_FIXTURES[8]
      );
    } catch {
      return (
        FALLBACK_FIXTURES.find((f) => f.isNext) ??
        FALLBACK_FIXTURES.find((f) => f.homeScore === null) ??
        FALLBACK_FIXTURES[8]
      );
    }
  }

  async create(data: any) {
    const matchDate = new Date(data.matchDate);
    const isNext = Boolean(data.isNext);
    const homeScore =
      data.homeScore === undefined || data.homeScore === null ? null : Number(data.homeScore);
    const awayScore =
      data.awayScore === undefined || data.awayScore === null ? null : Number(data.awayScore);

    if (isTestEnv()) {
      if (isNext) {
        for (const fx of FALLBACK_FIXTURES) {
          fx.isNext = false;
        }
      }
      const opponent =
        FALLBACK_TEAMS.find((t) => t.id === data.opponentId) ?? {
          id: data.opponentId,
          name: data.opponentId,
          shortName: data.opponentId,
          acronym: data.opponentId.slice(0, 3).toUpperCase(),
        };
      const newFx: any = {
        id: data.id || `fx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        matchDate,
        competition: data.competition ?? "Pro Clubs · Série A",
        round: data.round,
        isHome: data.isHome ?? true,
        opponentId: data.opponentId,
        opponent,
        homeScore,
        awayScore,
        venue: data.venue ?? ((data.isHome ?? true) ? "Lovebomb Arena" : null),
        newsId: data.newsId ?? null,
        isNext,
      };
      FALLBACK_FIXTURES.push(newFx);
      await standingsRepository.syncFromFixtureChange(null, newFx, FALLBACK_FIXTURES);
      return newFx;
    }

    if (isNext) {
      await prisma.fixture.updateMany({
        where: { isNext: true },
        data: { isNext: false },
      });
    }

    const created = await prisma.fixture.create({
      data: {
        ...(data.id ? { id: data.id } : {}),
        matchDate,
        competition: data.competition ?? "Pro Clubs · Série A",
        round: data.round,
        isHome: data.isHome ?? true,
        opponentId: data.opponentId,
        homeScore,
        awayScore,
        venue: data.venue ?? ((data.isHome ?? true) ? "Lovebomb Arena" : null),
        newsId: data.newsId ?? null,
        isNext,
      },
      include: { opponent: true },
    });

    const allFixtures = await prisma.fixture.findMany();
    await standingsRepository.syncFromFixtureChange(null, created, allFixtures);
    return created;
  }

  async update(id: string, data: any) {
    if (isTestEnv()) {
      const idx = FALLBACK_FIXTURES.findIndex((fx) => fx.id === id);
      if (idx === -1) return null;
      const oldFixture = { ...FALLBACK_FIXTURES[idx] };

      if (data.isNext === true) {
        for (const fx of FALLBACK_FIXTURES) {
          fx.isNext = false;
        }
      }

      const nextOpponentId = data.opponentId ?? oldFixture.opponentId;
      const opponent =
        FALLBACK_TEAMS.find((t) => t.id === nextOpponentId) ?? oldFixture.opponent;

      const updated: any = {
        ...oldFixture,
        ...(data.matchDate !== undefined ? { matchDate: new Date(data.matchDate) } : {}),
        ...(data.competition !== undefined ? { competition: data.competition } : {}),
        ...(data.round !== undefined ? { round: data.round } : {}),
        ...(data.isHome !== undefined ? { isHome: data.isHome } : {}),
        ...(data.opponentId !== undefined ? { opponentId: data.opponentId, opponent } : {}),
        ...(data.homeScore !== undefined ? { homeScore: data.homeScore } : {}),
        ...(data.awayScore !== undefined ? { awayScore: data.awayScore } : {}),
        ...(data.venue !== undefined ? { venue: data.venue } : {}),
        ...(data.newsId !== undefined ? { newsId: data.newsId } : {}),
        ...(data.isNext !== undefined ? { isNext: data.isNext } : {}),
      };

      FALLBACK_FIXTURES[idx] = updated;
      await standingsRepository.syncFromFixtureChange(oldFixture, updated, FALLBACK_FIXTURES);
      return updated;
    }

    const oldFixture = await prisma.fixture.findUnique({ where: { id } });
    if (!oldFixture) return null;

    if (data.isNext === true) {
      await prisma.fixture.updateMany({
        where: { isNext: true, id: { not: id } },
        data: { isNext: false },
      });
    }

    const updatePayload: any = {};
    if (data.matchDate !== undefined) updatePayload.matchDate = new Date(data.matchDate);
    if (data.competition !== undefined) updatePayload.competition = data.competition;
    if (data.round !== undefined) updatePayload.round = data.round;
    if (data.isHome !== undefined) updatePayload.isHome = data.isHome;
    if (data.opponentId !== undefined) updatePayload.opponentId = data.opponentId;
    if (data.homeScore !== undefined) updatePayload.homeScore = data.homeScore;
    if (data.awayScore !== undefined) updatePayload.awayScore = data.awayScore;
    if (data.venue !== undefined) updatePayload.venue = data.venue;
    if (data.newsId !== undefined) updatePayload.newsId = data.newsId;
    if (data.isNext !== undefined) updatePayload.isNext = data.isNext;

    const updated = await prisma.fixture.update({
      where: { id },
      data: updatePayload,
      include: { opponent: true },
    });

    const allFixtures = await prisma.fixture.findMany();
    await standingsRepository.syncFromFixtureChange(oldFixture, updated, allFixtures);
    return updated;
  }

  async updateScore(id: string, homeScore: number, awayScore: number) {
    if (isTestEnv()) {
      const idx = FALLBACK_FIXTURES.findIndex((fx) => fx.id === id);
      if (idx === -1) return null;
      const oldFixture = { ...FALLBACK_FIXTURES[idx] };
      FALLBACK_FIXTURES[idx] = {
        ...FALLBACK_FIXTURES[idx],
        homeScore,
        awayScore,
        isNext: false,
      } as any;
      // Promove a próxima partida sem placar para isNext = true
      const anyNext = FALLBACK_FIXTURES.some((fx) => fx.isNext);
      if (!anyNext) {
        const nextUnplayedIdx = FALLBACK_FIXTURES.findIndex(
          (fx, i) => i !== idx && fx.homeScore === null
        );
        if (nextUnplayedIdx !== -1) {
          FALLBACK_FIXTURES[nextUnplayedIdx] = {
            ...FALLBACK_FIXTURES[nextUnplayedIdx],
            isNext: true,
          };
        }
      }
      await standingsRepository.syncFromFixtureChange(
        oldFixture,
        FALLBACK_FIXTURES[idx],
        FALLBACK_FIXTURES
      );
      return FALLBACK_FIXTURES[idx];
    }

    const oldFixture = await prisma.fixture.findUnique({ where: { id } });
    if (!oldFixture) return null;

    const updated = await prisma.fixture.update({
      where: { id },
      data: { homeScore, awayScore, isNext: false },
      include: { opponent: true },
    });

    // Promove automaticamente a próxima partida ainda não disputada para isNext: true
    const anyNext = await prisma.fixture.findFirst({ where: { isNext: true } });
    if (!anyNext) {
      const nextFixture = await prisma.fixture.findFirst({
        where: { homeScore: null },
        orderBy: { matchDate: "asc" },
      });
      if (nextFixture) {
        await prisma.fixture.update({
          where: { id: nextFixture.id },
          data: { isNext: true },
        });
      }
    }

    const allFixtures = await prisma.fixture.findMany();
    await standingsRepository.syncFromFixtureChange(oldFixture, updated, allFixtures);

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (isTestEnv()) {
      const idx = FALLBACK_FIXTURES.findIndex((fx) => fx.id === id);
      if (idx === -1) return false;
      const [removed] = FALLBACK_FIXTURES.splice(idx, 1);
      await standingsRepository.syncFromFixtureChange(removed, null, FALLBACK_FIXTURES);
      return true;
    }

    const existing = await prisma.fixture.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.fixture.delete({ where: { id } });
    const allFixtures = await prisma.fixture.findMany();
    await standingsRepository.syncFromFixtureChange(existing, null, allFixtures);
    return true;
  }
}

export const fixturesRepository = new FixturesRepository();
