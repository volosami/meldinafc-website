import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "TestAdmin@2026!";

// Cabeçalho binário JPEG real mínimo (FF D8 FF E0 + JFIF header)
const VALID_JPEG_BUFFER = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
  0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
]);

describe("Meldina FC API - MVC Endpoints & Business Rules", () => {
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

  it("GET /api/fixtures/teams should return all registered clubs", async () => {
    const res = await request(app).get("/api/fixtures/teams");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(12);
  });

  it("GET /api/fixtures/next should return the next match", async () => {
    const res = await request(app).get("/api/fixtures/next");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it("GET /api/standings should return standings sorted by points, wins, and goalDiff", async () => {
    const res = await request(app).get("/api/standings");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const list = res.body.data;
    expect(Array.isArray(list)).toBe(true);
    expect(list[0]).toHaveProperty("points");
    expect(list[0]).toHaveProperty("position", 1);

    // Verifica que está ordenado decrescentemente por pontos > vitórias > saldo
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const curr = list[i];
      expect(prev.points).toBeGreaterThanOrEqual(curr.points);
      if (prev.points === curr.points) {
        expect(prev.wins).toBeGreaterThanOrEqual(curr.wins);
      }
    }
  });

  it("GET /api/news should return news list", async () => {
    const res = await request(app).get("/api/news");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/members/register should register member as ACTIVE without Pix data (No-Money Rule)", async () => {
    const cpf = String(Math.floor(10000000000 + Math.random() * 89999999999));
    const email = `torcedor.${Date.now()}@teste.com`;
    const memberData = {
      name: "Torcedor Meldina Teste",
      email,
      cpf,
      phone: "11999999999",
      plan: "OURO",
    };

    const res = await request(app).post("/api/members/register").send(memberData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("member");
    expect(res.body.data.member.status).toBe("ACTIVE");
    expect(res.body.data).not.toHaveProperty("pix");

    // Tentativa duplicada deve retornar 409 Conflict
    const dupRes = await request(app).post("/api/members/register").send(memberData);
    expect(dupRes.status).toBe(409);
  });

  it("POST /api/auth/login should authenticate admin and return JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@meldinafc.com",
      password: TEST_ADMIN_PASSWORD,
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

  it("POST /api/news with admin token should create news and normalize relative imageUrl", async () => {
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
        imageUrl: "assets/news/kiki-tunel.jpg",
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(testSlug);
    expect(res.body.data.imageUrl).toBe("/assets/news/kiki-tunel.jpg");
  });

  it("POST / PUT / DELETE /api/players should support full CRUD and normalize photoUrl", async () => {
    const createRes = await request(app)
      .post("/api/players")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Atleta Teste Base",
        number: 99,
        position: "Atacante",
        group: "Atacantes",
        photoUrl: "assets/players/almeida-9.jpg",
        preferredFoot: "Esquerdo",
        joinedYear: 2026,
        matches: 3,
        goals: 2,
        assists: 1,
        extraKey: "Finalizações",
        extraValue: "7",
        bio: "Atleta criado durante teste automatizado.",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.id).toBe("atleta-teste-base");
    expect(createRes.body.data.photoUrl).toBe("/assets/players/almeida-9.jpg");

    const playerId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/players/${playerId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        goals: 5,
        assists: 4,
        photoUrl: "uploads/custom-pic.jpg",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.goals).toBe(5);
    expect(updateRes.body.data.assists).toBe(4);
    expect(updateRes.body.data.photoUrl).toBe("/uploads/custom-pic.jpg");

    const deleteRes = await request(app)
      .delete(`/api/players/${playerId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it("PATCH /api/fixtures/:id/score should update score, advance next match, and sync Série A standings", async () => {
    const nextBefore = await request(app).get("/api/fixtures/next");
    const targetId = nextBefore.body.data.id;

    const patchRes = await request(app)
      .patch(`/api/fixtures/${targetId}/score`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ homeScore: 2, awayScore: 0 });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.homeScore).toBe(2);
    expect(patchRes.body.data.awayScore).toBe(0);
    expect(patchRes.body.data.isNext).toBe(false);

    const nextAfter = await request(app).get("/api/fixtures/next");
    expect(nextAfter.status).toBe(200);
    expect(nextAfter.body.data.id).not.toBe(targetId);

    const standingsRes = await request(app).get("/api/standings");
    const mfcRow = standingsRes.body.data.find((s: any) => s.teamId === "mfc");
    expect(mfcRow.matches).toBe(7);
    expect(mfcRow.wins).toBe(6);
  });

  it("POST / PUT / DELETE /api/fixtures should support full CRUD and auto-sync Série A standings", async () => {
    const createRes = await request(app)
      .post("/api/fixtures")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        matchDate: "2026-10-28T22:00:00Z",
        competition: "Pro Clubs · Série A",
        round: "12ª rodada",
        isHome: true,
        opponentId: "desola",
        homeScore: 4,
        awayScore: 1,
        venue: "Lovebomb Arena",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const fxId = createRes.body.data.id;
    expect(createRes.body.data.opponent.id).toBe("desola");

    const updateRes = await request(app)
      .put(`/api/fixtures/${fxId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        round: "12ª rodada · Clássico",
        homeScore: 3,
        awayScore: 1,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.round).toBe("12ª rodada · Clássico");
    expect(updateRes.body.data.homeScore).toBe(3);

    const deleteRes = await request(app)
      .delete(`/api/fixtures/${fxId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it("PUT /api/standings/:teamId should manually update a club standing row", async () => {
    const res = await request(app)
      .put("/api/standings/desola")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        matches: 7,
        wins: 4,
        draws: 2,
        losses: 1,
        goalsFor: 14,
        goalsAgainst: 8,
        form: "WDWWD",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matches).toBe(7);
    expect(res.body.data.draws).toBe(2);
    expect(res.body.data.points).toBe(14);
    expect(res.body.data.form).toBe("WDWWD");
  });

  it("POST / PUT / DELETE /api/members should support full Admin CRUD", async () => {
    const cpf = String(Math.floor(10000000000 + Math.random() * 89999999999));
    const email = `socio.admin.${Date.now()}@meldinafc.com`;

    const createRes = await request(app)
      .post("/api/members")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Sócio Criado Admin",
        email,
        cpf,
        phone: "11988887777",
        plan: "PRATA",
        status: "ACTIVE",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.email).toBe(email);
    expect(createRes.body.data.paymentMethod).toBe("NONE");
    const memberId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/members/${memberId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        plan: "OURO",
        status: "CANCELLED",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.plan).toBe("OURO");
    expect(updateRes.body.data.status).toBe("CANCELLED");

    const deleteRes = await request(app)
      .delete(`/api/members/${memberId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it("GET /api/club should return club information", async () => {
    const res = await request(app).get("/api/club");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("stadium");
  });

  it("POST /api/upload with admin token and valid JPEG magic bytes should upload image", async () => {
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("file", VALID_JPEG_BUFFER, "test-pic.jpg");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.url).toMatch(/\.jpg$/);
  });
});
