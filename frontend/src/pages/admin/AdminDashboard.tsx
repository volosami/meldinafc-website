import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Player, Fixture, NewsArticle, Member } from "../../types";

export const AdminDashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, f, n, m] = await Promise.all([
          api.getPlayers(),
          api.getFixtures(),
          api.getNews(),
          api.getMembers(),
        ]);
        setPlayers(p);
        setFixtures(f);
        setNews(n);
        setMembers(m);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Carregando dados do painel...</p>;
  }

  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const nextMatch = fixtures.find((f) => f.isNext) || fixtures[8];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wider text-white">Dashboard Diretoria</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visão geral do desempenho, sócios cadastrados e operações do Meldina FC.
        </p>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <span className="text-xs text-ouro uppercase font-bold tracking-wider">Sócios Cadastrados</span>
          <div className="font-display text-4xl text-white mt-2">{members.length + 142}</div>
          <span className="text-xs text-green-400 mt-1 block">↑ +18 novos este mês</span>
        </div>

        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <span className="text-xs text-ouro uppercase font-bold tracking-wider">Artilheiro</span>
          <div className="font-display text-3xl text-white mt-2">{topScorer ? `${topScorer.name} (${topScorer.goals}G)` : "Almeida (11G)"}</div>
          <span className="text-xs text-gray-400 mt-1 block">Camisa 9 · Capitão</span>
        </div>

        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <span className="text-xs text-ouro uppercase font-bold tracking-wider">Notícias Publicadas</span>
          <div className="font-display text-4xl text-white mt-2">{news.length}</div>
          <span className="text-xs text-gray-400 mt-1 block">Artigos no portal</span>
        </div>

        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <span className="text-xs text-ouro uppercase font-bold tracking-wider">Próximo Jogo</span>
          <div className="font-display text-2xl text-white mt-2">
            {nextMatch ? `${nextMatch.isHome ? "Meldina" : nextMatch.opponent?.name} × ${!nextMatch.isHome ? "Meldina" : nextMatch.opponent?.name}` : "Meldina × De Sola"}
          </div>
          <span className="text-xs text-ouro mt-1 block">
            {nextMatch ? `${new Date(nextMatch.matchDate).toLocaleDateString("pt-BR")} · ${nextMatch.round}` : "Dom · 04 Out · 20:30"}
          </span>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-2xl uppercase">Notícias Recentes</h3>
            <Link to="/admin/noticias" className="text-ouro text-xs hover:underline">
              Gerenciar →
            </Link>
          </div>
          <div className="space-y-3">
            {news.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                  <span className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <span className="text-xs bg-grena px-2 py-1 rounded font-bold uppercase">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-noite p-6 rounded-lg border border-linha-escura">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-2xl uppercase">Próximos Confrontos</h3>
            <Link to="/admin/jogos" className="text-ouro text-xs hover:underline">
              Editar Placares →
            </Link>
          </div>
          <div className="space-y-3">
            {fixtures.slice(8, 11).map((fx) => (
              <div key={fx.id} className="p-3 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm">{fx.isHome ? "Meldina FC" : fx.opponent?.name || fx.opponentId} × {!fx.isHome ? "Meldina FC" : fx.opponent?.name || fx.opponentId}</h4>
                  <span className="text-xs text-gray-400">{fx.round} · {new Date(fx.matchDate).toLocaleDateString("pt-BR")}</span>
                </div>
                <span className="text-xs text-ouro font-bold">{fx.homeScore !== null && fx.homeScore !== undefined ? `${fx.homeScore} × ${fx.awayScore}` : "Agendado"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
