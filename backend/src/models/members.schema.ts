import { z } from "zod";

const cpfSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length >= 11, { message: "CPF deve ter no mínimo 11 dígitos" });

export const registerMemberSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: cpfSchema,
  phone: z.string().min(8, "Telefone é obrigatório"),
  plan: z.enum(["BRONZE", "PRATA", "OURO"], {
    errorMap: () => ({ message: "Selecione um plano válido (BRONZE, PRATA ou OURO)" }),
  }),
  paymentMethod: z.string().default("NONE"),
});

export const createMemberSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: cpfSchema,
  phone: z.string().min(8, "Telefone é obrigatório"),
  plan: z.enum(["BRONZE", "PRATA", "OURO"], {
    errorMap: () => ({ message: "Selecione um plano válido (BRONZE, PRATA ou OURO)" }),
  }),
  status: z.enum(["ACTIVE", "PENDING", "CANCELLED"]).default("ACTIVE"),
});

export const updateMemberSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório").optional(),
  email: z.string().email("E-mail inválido").optional(),
  cpf: cpfSchema.optional(),
  phone: z.string().min(8, "Telefone é obrigatório").optional(),
  plan: z
    .enum(["BRONZE", "PRATA", "OURO"], {
      errorMap: () => ({ message: "Selecione um plano válido (BRONZE, PRATA ou OURO)" }),
    })
    .optional(),
  status: z.enum(["ACTIVE", "PENDING", "CANCELLED"]).optional(),
});

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
