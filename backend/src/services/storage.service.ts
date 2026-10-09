import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../config/logger.js";

export class StorageService {
  private supabase: SupabaseClient | null = null;
  private bucket: string;
  private uploadDir: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || "meldina-assets";
    this.uploadDir = path.resolve(process.cwd(), "public", "uploads");

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
        logger.info(`[Storage] Supabase Storage habilitado no bucket '${this.bucket}'`);
      } catch (err) {
        logger.warn({ err }, "[Storage] Falha ao inicializar Supabase Storage. Usando fallback local.");
        this.supabase = null;
      }
    } else {
      logger.info("[Storage] Supabase Storage nao configurado. Utilizando armazenamento local (/public/uploads).");
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

    // 1. Caso configurado para Supabase Storage
    if (this.supabase) {
      try {
        const { error } = await this.supabase.storage
          .from(this.bucket)
          .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (error) {
          logger.warn({ error }, `[Storage] Erro ao enviar para Supabase Bucket '${this.bucket}'. Tentando fallback local.`);
        } else {
          const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(uniqueName);
          logger.info(`[Storage] Imagem enviada com sucesso para Supabase Storage: ${data.publicUrl}`);
          return data.publicUrl;
        }
      } catch (uploadError) {
        logger.error({ uploadError }, "[Storage] Erro de rede/conexão com Supabase Storage. Tentando fallback local.");
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
