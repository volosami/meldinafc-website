import { prisma } from "../config/database.js";

const DEFAULT_CLUB_INFO = {
  id: "meldina-main",
  stadium: "Lovebomb Arena",
  season: 2026,
  foundationYear: 2024,
  coach: "Celso Roth",
  president: "André Almeida",
  league: "Pro Clubs",
  division: "Série A",
  programName: "Clube Meldina",
  motto: "Muito além do jogo",
};

export class ClubRepository {
  async get() {
    try {
      const info = await prisma.clubInfo.findUnique({
        where: { id: "meldina-main" },
      });
      if (info) return info;

      // Se não existir, tenta criar
      return await prisma.clubInfo.create({
        data: DEFAULT_CLUB_INFO,
      });
    } catch {
      return DEFAULT_CLUB_INFO;
    }
  }

  async update(data: Partial<typeof DEFAULT_CLUB_INFO>) {
    try {
      return await prisma.clubInfo.upsert({
        where: { id: "meldina-main" },
        update: data,
        create: {
          ...DEFAULT_CLUB_INFO,
          ...data,
        },
      });
    } catch {
      return { ...DEFAULT_CLUB_INFO, ...data };
    }
  }
}

export const clubRepository = new ClubRepository();
