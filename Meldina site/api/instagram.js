/*
 * GET /api/instagram — últimas publicações do @meldinafc.
 *
 * Único back-end do site. Usa a API oficial do Instagram (Instagram API with
 * Instagram Login) com um token de acesso de longa duração guardado na
 * variável de ambiente IG_ACCESS_TOKEN. O token nunca é enviado ao navegador.
 *
 * Funciona como Serverless Function da Vercel (pasta /api) e também é usado
 * pelo servidor local em server.js.
 */

const GRAPH = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const CACHE_MS = 10 * 60 * 1000; // 10 minutos
const REFRESH_MS = 24 * 60 * 60 * 1000; // renova o token no máximo 1x por dia

let cache = { at: 0, body: null };
let token = process.env.IG_ACCESS_TOKEN || "";
let lastRefresh = 0;

async function refreshToken() {
  if (!token || Date.now() - lastRefresh < REFRESH_MS) return;
  lastRefresh = Date.now();
  try {
    const r = await fetch(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
    if (r.ok) {
      const j = await r.json();
      if (j.access_token) token = j.access_token;
    }
  } catch {
    /* mantém o token atual */
  }
}

async function loadPosts(limit) {
  await refreshToken();
  const url = `${GRAPH}/me/media?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Instagram respondeu ${r.status}`);
  const j = await r.json();
  return (j.data || []).map((m) => ({
    id: m.id,
    type: m.media_type,
    image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
    permalink: m.permalink,
    caption: m.caption || "",
    timestamp: m.timestamp,
  }));
}

function send(res, status, body, maxAge = 0) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", maxAge ? `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 6}` : "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (!token) return send(res, 503, { error: "IG_ACCESS_TOKEN não configurado", posts: [] });

  if (cache.body && Date.now() - cache.at < CACHE_MS) return send(res, 200, cache.body, 600);

  try {
    const posts = await loadPosts(12);
    cache = { at: Date.now(), body: { account: "meldinafc", updated: new Date().toISOString(), posts } };
    return send(res, 200, cache.body, 600);
  } catch (e) {
    if (cache.body) return send(res, 200, cache.body, 60); // serve o último resultado bom
    return send(res, 502, { error: String(e.message || e), posts: [] });
  }
}
