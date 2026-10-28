import { prisma } from "../config/database.js";

const DEFAULT_CLUB_INFO = {
  id: "meldina-main",
  stadium: "Lovebomb Arena",
  season: 2026,
  foundationYear: 2017,
  coach: "Celso Roth",
  president: "André Almeida",
  league: "Pro Clubs",
  division: "Série A",
  programName: "Clube Meldina",
  motto: "Muito além do jogo",
};

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export class ClubRepository {
  async get() {
    try {
      const info = await prisma.clubInfo.findUnique({
        where: { id: "meldina-main" },
      });
      if (info) return info;

      return await prisma.clubInfo.create({
        data: DEFAULT_CLUB_INFO,
      });
    } catch {
      return DEFAULT_CLUB_INFO;
    }
  }

  async update(data: Partial<typeof DEFAULT_CLUB_INFO>) {
    if (isTestEnv()) {
      return { ...DEFAULT_CLUB_INFO, ...data };
    }

    return await prisma.clubInfo.upsert({
      where: { id: "meldina-main" },
      update: data,
      create: {
        ...DEFAULT_CLUB_INFO,
        ...data,
      },
    });
  }
}

export const clubRepository = new ClubRepository();
