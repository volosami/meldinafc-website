import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app.js";

const VALID_ADMIN_KEY =
  process.env.ADMIN_REGISTRATION_KEY || "test-admin-registration-key-2026";
const JWT_SECRET =
  process.env.JWT_SECRET || "test-only-jwt-secret-key-do-not-use-in-prod-2026";

const VALID_PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);

describe("Security Hardening & Admin Protection Suite", () => {
  it("should include security headers (X-Content-Type-Options, X-Frame-Options) and hide X-Powered-By", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("should reject legacy hardcoded password backdoor ('meldina2026!') with 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@meldinafc.com",
      password: "meldina2026!",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 (not 500) on invalid login credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@meldinafc.com",
      password: "wrong-password-123",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject admin registration with invalid adminKey with 403 Forbidden", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Invasor",
      email: "invasor@teste.com",
      password: "PasswordForte123!",
      adminKey: "chave-errada-123",
    });
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should reject admin registration with weak password (< 8 chars) with 400", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Diretor",
      email: "diretor.curto@teste.com",
      password: "123456",
      adminKey: VALID_ADMIN_KEY,
    });
    expect(res.status).toBe(400);
  });

  it("should register a new admin, allow changing password, and reject old password afterwards", async () => {
    const email = `diretor.sec.${Date.now()}@meldinafc.com`;
    const initialPassword = "InitialPassword123!";
    const newPassword = "UpdatedSecurePassword456!";

    const regRes = await request(app).post("/api/auth/register").send({
      name: "Diretor de Segurança",
      email,
      password: initialPassword,
      adminKey: VALID_ADMIN_KEY,
    });
    expect(regRes.status).toBe(201);
    const token = regRes.body.data.token;

    // Tentativa de trocar senha informando senha atual incorreta -> 401
    const badChangeRes = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "WrongCurrentPassword!",
        newPassword,
      });
    expect(badChangeRes.status).toBe(401);

    // Troca de senha válida -> 200
    const okChangeRes = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: initialPassword,
        newPassword,
      });
    expect(okChangeRes.status).toBe(200);
    expect(okChangeRes.body.success).toBe(true);

    // Login com senha antiga deve falhar com 401
    const oldLoginRes = await request(app).post("/api/auth/login").send({
      email,
      password: initialPassword,
    });
    expect(oldLoginRes.status).toBe(401);

    // Login com senha nova deve funcionar com 200
    const newLoginRes = await request(app).post("/api/auth/login").send({
      email,
      password: newPassword,
    });
    expect(newLoginRes.status).toBe(200);
    expect(newLoginRes.body.data).toHaveProperty("token");
  });

  it("should reject JWT tokens without ADMIN role with 403 Forbidden", async () => {
    const nonAdminToken = jwt.sign(
      { id: "usr-guest", email: "guest@teste.com", name: "Guest", role: "USER" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/members")
      .set("Authorization", `Bearer ${nonAdminToken}`);
    expect(res.status).toBe(403);
  });

  it("should reject disguised non-image file uploads (fake magic bytes) even with .jpg filename", async () => {
    const email = `upload.admin.${Date.now()}@meldinafc.com`;
    const regRes = await request(app).post("/api/auth/register").send({
      name: "Upload Admin",
      email,
      password: "UploadPassword123!",
      adminKey: VALID_ADMIN_KEY,
    });
    const token = regRes.body.data.token;

    const fakeScriptBuffer = Buffer.from("<script>alert('xss')</script>");
    const badUpload = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", fakeScriptBuffer, {
        filename: "exploit.jpg",
        contentType: "image/jpeg",
      });
    expect(badUpload.status).toBe(400);
    expect(badUpload.body.success).toBe(false);

    // Upload com PNG real mas nome malicioso "ataque.html" deve gerar extensão .png segura
    const safeUpload = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", VALID_PNG_BUFFER, {
        filename: "ataque.html",
        contentType: "image/png",
      });
    expect(safeUpload.status).toBe(200);
    expect(safeUpload.body.url).toMatch(/\.png$/);
  });

  it("should enforce rate limiting when x-test-rate-limit header is active", async () => {
    const testIp = "203.0.113.99";
    let lastStatus = 200;

    for (let i = 0; i < 11; i++) {
      const res = await request(app)
        .post("/api/auth/login")
        .set("x-test-rate-limit", "true")
        .set("x-forwarded-for", testIp)
        .send({ email: "brute@force.com", password: "wrong" });
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
  });
});

