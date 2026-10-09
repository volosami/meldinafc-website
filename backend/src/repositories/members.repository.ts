import { prisma } from "../config/database.js";
import { RegisterMemberInput } from "../models/members.schema.js";

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

const inMemoryMembers: MemberRecord[] = [];

export class MembersRepository {
  async create(data: RegisterMemberInput) {
    try {
      return await prisma.member.create({
        data: {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          plan: data.plan,
          paymentMethod: data.paymentMethod,
          status: "PENDING",
        },
      });
    } catch {
      const newMember: MemberRecord = {
        id: "mem-" + Date.now(),
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        plan: data.plan,
        status: "PENDING",
        paymentMethod: data.paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryMembers.unshift(newMember);
      return newMember;
    }
  }

  async findByCpfOrEmail(cpf: string, email: string) {
    try {
      return await prisma.member.findFirst({
        where: {
          OR: [{ cpf }, { email }],
        },
      });
    } catch {
      return (
        inMemoryMembers.find((m) => m.cpf === cpf || m.email === email) ?? null
      );
    }
  }

  async findAll() {
    try {
      return await prisma.member.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return inMemoryMembers;
    }
  }
}

export const membersRepository = new MembersRepository();
