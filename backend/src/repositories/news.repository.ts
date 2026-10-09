import { prisma } from "../config/database.js";
import { FALLBACK_NEWS } from "../data/fallbackData.js";
import { CreateNewsInput, UpdateNewsInput } from "../models/news.schema.js";

export class NewsRepository {
  async findAll() {
    try {
      const news = await prisma.news.findMany({
        orderBy: { publishedAt: "desc" },
      });
      return news.length > 0 ? news : FALLBACK_NEWS;
    } catch {
      return FALLBACK_NEWS;
    }
  }

  async findBySlug(slug: string) {
    try {
      const news = await prisma.news.findUnique({ where: { slug } });
      if (news) return news;
      return FALLBACK_NEWS.find((n) => n.slug === slug) ?? null;
    } catch {
      return FALLBACK_NEWS.find((n) => n.slug === slug) ?? null;
    }
  }

  async create(data: CreateNewsInput) {
    try {
      return await prisma.news.create({
        data: {
          id: data.id || data.slug,
          slug: data.slug,
          title: data.title,
          summary: data.summary,
          content: data.content,
          category: data.category,
          imageUrl: data.imageUrl,
          author: data.author,
          isFeatured: data.isFeatured,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        },
      });
    } catch {
      // Mock em memória para teste
      const mockNews = {
        id: data.id || data.slug,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl ?? null,
        author: data.author,
        isFeatured: data.isFeatured,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return mockNews;
    }
  }

  async update(slug: string, data: UpdateNewsInput) {
    try {
      return await prisma.news.update({
        where: { slug },
        data: {
          ...data,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        },
      });
    } catch {
      const existing = FALLBACK_NEWS.find((n) => n.slug === slug);
      if (!existing) return null;
      return { ...existing, ...data };
    }
  }

  async delete(slug: string) {
    try {
      return await prisma.news.delete({ where: { slug } });
    } catch {
      return true;
    }
  }
}

export const newsRepository = new NewsRepository();
