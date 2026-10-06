import { playersRepository } from "../repositories/players.repository.js";

export class PlayersService {
  async getAllPlayers() {
    return await playersRepository.findAll();
  }

  async getPlayerById(id: string) {
    const player = await playersRepository.findById(id);
    if (!player) {
      throw new Error("Jogador não encontrado");
    }
    return player;
  }

  async updatePlayerStats(id: string, stats: { matches?: number; goals?: number; assists?: number }) {
    const player = await playersRepository.updateStats(id, stats);
    if (!player) {
      throw new Error("Jogador não encontrado");
    }
    return player;
  }
}

export const playersService = new PlayersService();
