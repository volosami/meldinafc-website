import { standingsRepository } from "../repositories/standings.repository.js";

export class StandingsService {
  async getStandings() {
    const list = await standingsRepository.findAll();
    // Ordenação garantida por pontos (v * 3 + e), vitórias e saldo
    return list.map((item, index) => {
      const points = item.wins * 3 + item.draws;
      const goalDiff = item.goalsFor - item.goalsAgainst;
      return {
        ...item,
        position: index + 1,
        points,
        goalDiff,
      };
    });
  }
}

export const standingsService = new StandingsService();
