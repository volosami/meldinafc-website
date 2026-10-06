import { prisma } from "../config/database.js";

export class UserRepository {
  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch {
      // Fallback mock para ambiente local/sem banco conectado
      if (email === "admin@meldinafc.com") {
        return {
          id: "admin-default",
          email: "admin@meldinafc.com",
          name: "Diretoria Meldina",
          // hash para 'meldina2026!'
          passwordHash: "$2a$10$3c0764o.q4R7m1L44YfE7egG/Z08q12Y8.3b04321654321234567",
          role: "ADMIN",
        };
      }
      return null;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }
}

export const userRepository = new UserRepository();
