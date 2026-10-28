import { Router } from "express";
import { standingsController } from "../controllers/standings.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const standingsRouter = Router();

standingsRouter.get("/", (req, res, next) => standingsController.list(req, res, next));
standingsRouter.put("/:teamId", authMiddleware, (req, res, next) =>
  standingsController.update(req, res, next)
);
