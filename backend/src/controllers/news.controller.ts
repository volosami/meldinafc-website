import { Request, Response, NextFunction } from "express";
import { createNewsSchema, updateNewsSchema } from "../models/news.schema.js";
import { newsService } from "../services/news.service.js";

export class NewsController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAllNews();
      res.status(200).json({ success: true, data: news });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const news = await newsService.getNewsBySlug(slug);
      res.status(200).json({ success: true, data: news });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createNewsSchema.parse(req.body);
      const created = await newsService.createNews(validated);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const validated = updateNewsSchema.parse(req.body);
      const updated = await newsService.updateNews(slug, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      await newsService.deleteNews(slug);
      res.status(200).json({ success: true, message: "Notícia removida com sucesso" });
    } catch (err) {
      next(err);
    }
  }
}

export const newsController = new NewsController();
