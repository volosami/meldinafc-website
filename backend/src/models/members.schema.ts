import { z } from "zod";

export const registerMemberSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .min(11, "CPF deve ter no mínimo 11 dígitos")
    .transform((v) => v.replace(/\D/g, "")),
  phone: z.string().min(8, "Telefone é obrigatório"),
  plan: z.enum(["BRONZE", "PRATA", "OURO"], {
    errorMap: () => ({ message: "Selecione um plano válido (BRONZE, PRATA ou OURO)" }),
  }),
  paymentMethod: z.string().default("PIX"),
});

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;
