import axios from "axios";
import {
  Player,
  Fixture,
  Standing,
  NewsArticle,
  Member,
} from "../types";
import {
  STATIC_PLAYERS,
  STATIC_FIXTURES,
  STATIC_STANDINGS,
  STATIC_NEWS,
} from "../data/staticData";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("meldina_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Jogadores
  async getPlayers(): Promise<Player[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Player[] }>("/players");
      return res.data.data;
    } catch {
      return STATIC_PLAYERS;
    }
  },

  async getPlayerById(id: string): Promise<Player | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Player }>(`/players/${id}`);
      return res.data.data;
    } catch {
      return STATIC_PLAYERS.find((p) => p.id === id) || null;
    }
  },

  // Partidas e Próximo Jogo
  async getFixtures(): Promise<Fixture[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Fixture[] }>("/fixtures");
      return res.data.data;
    } catch {
      return STATIC_FIXTURES;
    }
  },

  async getNextMatch(): Promise<Fixture | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Fixture }>("/fixtures/next");
      return res.data.data;
    } catch {
      return STATIC_FIXTURES.find((f) => f.isNext) || STATIC_FIXTURES[8];
    }
  },

  // Classificação
  async getStandings(): Promise<Standing[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Standing[] }>("/standings");
      return res.data.data;
    } catch {
      return STATIC_STANDINGS;
    }
  },

  // Notícias
  async getNews(): Promise<NewsArticle[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: NewsArticle[] }>("/news");
      return res.data.data;
    } catch {
      return STATIC_NEWS;
    }
  },

  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: NewsArticle }>(`/news/${slug}`);
      return res.data.data;
    } catch {
      return STATIC_NEWS.find((n) => n.slug === slug) || null;
    }
  },

  // Sócios
  async registerMember(data: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    plan: string;
  }) {
    const res = await apiClient.post("/members/register", data);
    return res.data;
  },

  async getMembers(): Promise<Member[]> {
    const res = await apiClient.get<{ success: boolean; data: Member[] }>("/members");
    return res.data.data;
  },

  // Autenticação Admin
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  async getAdminProfile() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  // Operações Admin (CRUDs)
  async createNews(data: Partial<NewsArticle>) {
    const res = await apiClient.post("/news", data);
    return res.data;
  },

  async updateNews(slug: string, data: Partial<NewsArticle>) {
    const res = await apiClient.put(`/news/${slug}`, data);
    return res.data;
  },

  async deleteNews(slug: string) {
    const res = await apiClient.delete(`/news/${slug}`);
    return res.data;
  },

  async updateFixtureScore(id: string, homeScore: number, awayScore: number) {
    const res = await apiClient.patch(`/fixtures/${id}/score`, { homeScore, awayScore });
    return res.data;
  },

  async updatePlayerStats(id: string, stats: { matches?: number; goals?: number; assists?: number }) {
    const res = await apiClient.patch(`/players/${id}/stats`, stats);
    return res.data;
  },
};
