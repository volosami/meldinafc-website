import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres").trim(),
  email: z.string().email("E-mail inválido").transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  adminKey: z.string().min(1, "A chave de administrador é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
