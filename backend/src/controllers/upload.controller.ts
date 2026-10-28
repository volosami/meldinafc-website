import { Request, Response, NextFunction } from "express";
import { detectImageSignature, storageService } from "../services/storage.service.js";
import { AppError } from "../utils/AppError.js";

export class UploadController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado. Selecione uma imagem.", 400);
      }

      // Validar assinatura binária real (magic bytes) e tipo de mídia
      const detected = detectImageSignature(req.file.buffer);
      if (!detected) {
        throw new AppError(
          "Formato ou conteúdo de arquivo inválido. Envie uma imagem autêntica (JPG, PNG, WEBP, GIF ou AVIF).",
          400
        );
      }

      const fileUrl = await storageService.uploadImage(req.file, detected);

      res.status(200).json({
        success: true,
        message: "Upload realizado com sucesso!",
        url: fileUrl,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const uploadController = new UploadController();
