import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Token de autenticação não fornecido",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "Sessão inválida ou expirada. Faça login novamente.",
    });
  }
}
