import { prisma } from "../config/database.js";
import { FALLBACK_STANDINGS } from "../data/fallbackData.js";

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

function isPlayedSerieA(fx: any): boolean {
  return Boolean(
    fx &&
      typeof fx.competition === "string" &&
      fx.competition.includes("Série A") &&
      fx.homeScore !== null &&
      fx.homeScore !== undefined &&
      fx.awayScore !== null &&
      fx.awayScore !== undefined
  );
}

function getOpponentStatsFromFixture(fx: any) {
  const goalsFor = fx.isHome ? Number(fx.awayScore) : Number(fx.homeScore);
  const goalsAgainst = fx.isHome ? Number(fx.homeScore) : Number(fx.awayScore);
  const wins = goalsFor > goalsAgainst ? 1 : 0;
  const draws = goalsFor === goalsAgainst ? 1 : 0;
  const losses = goalsFor < goalsAgainst ? 1 : 0;
  const resultChar = wins ? "W" : draws ? "D" : "L";
  return { goalsFor, goalsAgainst, wins, draws, losses, resultChar };
}

export class StandingsRepository {
  async findAll() {
    if (isTestEnv()) {
      return FALLBACK_STANDINGS;
    }
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

  async updateByTeamId(
    teamId: string,
    data: {
      matches: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      form?: string;
    }
  ) {
    if (isTestEnv()) {
      const idx = FALLBACK_STANDINGS.findIndex((s) => s.teamId === teamId);
      if (idx === -1) return null;
      FALLBACK_STANDINGS[idx] = {
        ...FALLBACK_STANDINGS[idx],
        matches: data.matches,
        wins: data.wins,
        draws: data.draws,
        losses: data.losses,
        goalsFor: data.goalsFor,
        goalsAgainst: data.goalsAgainst,
        form: data.form !== undefined ? data.form : FALLBACK_STANDINGS[idx].form,
      };
      return FALLBACK_STANDINGS[idx];
    }

    try {
      return await prisma.standing.update({
        where: { teamId },
        data: {
          matches: data.matches,
          wins: data.wins,
          draws: data.draws,
          losses: data.losses,
          goalsFor: data.goalsFor,
          goalsAgainst: data.goalsAgainst,
          ...(data.form !== undefined ? { form: data.form } : {}),
        },
        include: { team: true },
      });
    } catch {
      return null;
    }
  }

  async syncFromFixtureChange(oldFixture: any | null, newFixture: any | null, allFixtures: any[]) {
    const oldWasSerieA = isPlayedSerieA(oldFixture);
    const newIsSerieA = isPlayedSerieA(newFixture);

    if (!oldWasSerieA && !newIsSerieA) {
      return;
    }

    // 1. Recalcula Meldina FC (mfc) a partir de todos os jogos disputados da Série A
    const playedSerieA = allFixtures
      .filter((fx) => isPlayedSerieA(fx))
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

    let mfcMatches = 0;
    let mfcWins = 0;
    let mfcDraws = 0;
    let mfcLosses = 0;
    let mfcGF = 0;
    let mfcGA = 0;
    const mfcResults: string[] = [];

    for (const fx of playedSerieA) {
      const gf = fx.isHome ? Number(fx.homeScore) : Number(fx.awayScore);
      const ga = fx.isHome ? Number(fx.awayScore) : Number(fx.homeScore);
      mfcMatches += 1;
      mfcGF += gf;
      mfcGA += ga;
      if (gf > ga) {
        mfcWins += 1;
        mfcResults.push("W");
      } else if (gf === ga) {
        mfcDraws += 1;
        mfcResults.push("D");
      } else {
        mfcLosses += 1;
        mfcResults.push("L");
      }
    }

    const mfcForm = mfcResults.slice(-5).join("");

    await this.updateByTeamId("mfc", {
      matches: mfcMatches,
      wins: mfcWins,
      draws: mfcDraws,
      losses: mfcLosses,
      goalsFor: mfcGF,
      goalsAgainst: mfcGA,
      form: mfcForm,
    });

    // 2. Ajusta o(s) adversário(s) pelo delta
    const applyOpponentDelta = async (
      teamId: string,
      delta: {
        matches: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
      },
      newResultChar?: string,
      replaceLastFormChar?: boolean
    ) => {
      if (!teamId || teamId === "mfc") return;

      if (isTestEnv()) {
        const idx = FALLBACK_STANDINGS.findIndex((s) => s.teamId === teamId);
        if (idx === -1) return;
        const curr = FALLBACK_STANDINGS[idx];
        let nextForm = curr.form || "";
        if (newResultChar) {
          nextForm = replaceLastFormChar
            ? (nextForm.slice(0, -1) + newResultChar).slice(-5)
            : (nextForm + newResultChar).slice(-5);
        }
        FALLBACK_STANDINGS[idx] = {
          ...curr,
          matches: Math.max(0, curr.matches + delta.matches),
          wins: Math.max(0, curr.wins + delta.wins),
          draws: Math.max(0, curr.draws + delta.draws),
          losses: Math.max(0, curr.losses + delta.losses),
          goalsFor: Math.max(0, curr.goalsFor + delta.goalsFor),
          goalsAgainst: Math.max(0, curr.goalsAgainst + delta.goalsAgainst),
          form: nextForm,
        };
        return;
      }

      try {
        const curr = await prisma.standing.findUnique({ where: { teamId } });
        if (!curr) return;
        let nextForm = curr.form || "";
        if (newResultChar) {
          nextForm = replaceLastFormChar
            ? (nextForm.slice(0, -1) + newResultChar).slice(-5)
            : (nextForm + newResultChar).slice(-5);
        }
        await prisma.standing.update({
          where: { teamId },
          data: {
            matches: Math.max(0, curr.matches + delta.matches),
            wins: Math.max(0, curr.wins + delta.wins),
            draws: Math.max(0, curr.draws + delta.draws),
            losses: Math.max(0, curr.losses + delta.losses),
            goalsFor: Math.max(0, curr.goalsFor + delta.goalsFor),
            goalsAgainst: Math.max(0, curr.goalsAgainst + delta.goalsAgainst),
            form: nextForm,
          },
        });
      } catch {
        // Ignora caso o oponente não esteja na tabela da Série A
      }
    };

    if (oldWasSerieA && newIsSerieA && oldFixture.opponentId === newFixture.opponentId) {
      const oldStats = getOpponentStatsFromFixture(oldFixture);
      const newStats = getOpponentStatsFromFixture(newFixture);
      await applyOpponentDelta(
        newFixture.opponentId,
        {
          matches: 0,
          wins: newStats.wins - oldStats.wins,
          draws: newStats.draws - oldStats.draws,
          losses: newStats.losses - oldStats.losses,
          goalsFor: newStats.goalsFor - oldStats.goalsFor,
          goalsAgainst: newStats.goalsAgainst - oldStats.goalsAgainst,
        },
        newStats.resultChar,
        true
      );
    } else {
      if (oldWasSerieA) {
        const oldStats = getOpponentStatsFromFixture(oldFixture);
        await applyOpponentDelta(oldFixture.opponentId, {
          matches: -1,
          wins: -oldStats.wins,
          draws: -oldStats.draws,
          losses: -oldStats.losses,
          goalsFor: -oldStats.goalsFor,
          goalsAgainst: -oldStats.goalsAgainst,
        });
      }
      if (newIsSerieA) {
        const newStats = getOpponentStatsFromFixture(newFixture);
        await applyOpponentDelta(
          newFixture.opponentId,
          {
            matches: 1,
            wins: newStats.wins,
            draws: newStats.draws,
            losses: newStats.losses,
            goalsFor: newStats.goalsFor,
            goalsAgainst: newStats.goalsAgainst,
          },
          newStats.resultChar,
          false
        );
      }
    }
  }
}

export const standingsRepository = new StandingsRepository();
