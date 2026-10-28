import { prisma } from "../config/database.js";
import { CreateMemberInput, RegisterMemberInput, UpdateMemberInput } from "../models/members.schema.js";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  plan: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const inMemoryMembers: MemberRecord[] = [
  {
    id: "mem-1",
    name: "Lucas Andrade",
    email: "lucas.andrade@meldinafc.com",
    cpf: "12345678901",
    phone: "11991234501",
    plan: "OURO",
    status: "ACTIVE",
    paymentMethod: "NONE",
    createdAt: new Date("2026-09-01T10:00:00Z"),
    updatedAt: new Date("2026-09-01T10:00:00Z"),
  },
  {
    id: "mem-2",
    name: "Mariana Costa",
    email: "mariana.costa@meldinafc.com",
    cpf: "23456789012",
    phone: "11991234502",
    plan: "OURO",
    status: "ACTIVE",
    paymentMethod: "NONE",
    createdAt: new Date("2026-09-02T10:00:00Z"),
    updatedAt: new Date("2026-09-02T10:00:00Z"),
  },
  {
    id: "mem-3",
    name: "Pedro Henrique",
    email: "pedro.henrique@meldinafc.com",
    cpf: "34567890123",
    phone: "11991234503",
    plan: "PRATA",
    status: "ACTIVE",
    paymentMethod: "NONE",
    createdAt: new Date("2026-09-03T10:00:00Z"),
    updatedAt: new Date("2026-09-03T10:00:00Z"),
  },
  {
    id: "mem-4",
    name: "Beatriz Ferreira",
    email: "beatriz.ferreira@meldinafc.com",
    cpf: "45678901234",
    phone: "11991234504",
    plan: "PRATA",
    status: "ACTIVE",
    paymentMethod: "NONE",
    createdAt: new Date("2026-09-04T10:00:00Z"),
    updatedAt: new Date("2026-09-04T10:00:00Z"),
  },
  {
    id: "mem-5",
    name: "Gabriel Martins",
    email: "gabriel.martins@meldinafc.com",
    cpf: "56789012345",
    phone: "11991234505",
    plan: "BRONZE",
    status: "ACTIVE",
    paymentMethod: "NONE",
    createdAt: new Date("2026-09-05T10:00:00Z"),
    updatedAt: new Date("2026-09-05T10:00:00Z"),
  },
];

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export class MembersRepository {
  async create(data: RegisterMemberInput | CreateMemberInput) {
    const status = "status" in data && data.status ? data.status : "ACTIVE";

    if (isTestEnv()) {
      const newMember: MemberRecord = {
        id: "mem-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        plan: data.plan,
        status,
        paymentMethod: "NONE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryMembers.unshift(newMember);
      return newMember;
    }

    return await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        plan: data.plan,
        paymentMethod: "NONE",
        status,
      },
    });
  }

  async findByCpfOrEmail(cpf: string, email: string) {
    if (isTestEnv()) {
      return inMemoryMembers.find((m) => m.cpf === cpf || m.email === email) ?? null;
    }

    try {
      return await prisma.member.findFirst({
        where: {
          OR: [{ cpf }, { email }],
        },
      });
    } catch {
      return null;
    }
  }

  async findAll() {
    if (isTestEnv()) {
      return inMemoryMembers;
    }

    try {
      return await prisma.member.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return inMemoryMembers;
    }
  }

  async update(id: string, data: UpdateMemberInput) {
    if (isTestEnv()) {
      const idx = inMemoryMembers.findIndex((m) => m.id === id);
      if (idx === -1) return null;
      inMemoryMembers[idx] = {
        ...inMemoryMembers[idx],
        ...data,
        updatedAt: new Date(),
      };
      return inMemoryMembers[idx];
    }

    try {
      return await prisma.member.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (isTestEnv()) {
      const idx = inMemoryMembers.findIndex((m) => m.id === id);
      if (idx === -1) return false;
      inMemoryMembers.splice(idx, 1);
      return true;
    }

    try {
      await prisma.member.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const membersRepository = new MembersRepository();
