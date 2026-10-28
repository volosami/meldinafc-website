import { Router } from "express";
import { fixturesController } from "../controllers/fixtures.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const fixturesRouter = Router();

// Públicas
fixturesRouter.get("/", (req, res, next) => fixturesController.list(req, res, next));
fixturesRouter.get("/teams", (req, res, next) => fixturesController.listTeams(req, res, next));
fixturesRouter.get("/next", (req, res, next) => fixturesController.getNextMatch(req, res, next));

// Admin
fixturesRouter.post("/", authMiddleware, (req, res, next) =>
  fixturesController.create(req, res, next)
);
fixturesRouter.put("/:id", authMiddleware, (req, res, next) =>
  fixturesController.update(req, res, next)
);
fixturesRouter.patch("/:id/score", authMiddleware, (req, res, next) =>
  fixturesController.updateScore(req, res, next)
);
fixturesRouter.delete("/:id", authMiddleware, (req, res, next) =>
  fixturesController.remove(req, res, next)
);
