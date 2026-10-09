import { Router } from "express";
import { fixturesController } from "../controllers/fixtures.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const fixturesRouter = Router();

// Públicas
fixturesRouter.get("/", (req, res, next) => fixturesController.list(req, res, next));
fixturesRouter.get("/next", (req, res, next) => fixturesController.getNextMatch(req, res, next));

// Admin
fixturesRouter.patch("/:id/score", authMiddleware, (req, res, next) =>
  fixturesController.updateScore(req, res, next)
);
