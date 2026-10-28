import { Request, Response, NextFunction } from "express";
import { authService, AuthTokenPayload } from "../services/auth.service.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
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
    if (!payload || !payload.id || payload.role !== "ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso negado: privilégios de administrador exigidos.",
      });
      return;
    }
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "Sessão inválida ou expirada. Faça login novamente.",
    });
  }
}
