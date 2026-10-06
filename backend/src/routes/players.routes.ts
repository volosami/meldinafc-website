import { Router } from "express";
import { playersController } from "../controllers/players.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const playersRouter = Router();

// Pública
playersRouter.get("/", (req, res, next) => playersController.list(req, res, next));
playersRouter.get("/:id", (req, res, next) => playersController.getById(req, res, next));

// Admin
playersRouter.patch("/:id/stats", authMiddleware, (req, res, next) =>
  playersController.updateStats(req, res, next)
);
