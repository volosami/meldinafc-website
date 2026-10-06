import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../models/auth.schema.js";
import { authService } from "../services/auth.service.js";

export class AuthController {
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

  async me(req: Request, res: Response) {
    const user = (req as any).user;
    res.status(200).json({
      success: true,
      data: user,
    });
  }
}

export const authController = new AuthController();
