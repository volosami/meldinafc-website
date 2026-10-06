import { prisma } from "../config/database.js";
import { FALLBACK_PLAYERS } from "../data/fallbackData.js";

export class PlayersRepository {
  async findAll() {
    try {
      const players = await prisma.player.findMany({
        orderBy: { number: "asc" },
      });
      return players.length > 0 ? players : FALLBACK_PLAYERS;
    } catch {
      return FALLBACK_PLAYERS;
    }
  }

  async findById(id: string) {
    try {
      const player = await prisma.player.findUnique({ where: { id } });
      if (player) return player;
      return FALLBACK_PLAYERS.find((p) => p.id === id) ?? null;
    } catch {
      return FALLBACK_PLAYERS.find((p) => p.id === id) ?? null;
    }
  }

  async updateStats(id: string, stats: { matches?: number; goals?: number; assists?: number }) {
    try {
      return await prisma.player.update({
        where: { id },
        data: stats,
      });
    } catch {
      const p = FALLBACK_PLAYERS.find((pl) => pl.id === id);
      if (!p) return null;
      return { ...p, ...stats };
    }
  }
}

export const playersRepository = new PlayersRepository();
