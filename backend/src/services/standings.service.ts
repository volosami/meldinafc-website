import { standingsRepository } from "../repositories/standings.repository.js";
import { AppError } from "../utils/AppError.js";

export class StandingsService {
  async getStandings() {
    const list = await standingsRepository.findAll();

    const enriched = list.map((item) => {
      const points = item.wins * 3 + item.draws;
      const goalDiff = item.goalsFor - item.goalsAgainst;
      return {
        ...item,
        points,
        goalDiff,
      };
    });

    // Ordenação oficial: 1º Pontos, 2º Vitórias, 3º Saldo de Gols, 4º Gols Pró
    enriched.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });

    return enriched.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }

  async updateStanding(
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
    const updated = await standingsRepository.updateByTeamId(teamId, data);
    if (!updated) {
      throw new AppError("Clube não encontrado na classificação", 404);
    }
    const points = updated.wins * 3 + updated.draws;
    const goalDiff = updated.goalsFor - updated.goalsAgainst;
    return {
      ...updated,
      points,
      goalDiff,
    };
  }
}

export const standingsService = new StandingsService();
