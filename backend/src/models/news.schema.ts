import { z } from "zod";

export const createNewsSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  summary: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
  content: z.string().min(20, "Conteúdo deve ter pelo menos 20 caracteres"),
  category: z.string().default("geral"),
  imageUrl: z.string().optional(),
  author: z.string().default("Redação Meldina"),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
