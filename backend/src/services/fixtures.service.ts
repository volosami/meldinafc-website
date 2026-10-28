import { fixturesRepository } from "../repositories/fixtures.repository.js";
import { AppError } from "../utils/AppError.js";

export class FixturesService {
  async getAllFixtures() {
    return await fixturesRepository.findAll();
  }

  async getAllTeams() {
    return await fixturesRepository.findAllTeams();
  }

  async getNextMatch() {
    return await fixturesRepository.findNextMatch();
  }

  async createFixture(data: any) {
    return await fixturesRepository.create(data);
  }

  async updateFixture(id: string, data: any) {
    const updated = await fixturesRepository.update(id, data);
    if (!updated) {
      throw new AppError("Partida não encontrada", 404);
    }
    return updated;
  }

  async updateScore(id: string, homeScore: number, awayScore: number) {
    if (homeScore < 0 || awayScore < 0) {
      throw new AppError("Placar não pode ser negativo", 400);
    }
    const updated = await fixturesRepository.updateScore(id, homeScore, awayScore);
    if (!updated) {
      throw new AppError("Partida não encontrada", 404);
    }
    return updated;
  }

  async deleteFixture(id: string) {
    const removed = await fixturesRepository.delete(id);
    if (!removed) {
      throw new AppError("Partida não encontrada", 404);
    }
    return true;
  }
}

export const fixturesService = new FixturesService();
