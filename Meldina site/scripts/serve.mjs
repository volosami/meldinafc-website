/*
 * Servidor local (sem dependências) para testar o site com o feed do Instagram.
 * Fica fora da raiz de propósito: a Vercel trata um server.js na raiz como
 * servidor Node e deixaria de servir o site estático.
 *   IG_ACCESS_TOKEN=seu_token npm start
 * Abre em http://localhost:3000
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import instagram from "../api/instagram.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json",
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === "/api/instagram") return instagram(req, res);

  const file = normalize(join(ROOT, path === "/" ? "index.html" : path));
  if (!file.startsWith(ROOT) || file.includes(`${ROOT}api`) || (file.endsWith(".js") || file.endsWith(".mjs")) && !file.includes("/assets/")) {
    res.statusCode = 404; return res.end("Não encontrado");
  }
  try {
    const data = await readFile(file);
    res.setHeader("Content-Type", TYPES[extname(file).toLowerCase()] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404; res.end("Não encontrado");
  }
}).listen(PORT, () => console.log(`Meldina FC em http://localhost:${PORT}`));
