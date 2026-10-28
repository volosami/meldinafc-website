import express from "express";
import cors from "cors";
import path from "path";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { securityHeaders } from "./middlewares/securityHeaders.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const rawCorsOrigin = process.env.CORS_ORIGIN;
const corsOrigin = rawCorsOrigin
  ? rawCorsOrigin.includes(",")
    ? rawCorsOrigin.split(",").map((s) => s.trim())
    : rawCorsOrigin.trim()
  : process.env.NODE_ENV === "production"
  ? false
  : "*";

app.use(securityHeaders);

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// Servir arquivos estáticos de uploads locais
app.use("/uploads", express.static(path.resolve(process.cwd(), "public", "uploads")));

// Middleware de log HTTP enxuto em 1 linha: [HH:MM:ss] METHOD /url STATUS - Xms
app.use((req, res, next) => {
  if (req.url === "/api/health") return next();
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const time = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    logger.info(`[${time}] ${method} ${url} ${status} - ${duration}ms`);
  });
  next();
});

// Rotas Base da API com limite geral de requisições
app.use("/api", apiLimiter, apiRouter);

// Handler global de erros
app.use(errorHandler);
