import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", (req, res, next) => authController.login(req, res, next));
authRouter.get("/me", authMiddleware, (req, res) => authController.me(req, res));
