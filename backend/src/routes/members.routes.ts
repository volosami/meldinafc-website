import { Router } from "express";
import { membersController } from "../controllers/members.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { memberRegisterLimiter } from "../middlewares/rateLimiter.js";

export const membersRouter = Router();

// Pública (Cadastro de Sócio com rate-limit contra spam)
membersRouter.post("/register", memberRegisterLimiter, (req, res, next) =>
  membersController.register(req, res, next)
);

// Admin (Gestão Completa de Sócios)
membersRouter.get("/", authMiddleware, (req, res, next) => membersController.list(req, res, next));
membersRouter.post("/", authMiddleware, (req, res, next) =>
  membersController.create(req, res, next)
);
membersRouter.put("/:id", authMiddleware, (req, res, next) =>
  membersController.update(req, res, next)
);
membersRouter.delete("/:id", authMiddleware, (req, res, next) =>
  membersController.remove(req, res, next)
);
