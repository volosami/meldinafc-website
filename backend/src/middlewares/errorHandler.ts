import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Erro de validação nos dados enviados",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Tratamento seguro para códigos de erro conhecidos do Prisma sem vazar estrutura SQL
  const prismaCode = (err as { code?: string })?.code;
  if (prismaCode === "P2002") {
    res.status(409).json({
      success: false,
      error: "Já existe um registro cadastrado com estes dados únicos.",
    });
    return;
  }
  if (prismaCode === "P2025") {
    res.status(404).json({
      success: false,
      error: "Registro não encontrado no banco de dados.",
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
  logger.error({ err }, `[Error Handler] ${errorMessage}`);

  // Nunca vazar mensagens internas de banco/infraestrutura em respostas 500 de produção
  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    success: false,
    error: isProd ? "Erro interno no servidor. Tente novamente mais tarde." : errorMessage,
  });
}
