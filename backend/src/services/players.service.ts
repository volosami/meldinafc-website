import { playersRepository } from "../repositories/players.repository.js";
import { AppError } from "../utils/AppError.js";

export class PlayersService {
  async getAllPlayers() {
    return await playersRepository.findAll();
  }

  async getPlayerById(id: string) {
    const player = await playersRepository.findById(id);
    if (!player) {
      throw new AppError("Jogador não encontrado", 404);
    }
    return player;
  }

  async createPlayer(data: any) {
    return await playersRepository.create(data);
  }

  async updatePlayerStats(id: string, stats: { matches?: number; goals?: number; assists?: number }) {
    const player = await playersRepository.updateStats(id, stats);
    if (!player) {
      throw new AppError("Jogador não encontrado", 404);
    }
    return player;
  }

  async updatePlayer(id: string, data: any) {
    const player = await playersRepository.update(id, data);
    if (!player) {
      throw new AppError("Jogador não encontrado", 404);
    }
    return player;
  }

  async deletePlayer(id: string) {
    const removed = await playersRepository.delete(id);
    if (!removed) {
      throw new AppError("Jogador não encontrado", 404);
    }
    return true;
  }
}

export const playersService = new PlayersService();
