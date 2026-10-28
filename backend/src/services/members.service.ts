import { membersRepository } from "../repositories/members.repository.js";
import { CreateMemberInput, RegisterMemberInput, UpdateMemberInput } from "../models/members.schema.js";
import { AppError } from "../utils/AppError.js";

export class MembersService {
  async register(data: RegisterMemberInput) {
    const existing = await membersRepository.findByCpfOrEmail(data.cpf, data.email);
    if (existing) {
      throw new AppError("Já existe um sócio cadastrado com este CPF ou E-mail", 409);
    }

    // Pela regra No-Money (PRODUCT.md), nenhum dado de pagamento/Pix é gerado ou cobrado
    const member = await membersRepository.create(data);

    return {
      member,
    };
  }

  async getAllMembers() {
    return await membersRepository.findAll();
  }

  async createMember(data: CreateMemberInput) {
    const existing = await membersRepository.findByCpfOrEmail(data.cpf, data.email);
    if (existing) {
      throw new AppError("Já existe um sócio cadastrado com este CPF ou E-mail", 409);
    }
    return await membersRepository.create(data);
  }

  async updateMember(id: string, data: UpdateMemberInput) {
    const updated = await membersRepository.update(id, data);
    if (!updated) {
      throw new AppError("Sócio não encontrado", 404);
    }
    return updated;
  }

  async deleteMember(id: string) {
    const removed = await membersRepository.delete(id);
    if (!removed) {
      throw new AppError("Sócio não encontrado", 404);
    }
    return true;
  }
}

export const membersService = new MembersService();
