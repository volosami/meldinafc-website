import { Router } from "express";
import { newsController } from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const newsRouter = Router();

// Rotas públicas
newsRouter.get("/", (req, res, next) => newsController.list(req, res, next));
newsRouter.get("/:slug", (req, res, next) => newsController.getBySlug(req, res, next));

// Rotas protegidas (Admin)
newsRouter.post("/", authMiddleware, (req, res, next) => newsController.create(req, res, next));
newsRouter.put("/:slug", authMiddleware, (req, res, next) => newsController.update(req, res, next));
newsRouter.delete("/:slug", authMiddleware, (req, res, next) => newsController.remove(req, res, next));
