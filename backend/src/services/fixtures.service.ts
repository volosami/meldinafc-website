import { fixturesRepository } from "../repositories/fixtures.repository.js";

export class FixturesService {
  async getAllFixtures() {
    return await fixturesRepository.findAll();
  }

  async getNextMatch() {
    return await fixturesRepository.findNextMatch();
  }

  async updateScore(id: string, homeScore: number, awayScore: number) {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Placar não pode ser negativo");
    }
    const updated = await fixturesRepository.updateScore(id, homeScore, awayScore);
    if (!updated) {
      throw new Error("Partida não encontrada");
    }
    return updated;
  }
}

export const fixturesService = new FixturesService();
