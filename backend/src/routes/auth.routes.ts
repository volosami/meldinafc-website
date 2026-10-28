import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, (req, res, next) => authController.register(req, res, next));
authRouter.post("/login", authLimiter, (req, res, next) => authController.login(req, res, next));
authRouter.patch("/password", authMiddleware, (req, res, next) =>
  authController.changePassword(req, res, next)
);
authRouter.get("/me", authMiddleware, (req, res) => authController.me(req, res));
