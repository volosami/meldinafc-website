import { Request, Response, NextFunction } from "express";
import { storageService } from "../services/storage.service.js";

export class UploadController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Nenhum arquivo enviado. Selecione uma imagem.",
        });
        return;
      }

      // Validar tipo de mídia
      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
      if (!allowedMimes.includes(req.file.mimetype)) {
        res.status(400).json({
          success: false,
          message: "Formato de arquivo inválido. Formatos permitidos: JPG, PNG, WEBP, GIF, AVIF.",
        });
        return;
      }

      const fileUrl = await storageService.uploadImage(req.file);

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
