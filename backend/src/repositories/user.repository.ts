import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

// Hash bcrypt real gerado apenas para a suíte de testes automatizados (NODE_ENV === "test")
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "TestAdmin@2026!";
const inMemoryTestUsers: UserRecord[] = [
  {
    id: "admin-test-id",
    email: "admin@meldinafc.com",
    name: "Diretoria Meldina",
    passwordHash: bcrypt.hashSync(TEST_ADMIN_PASSWORD, 10),
    role: "ADMIN",
  },
];

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    if (isTestEnv()) {
      return inMemoryTestUsers.find((u) => u.email === email) ?? null;
    }
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserRecord | null> {
    if (isTestEnv()) {
      return inMemoryTestUsers.find((u) => u.id === id) ?? null;
    }
    return await prisma.user.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: string;
  }): Promise<UserRecord> {
    if (isTestEnv()) {
      const newUser: UserRecord = {
        id: "usr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || "ADMIN",
      };
      inMemoryTestUsers.push(newUser);
      return newUser;
    }

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || "ADMIN",
      },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserRecord> {
    if (isTestEnv()) {
      const user = inMemoryTestUsers.find((u) => u.id === id);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      user.passwordHash = passwordHash;
      return user;
    }

    return await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}

export const userRepository = new UserRepository();
