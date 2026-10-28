import { Request, Response, NextFunction } from "express";
import { changePasswordSchema, loginSchema, registerSchema } from "../models/auth.schema.js";
import { authService } from "../services/auth.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.register(validated);
      res.status(201).json({
        success: true,
        message: "Administrador registrado com sucesso!",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = changePasswordSchema.parse(req.body);
      const userId = req.user?.id || "";
      const result = await authService.changePassword(userId, validated);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
}

export const authController = new AuthController();
