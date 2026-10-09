import { Router } from "express";
import { membersController } from "../controllers/members.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const membersRouter = Router();

// Pública (Cadastro de Sócio)
membersRouter.post("/register", (req, res, next) => membersController.register(req, res, next));

// Admin (Visualização da Lista de Sócios)
membersRouter.get("/", authMiddleware, (req, res, next) => membersController.list(req, res, next));
