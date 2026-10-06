import { membersRepository } from "../repositories/members.repository.js";
import { RegisterMemberInput } from "../models/members.schema.js";

export class MembersService {
  async register(data: RegisterMemberInput) {
    const existing = await membersRepository.findByCpfOrEmail(data.cpf, data.email);
    if (existing) {
      throw new Error("Já existe um sócio cadastrado com este CPF ou E-mail");
    }

    const member = await membersRepository.create(data);

    // Gerar payload para Pix Copia e Cola mock do clube
    const pixCode = `00020126580014br.gov.bcb.pix0136meldinafc-${member.id}5204000053039865802BR5910MELDINA FC6009SAO PAULO62070503***6304`;

    return {
      member,
      pix: {
        code: pixCode,
        amount: data.plan === "OURO" ? 49.9 : data.plan === "PRATA" ? 29.9 : 14.9,
      },
    };
  }

  async getAllMembers() {
    return await membersRepository.findAll();
  }
}

export const membersService = new MembersService();
