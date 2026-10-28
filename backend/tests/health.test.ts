import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Health Check Endpoint", () => {
  it("should return status 200, club name, database and storage info", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("club", "Meldina FC");
    expect(res.body).toHaveProperty("database");
    expect(res.body.database).toHaveProperty("provider");
    expect(res.body).toHaveProperty("storage");
    expect(res.body.storage).toHaveProperty("provider");
  });
});
