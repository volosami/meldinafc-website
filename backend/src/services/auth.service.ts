import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { ChangePasswordInput, LoginInput, RegisterInput } from "../models/auth.schema.js";
import { AppError } from "../utils/AppError.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (process.env.NODE_ENV === "test") {
    return "test-only-jwt-secret-key-do-not-use-in-prod-2026";
  }
  throw new AppError(
    "Configuração de segurança ausente: defina JWT_SECRET (mín. 16 caracteres) no ambiente.",
    500
  );
}

function safeCompareSecret(provided: string, expected: string): boolean {
  const hashProvided = crypto.createHash("sha256").update(provided).digest();
  const hashExpected = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(hashProvided, hashExpected);
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthService {
  async register({ name, email, password, adminKey }: RegisterInput) {
    const configuredAdminKey =
      process.env.ADMIN_REGISTRATION_KEY ||
      (process.env.NODE_ENV === "test" ? "test-admin-registration-key-2026" : "");

    if (!configuredAdminKey) {
      throw new AppError("O cadastro de novos administradores está desabilitado neste servidor.", 403);
    }

    if (!safeCompareSecret(adminKey, configuredAdminKey)) {
      throw new AppError("Chave de administrador inválida ou não autorizada", 403);
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Este e-mail já está cadastrado no sistema", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role: "ADMIN",
    });

    const token = this.signToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login({ email, password }: LoginInput) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = this.signToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async changePassword(userId: string, { currentPassword, newPassword }: ChangePasswordInput) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new AppError("A senha atual informada está incorreta", 401);
    }

    if (currentPassword === newPassword) {
      throw new AppError("A nova senha deve ser diferente da senha atual", 400);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(userId, newPasswordHash);

    return { message: "Senha atualizada com sucesso!" };
  }

  private signToken(user: { id: string; email: string; name: string; role: string }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      getJwtSecret(),
      { expiresIn: "12h" }
    );
  }

  verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    } catch {
      throw new AppError("Token de autenticação inválido ou expirado", 401);
    }
  }
}

export const authService = new AuthService();
