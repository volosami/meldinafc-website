import { z } from "zod";

export function normalizeAssetUrl(url: string): string {
  const trimmed = url.trim();
  if (
    trimmed.length > 0 &&
    !trimmed.startsWith("/") &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    (trimmed.startsWith("assets/") || trimmed.startsWith("uploads/"))
  ) {
    return "/" + trimmed;
  }
  return trimmed;
}

export const createNewsSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  summary: z.string().min(5, "Resumo deve ter pelo menos 5 caracteres"),
  content: z.string().min(5, "Conteúdo deve ter pelo menos 5 caracteres"),
  category: z.string().default("geral"),
  imageUrl: z
    .string()
    .transform((v) => normalizeAssetUrl(v))
    .optional(),
  author: z.string().default("Redação Meldina"),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
