import { Router } from "express";
import { clubController } from "../controllers/club.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const clubRouter = Router();

clubRouter.get("/", (req, res, next) => clubController.get(req, res, next));
clubRouter.put("/", authMiddleware, (req, res, next) => clubController.update(req, res, next));
