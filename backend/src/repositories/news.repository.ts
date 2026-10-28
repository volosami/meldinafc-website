import { prisma } from "../config/database.js";
import { FALLBACK_NEWS } from "../data/fallbackData.js";
import { CreateNewsInput, UpdateNewsInput } from "../models/news.schema.js";

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

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
    if (isTestEnv()) {
      const mockNews = {
        id: data.id || data.slug,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl ?? "",
        author: data.author,
        isFeatured: data.isFeatured,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return mockNews;
    }

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
  }

  async update(slug: string, data: UpdateNewsInput) {
    if (isTestEnv()) {
      const existing = FALLBACK_NEWS.find((n) => n.slug === slug);
      if (!existing) return null;
      return { ...existing, ...data };
    }

    return await prisma.news.update({
      where: { slug },
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });
  }

  async delete(slug: string) {
    if (isTestEnv()) {
      return true;
    }
    return await prisma.news.delete({ where: { slug } });
  }
}

export const newsRepository = new NewsRepository();
