import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Meldina FC API - MVC Endpoints", () => {
  let adminToken = "";

  it("GET /api/players should return the squad list", async () => {
    const res = await request(app).get("/api/players");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("name");
    expect(res.body.data[0]).toHaveProperty("position");
  });

  it("GET /api/fixtures should return match schedule", async () => {
    const res = await request(app).get("/api/fixtures");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/fixtures/next should return the next match", async () => {
    const res = await request(app).get("/api/fixtures/next");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it("GET /api/standings should return sorted standings with points", async () => {
    const res = await request(app).get("/api/standings");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("points");
  });

  it("GET /api/news should return news list", async () => {
    const res = await request(app).get("/api/news");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/members/register should validate and register member", async () => {
    const memberData = {
      name: "Torcedor Meldina Teste",
      email: `torcedor.${Date.now()}@teste.com`,
      cpf: String(Math.floor(10000000000 + Math.random() * 89999999999)),
      phone: "11999999999",
      plan: "OURO",
    };

    const res = await request(app).post("/api/members/register").send(memberData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("member");
    expect(res.body.data).toHaveProperty("pix");
    expect(res.body.data.pix.amount).toBe(49.9);
  });

  it("POST /api/auth/login should authenticate admin and return JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@meldinafc.com",
      password: "meldina2026!",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    adminToken = res.body.data.token;
  });

  it("GET /api/auth/me should return authenticated user with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("admin@meldinafc.com");
  });

  it("POST /api/news without token should return 401 Unauthorized", async () => {
    const res = await request(app).post("/api/news").send({
      title: "Título Não Autorizado",
      slug: "titulo-nao-autorizado",
      summary: "Resumo da notícia não autorizada",
      content: "Conteúdo da notícia que deve ser bloqueada sem token",
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/news with admin token should create news successfully", async () => {
    const testSlug = `noticia-teste-${Date.now()}`;
    const res = await request(app)
      .post("/api/news")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Notícia Teste Automatizado",
        slug: testSlug,
        summary: "Resumo da notícia de teste automatizado",
        content: "Conteúdo completo da notícia criada durante a suite de testes automatizados.",
        category: "clube",
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(testSlug);
  });

  it("POST /api/auth/register with invalid admin key should fail", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Novo Admin",
      email: "novo.admin@teste.com",
      password: "senha123456",
      adminKey: "chave-errada-123",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /api/auth/register with valid admin key should create admin user", async () => {
    const email = `admin.${Date.now()}@teste.com`;
    const res = await request(app).post("/api/auth/register").send({
      name: "Novo Diretor",
      email,
      password: "senha123456",
      adminKey: process.env.ADMIN_REGISTRATION_KEY || "meldina-admin-2026-secret",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(email);
  });

  it("GET /api/club should return club information", async () => {
    const res = await request(app).get("/api/club");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("stadium");
  });

  it("POST /api/upload with admin token should upload image", async () => {
    const buffer = Buffer.from("fake-image-bytes");
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("file", buffer, "test-pic.jpg");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.url).toBeDefined();
  });
});
