import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
  logger.error({ err }, `[Error Handler] ${errorMessage}`);

  res.status(500).json({
    success: false,
    error: errorMessage,
  });
}
