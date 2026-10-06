import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    club: "Meldina FC",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
