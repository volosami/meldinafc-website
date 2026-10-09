import { Router } from "express";
import { standingsController } from "../controllers/standings.controller.js";

export const standingsRouter = Router();

standingsRouter.get("/", (req, res, next) => standingsController.list(req, res, next));
