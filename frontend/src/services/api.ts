import axios from "axios";
import {
  Player,
  Team,
  Fixture,
  Standing,
  NewsArticle,
  Member,
} from "../types";
import {
  STATIC_PLAYERS,
  STATIC_TEAMS,
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    if (
      error?.response?.status === 401 &&
      url !== "/auth/login" &&
      url !== "/auth/password" &&
      !url.endsWith("/auth/login") &&
      !url.endsWith("/auth/password")
    ) {
      localStorage.removeItem("meldina_admin_token");
      window.dispatchEvent(new Event("meldina:unauthorized"));
    }
    return Promise.reject(error);
  }
);

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

  async createPlayer(data: Partial<Player>) {
    const res = await apiClient.post("/players", data);
    return res.data;
  },

  async updatePlayer(id: string, data: Partial<Player>) {
    const res = await apiClient.put(`/players/${id}`, data);
    return res.data;
  },

  async updatePlayerStats(id: string, stats: { matches?: number; goals?: number; assists?: number }) {
    const res = await apiClient.patch(`/players/${id}/stats`, stats);
    return res.data;
  },

  async deletePlayer(id: string) {
    const res = await apiClient.delete(`/players/${id}`);
    return res.data;
  },

  // Partidas, Times e Próximo Jogo
  async getTeams(): Promise<Team[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Team[] }>("/fixtures/teams");
      return Array.isArray(res.data?.data) ? res.data.data : Object.values(STATIC_TEAMS);
    } catch {
      return Object.values(STATIC_TEAMS);
    }
  },

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

  async createFixture(data: Partial<Fixture>) {
    const res = await apiClient.post("/fixtures", data);
    return res.data;
  },

  async updateFixture(id: string, data: Partial<Fixture>) {
    const res = await apiClient.put(`/fixtures/${id}`, data);
    return res.data;
  },

  async updateFixtureScore(id: string, homeScore: number, awayScore: number) {
    const res = await apiClient.patch(`/fixtures/${id}/score`, { homeScore, awayScore });
    return res.data;
  },

  async deleteFixture(id: string) {
    const res = await apiClient.delete(`/fixtures/${id}`);
    return res.data;
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

  async updateStanding(teamId: string, data: Partial<Standing>) {
    const res = await apiClient.put(`/standings/${teamId}`, data);
    return res.data;
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

  // Sócios
  async registerMember(data: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
    plan: string;
  }) {
    const res = await apiClient.post("/members/register", data);
    return res.data;
  },

  async getMembers(): Promise<Member[]> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Member[] }>("/members");
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch {
      return [];
    }
  },

  async createMember(data: Partial<Member>) {
    const res = await apiClient.post("/members", data);
    return res.data;
  },

  async updateMember(id: string, data: Partial<Member>) {
    const res = await apiClient.put(`/members/${id}`, data);
    return res.data;
  },

  async deleteMember(id: string) {
    const res = await apiClient.delete(`/members/${id}`);
    return res.data;
  },

  // Autenticação Admin
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  async register(data: { name: string; email: string; password: string; adminKey: string }) {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  async getAdminProfile() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const res = await apiClient.patch("/auth/password", data);
    return res.data;
  },

  // Upload de Imagens (Local ou Supabase)
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ success: boolean; url: string }>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  },

  // Informações do Clube
  async getClubInfo() {
    try {
      const res = await apiClient.get<{ success: boolean; data: any }>("/club");
      return res.data.data;
    } catch {
      return null;
    }
  },

  async updateClubInfo(data: any) {
    const res = await apiClient.put("/club", data);
    return res.data;
  },
};
