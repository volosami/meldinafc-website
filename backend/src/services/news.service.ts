import { newsRepository } from "../repositories/news.repository.js";
import { CreateNewsInput, UpdateNewsInput } from "../models/news.schema.js";

export class NewsService {
  async getAllNews() {
    return await newsRepository.findAll();
  }

  async getNewsBySlug(slug: string) {
    const news = await newsRepository.findBySlug(slug);
    if (!news) {
      throw new Error("Notícia não encontrada");
    }
    return news;
  }

  async createNews(data: CreateNewsInput) {
    const slug = data.slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return await newsRepository.create({ ...data, slug });
  }

  async updateNews(slug: string, data: UpdateNewsInput) {
    const updated = await newsRepository.update(slug, data);
    if (!updated) {
      throw new Error("Notícia não encontrada para atualização");
    }
    return updated;
  }

  async deleteNews(slug: string) {
    return await newsRepository.delete(slug);
  }
}

export const newsService = new NewsService();
