import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

export type DatabaseProvider = "supabase" | "local-postgres" | "in-memory-fallback";

export interface DatabaseStatus {
  connected: boolean;
  provider: DatabaseProvider;
  host: string;
  fallbackUsed: boolean;
  lastError: string | null;
}

export function extractDbHost(url?: string): string {
  if (!url) return "unconfigured";
  try {
    const parsed = new URL(url);
    return parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
  } catch {
    return "invalid-url";
  }
}

export function detectProviderFromUrl(url?: string): "supabase" | "local-postgres" {
  const host = extractDbHost(url).toLowerCase();
  if (host.includes("supabase.co") || host.includes("supabase.com")) {
    return "supabase";
  }
  return "local-postgres";
}

function summarizePrismaError(err: unknown): string {
  if (err instanceof Error) {
    const lines = err.message
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return lines[lines.length - 1] || err.message;
  }
  return String(err);
}

const logConfig: ("query" | "error" | "warn")[] =
  process.env.DEBUG_PRISMA === "true" ? ["query", "error", "warn"] : ["error", "warn"];

function createClientForUrl(url?: string): PrismaClient {
  if (url) {
    return new PrismaClient({
      datasources: { db: { url } },
      log: logConfig,
    });
  }
  return new PrismaClient({ log: logConfig });
}

const globalForPrisma = globalThis as unknown as {
  activePrisma: PrismaClient | undefined;
  dbStatus: DatabaseStatus | undefined;
};

let activePrismaClient: PrismaClient =
  globalForPrisma.activePrisma ?? createClientForUrl(process.env.DATABASE_URL);

const initialFallbackReason = process.env.SUPABASE_FALLBACK_REASON || null;

let currentStatus: DatabaseStatus = globalForPrisma.dbStatus ?? {
  connected: false,
  provider: detectProviderFromUrl(process.env.DATABASE_URL),
  host: extractDbHost(process.env.DATABASE_URL),
  fallbackUsed: Boolean(initialFallbackReason),
  lastError: initialFallbackReason,
};

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.activePrisma = activePrismaClient;
  globalForPrisma.dbStatus = currentStatus;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(activePrismaClient as object, prop, receiver);
    return typeof value === "function" ? value.bind(activePrismaClient) : value;
  },
});

export function getDatabaseStatus(): DatabaseStatus {
  return { ...currentStatus };
}

export async function checkDatabaseConnection(): Promise<boolean> {
  const primaryUrl = process.env.DATABASE_URL;
  const localFallbackUrl = process.env.LOCAL_DATABASE_URL;
  const primaryProvider = detectProviderFromUrl(primaryUrl);
  const primaryHost = extractDbHost(primaryUrl);
  const entrypointFallbackReason = process.env.SUPABASE_FALLBACK_REASON || null;

  if (entrypointFallbackReason) {
    logger.warn(
      `⚠️ [Database] Falha prévia no Supabase detectada no boot (${entrypointFallbackReason}). Operando via banco PostgreSQL local.`
    );
  }

  try {
    await activePrismaClient.$queryRaw`SELECT 1`;
    currentStatus = {
      connected: true,
      provider: primaryProvider,
      host: primaryHost,
      fallbackUsed: Boolean(entrypointFallbackReason),
      lastError: entrypointFallbackReason,
    };

    if (primaryProvider === "supabase") {
      logger.info(`✅ [Database] Conectado com sucesso ao SUPABASE PostgreSQL (${primaryHost})`);
    } else if (entrypointFallbackReason) {
      logger.warn(
        `🔄 [Database] Conectado ao PostgreSQL Local em modo FALLBACK (${primaryHost})`
      );
    } else {
      logger.info(`✅ [Database] Conectado com sucesso ao PostgreSQL Local (${primaryHost})`);
    }

    return true;
  } catch (err) {
    const primaryError = summarizePrismaError(err);
    const label = primaryProvider === "supabase" ? "Supabase PostgreSQL" : "PostgreSQL";
    logger.error(
      `❌ [Database] ERRO ao conectar ao ${label} (${primaryHost}): ${primaryError}`
    );

    if (localFallbackUrl && localFallbackUrl !== primaryUrl) {
      const localHost = extractDbHost(localFallbackUrl);
      logger.warn(
        `🔄 [Database] Tentando fallback automático para o PostgreSQL Local (${localHost})...`
      );

      const fallbackClient = createClientForUrl(localFallbackUrl);
      try {
        await fallbackClient.$queryRaw`SELECT 1`;
        await activePrismaClient.$disconnect().catch(() => {});
        activePrismaClient = fallbackClient;
        process.env.DATABASE_URL = localFallbackUrl;

        currentStatus = {
          connected: true,
          provider: "local-postgres",
          host: localHost,
          fallbackUsed: true,
          lastError: primaryError,
        };

        if (process.env.NODE_ENV !== "production") {
          globalForPrisma.activePrisma = activePrismaClient;
          globalForPrisma.dbStatus = currentStatus;
        }

        logger.info(
          `✅ [Database] Fallback ativo: Conectado com sucesso ao PostgreSQL Local (${localHost})`
        );
        return true;
      } catch (localErr) {
        const localErrorMsg = summarizePrismaError(localErr);
        await fallbackClient.$disconnect().catch(() => {});
        logger.error(
          `❌ [Database] ERRO no fallback para PostgreSQL Local (${localHost}): ${localErrorMsg}`
        );
      }
    }

    currentStatus = {
      connected: false,
      provider: "in-memory-fallback",
      host: "memory",
      fallbackUsed: true,
      lastError: primaryError,
    };

    logger.warn(
      "⚠️ [Database] Nenhum banco PostgreSQL acessível. Executando em modo de resiliência (dados locais em memória)."
    );
    return false;
  }
}
