import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadLimiter } from "../middlewares/rateLimiter.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
});

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  authMiddleware,
  uploadLimiter,
  upload.single("file"),
  (req, res, next) => uploadController.upload(req, res, next)
);
