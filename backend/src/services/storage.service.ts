import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../config/logger.js";

export interface DetectedImageType {
  mime: string;
  ext: string;
}

/**
 * Inspeciona os primeiros bytes (magic bytes) do buffer para validar que o
 * arquivo é realmente uma imagem suportada, prevenindo upload de scripts/HTML
 * com extensão ou Content-Type falsificado.
 */
export function detectImageSignature(buffer: Buffer): DetectedImageType | null {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: ".jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", ext: ".png" };
  }

  // GIF: "GIF87a" ou "GIF89a"
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { mime: "image/gif", ext: ".gif" };
  }

  // WEBP: "RIFF" (0..3) + "WEBP" (8..11)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: ".webp" };
  }

  // AVIF: ISO Base Media File Format ("ftypavif" ou "ftypavis" nos bytes 4..11)
  const boxHeader = buffer.subarray(4, 12).toString("ascii");
  if (boxHeader === "ftypavif" || boxHeader === "ftypavis") {
    return { mime: "image/avif", ext: ".avif" };
  }

  return null;
}

export interface StorageStatus {
  provider: "supabase" | "local";
  bucket: string | null;
  warning: string | null;
}

export class StorageService {
  private supabase: SupabaseClient | null = null;
  private bucket: string;
  private uploadDir: string;
  private warning: string | null = null;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || "meldina-assets";
    this.uploadDir = path.resolve(process.cwd(), "public", "uploads");

    if (supabaseUrl && supabaseKey && process.env.NODE_ENV !== "test") {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
        logger.info(`[Storage] Supabase Storage habilitado no bucket '${this.bucket}' (${supabaseUrl})`);
        if (supabaseKey.startsWith("sb_publishable_")) {
          this.warning =
            "Chave 'sb_publishable_*' detectada em SUPABASE_SERVICE_ROLE_KEY. Se o bucket possuir RLS restrito, uploads usarão fallback local; prefira a chave secreta 'service_role'.";
          logger.warn(`⚠️ [Storage] ${this.warning}`);
        }
      } catch (err) {
        this.warning = "Falha ao inicializar cliente Supabase Storage; operando em fallback local.";
        logger.warn({ err }, "[Storage] Falha ao inicializar Supabase Storage. Usando fallback local.");
        this.supabase = null;
      }
    } else {
      logger.info("[Storage] Utilizando armazenamento local (/public/uploads).");
    }
  }

  getStorageStatus(): StorageStatus {
    return {
      provider: this.supabase ? "supabase" : "local",
      bucket: this.supabase ? this.bucket : null,
      warning: this.warning,
    };
  }

  async uploadImage(file: Express.Multer.File, detected?: DetectedImageType): Promise<string> {
    const imgType = detected ?? detectImageSignature(file.buffer);
    if (!imgType) {
      throw new Error("Assinatura binária de imagem inválida.");
    }

    // A extensão vem exclusivamente da assinatura validada (nunca do nome enviado pelo cliente)
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${imgType.ext}`;

    // 1. Caso configurado para Supabase Storage
    if (this.supabase) {
      try {
        const { error } = await this.supabase.storage
          .from(this.bucket)
          .upload(uniqueName, file.buffer, {
            contentType: imgType.mime,
            upsert: false,
          });

        if (error) {
          logger.warn(
            { error },
            `[Storage] Erro ao enviar para Supabase Bucket '${this.bucket}'. Tentando fallback local.`
          );
        } else {
          const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(uniqueName);
          logger.info(`[Storage] Imagem enviada com sucesso para Supabase Storage: ${data.publicUrl}`);
          return data.publicUrl;
        }
      } catch (uploadError) {
        logger.error(
          { uploadError },
          "[Storage] Erro de rede/conexão com Supabase Storage. Tentando fallback local."
        );
      }
    }

    // 2. Armazenamento Local (fallback / desenvolvimento)
    await fs.mkdir(this.uploadDir, { recursive: true });
    const localFilePath = path.join(this.uploadDir, uniqueName);
    await fs.writeFile(localFilePath, file.buffer);

    logger.info(`[Storage] Imagem salva localmente em: ${localFilePath}`);
    return `/uploads/${uniqueName}`;
  }
}

export const storageService = new StorageService();
