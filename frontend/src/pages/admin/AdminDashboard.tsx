import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { api } from "../../services/api";
import { Player, Fixture, NewsArticle, Member } from "../../types";
import { STATIC_TEAMS, STATIC_PLAYERS, STATIC_FIXTURES, STATIC_NEWS } from "../../data/staticData";
import {
  asList,
  formatDateShort,
  formatMatchDay,
  formatTime,
  normalizeAssetUrl,
  safeDate,
} from "../../lib/format";
import {
  isPlayed,
  kickoff,
  opponentOf,
  outcomeOf,
  pickLastResult,
  pickNextMatch,
} from "../../lib/fixtures";
import { TeamBadge } from "../../components/ui/TeamBadge";
import { FallbackImage } from "../../components/ui/FallbackImage";
import { TAG_CLASS } from "../../components/NewsCard";

export const AdminDashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, f, n, m] = await Promise.all([
          api.getPlayers(),
          api.getFixtures(),
          api.getNews(),
          api.getMembers(),
        ]);
        if (cancelled) return;
        setPlayers(asList(p, STATIC_PLAYERS));
        setFixtures(asList(f, STATIC_FIXTURES));
        setNews(asList(n, STATIC_NEWS));
        setMembers(asList(m, []));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const nextMatch =
    fixtures.find((f) => f.isNext) ?? pickNextMatch(null, fixtures, Date.now());
  const lastResult = pickLastResult(fixtures);
  const activeMembersCount = members.filter((m) => m.status !== "CANCELLED").length;
  const playedCount = fixtures.filter(isPlayed).length;

  // Seleciona os jogos em destaque para o painel (últimos disputados + próximos agendados)
  const recentAndUpcomingFixtures = (() => {
    const upcoming = fixtures.filter((f) => !isPlayed(f)).slice(0, 3);
    const played = fixtures.filter(isPlayed).slice(-2).reverse();
    return [...upcoming, ...played].slice(0, 5);
  })();

  return (
    <div className="space-y-8">
      {/* 1. ADMIN HERO */}
      <section className="admin-hero">
        <img
          className="admin-hero__mark"
          src="/assets/img/monograma-outline.png"
          alt=""
        />
        <div className="wrap">
          <p className="eyebrow">Temporada 2026 · Gestão Oficial</p>
          <h1 className="display">Painel da Diretoria</h1>
          <p>
            Instrumento oficial de comando do Meldina FC: acompanhe a temporada,
            gerencie o elenco, publique matérias e atualize os placares da Série A.
          </p>
        </div>
      </section>

      {/* 2. MATCHBAR ADMINISTRATIVO */}
      <section className="matchbar" aria-label="Resumo da rodada e elenco">
        <div className="wrap">
          {/* Célula 1: Próximo Jogo */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Próximo Jogo</span>
              <Link to="/admin/jogos" className="link-arrow text-xs">
                Gerenciar <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {loading ? (
              <div className="mc-skeleton" aria-hidden="true" />
            ) : nextMatch ? (
              (() => {
                const date = safeDate(nextMatch.matchDate) || new Date(kickoff(nextMatch));
                const opp = opponentOf(nextMatch);
                const meldina = (
                  <div className="team">
                    <TeamBadge team={STATIC_TEAMS.mfc} />
                    <span>Meldina FC</span>
                  </div>
                );
                const rival = (
                  <div className="team">
                    <TeamBadge team={opp} />
                    <span>{opp?.name || nextMatch.opponentId}</span>
                  </div>
                );
                return (
                  <div className="fixture">
                    {nextMatch.isHome ? meldina : rival}
                    <div className="fixture__mid">
                      <time className="fixture__time" dateTime={nextMatch.matchDate}>
                        {formatTime(date)}
                      </time>
                      <div className="fixture__date">{formatMatchDay(date)}</div>
                      <div className="text-[11px] text-ouro font-bold uppercase tracking-wider mt-1">
                        {nextMatch.round}
                      </div>
                      {nextMatch.venue && (
                        <div className="fixture__venue">
                          <MapPin aria-hidden="true" />
                          <span>{nextMatch.venue}</span>
                        </div>
                      )}
                    </div>
                    {nextMatch.isHome ? rival : meldina}
                  </div>
                );
              })()
            ) : (
              <div className="mc-empty">
                <p>Sem próximo jogo agendado.</p>
                <Link to="/admin/jogos" className="link-arrow">
                  Agendar partida <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {/* Célula 2: Último Resultado */}
          <div className="matchbar__cell">
            {(() => {
              const outcome = lastResult ? outcomeOf(lastResult) : null;
              const opp = lastResult ? opponentOf(lastResult) : undefined;
              const oppName = opp?.shortName || lastResult?.opponentId || "";
              const homeName = lastResult?.isHome ? "Meldina" : oppName;
              const awayName = lastResult?.isHome ? oppName : "Meldina";
              return (
                <>
                  <div className="mc-label">
                    <span>Último Resultado</span>
                    {outcome && <span className={outcome.tagClass}>{outcome.label}</span>}
                  </div>
                  {loading ? (
                    <div className="mc-skeleton" aria-hidden="true" />
                  ) : lastResult ? (
                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="score">
                        <span>{lastResult.homeScore}</span>
                        <i>×</i>
                        <span>{lastResult.awayScore}</span>
                      </div>
                      <p className="text-xs text-white/70 mt-2 uppercase tracking-wider text-center font-semibold">
                        {homeName} {lastResult.homeScore} × {lastResult.awayScore} {awayName}
                      </p>
                      <span className="text-[11px] text-ouro uppercase tracking-widest mt-1">
                        {lastResult.round}
                      </span>
                    </div>
                  ) : (
                    <div className="mc-empty">
                      <p>Nenhum resultado registrado.</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Célula 3: Liderança & Elenco */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Liderança & Elenco</span>
              <Link to="/admin/elenco" className="link-arrow text-xs">
                Elenco <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {loading ? (
              <div className="mc-skeleton" aria-hidden="true" />
            ) : (
              <div className="space-y-4">
                {topScorer && (
                  <div className="flex items-center gap-3.5 p-2.5 rounded bg-white/5 border border-linha-escura">
                    <img
                      src={normalizeAssetUrl(topScorer.photoUrl) || "/assets/img/escudo-sm.png"}
                      alt={topScorer.name}
                      className="w-12 h-12 rounded-full object-cover object-top border border-ouro shrink-0 bg-black"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-widest text-ouro font-bold block">
                        Artilheiro da Temporada
                      </span>
                      <strong className="font-display text-xl uppercase tracking-wide block leading-tight truncate">
                        {topScorer.name} #{topScorer.number}
                      </strong>
                    </div>
                    <div className="text-right shrink-0">
                      <b className="font-display text-2xl text-ouro block leading-none">
                        {topScorer.goals}
                      </b>
                      <small className="text-[10px] uppercase tracking-wider text-white/60">
                        Gols
                      </small>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between px-3 py-2 rounded bg-white/5 border border-linha-escura text-xs">
                  <span className="uppercase tracking-wider text-white/70 font-semibold">
                    Sócios Ativos no Clube
                  </span>
                  <Link
                    to="/admin/socios"
                    className="font-display text-lg text-ouro hover:underline"
                  >
                    {activeMembersCount} associados
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. QUATRO CARDS DE MÉTRICAS (.stat) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/admin/socios"
          className="stat rounded-md border border-linha-escura bg-noite-2 p-5 hover:border-ouro/60 transition-colors"
        >
          <small className="block mb-2 text-ouro font-bold">Sócios Clube Meldina</small>
          <b className="text-4xl">{members.length}</b>
          <span className="text-xs text-white/60 mt-2 block">
            {activeMembersCount} ativos na base oficial
          </span>
        </Link>

        <Link
          to="/admin/elenco"
          className="stat rounded-md border border-linha-escura bg-noite-2 p-5 hover:border-ouro/60 transition-colors"
        >
          <small className="block mb-2 text-ouro font-bold">Artilheiro da Temporada</small>
          <b className="text-4xl">
            {topScorer ? `${topScorer.name} (${topScorer.goals})` : "Almeida (11)"}
          </b>
          <span className="text-xs text-white/60 mt-2 block">
            {players.length} atletas registrados no elenco
          </span>
        </Link>

        <Link
          to="/admin/noticias"
          className="stat rounded-md border border-linha-escura bg-noite-2 p-5 hover:border-ouro/60 transition-colors"
        >
          <small className="block mb-2 text-ouro font-bold">Notícias Publicadas</small>
          <b className="text-4xl">{news.length}</b>
          <span className="text-xs text-white/60 mt-2 block">
            Matérias e notas oficiais no ar
          </span>
        </Link>

        <Link
          to="/admin/jogos"
          className="stat rounded-md border border-linha-escura bg-noite-2 p-5 hover:border-ouro/60 transition-colors"
        >
          <small className="block mb-2 text-ouro font-bold">Jogos no Calendário</small>
          <b className="text-4xl">{fixtures.length}</b>
          <span className="text-xs text-white/60 mt-2 block">
            {playedCount} encerrados · {fixtures.length - playedCount} agendados
          </span>
        </Link>
      </div>

      {/* 4. DOIS PAINÉIS RICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel 1: Últimas Publicações */}
        <div className="form-card p-6 space-y-5">
          <div className="flex items-end justify-between gap-4 border-b border-linha-escura pb-4">
            <div>
              <p className="eyebrow mb-1">Redação Oficial</p>
              <h2 className="display text-3xl">Últimas Publicações</h2>
            </div>
            <Link to="/admin/noticias" className="link-arrow text-xs">
              Gerenciar Notícias <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {news.slice(0, 4).map((item) => {
              const date = safeDate(item.publishedAt);
              const tagKey = (item.category || "").toLowerCase();
              return (
                <div
                  key={item.id}
                  className="p-3 rounded bg-white/5 border border-linha-escura hover:border-ouro/50 transition-colors flex items-center gap-4"
                >
                  <div className="w-20 h-14 rounded overflow-hidden bg-black shrink-0 relative border border-linha-escura">
                    <FallbackImage
                      src={item.imageUrl || undefined}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`news-card__tag static px-2 py-0.5 text-[10px] ${
                          TAG_CLASS[tagKey] ?? ""
                        }`}
                      >
                        {item.category}
                      </span>
                      {date && (
                        <span className="text-[11px] text-white/55 uppercase tracking-wider">
                          {formatDateShort(date)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                  <Link
                    to="/admin/noticias"
                    className="btn btn--sm btn--ghost text-[11px] px-3 py-1.5 shrink-0"
                  >
                    Editar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel 2: Próximos Confrontos & Resultados */}
        <div className="form-card p-6 space-y-5">
          <div className="flex items-end justify-between gap-4 border-b border-linha-escura pb-4">
            <div>
              <p className="eyebrow mb-1">Temporada 2026</p>
              <h2 className="display text-3xl">Próximos Confrontos & Resultados</h2>
            </div>
            <Link to="/admin/jogos" className="link-arrow text-xs">
              Calendário & Placares <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentAndUpcomingFixtures.map((fx) => {
              const opp = opponentOf(fx);
              const homeTeam = fx.isHome ? STATIC_TEAMS.mfc : opp;
              const awayTeam = fx.isHome ? opp : STATIC_TEAMS.mfc;
              const homeName = fx.isHome ? "Meldina FC" : opp?.shortName || fx.opponentId;
              const awayName = fx.isHome ? opp?.shortName || fx.opponentId : "Meldina FC";
              const finished = isPlayed(fx);
              const date = safeDate(fx.matchDate);

              return (
                <div
                  key={fx.id}
                  className={`p-3.5 rounded border transition-colors flex items-center justify-between gap-3 ${
                    fx.isNext
                      ? "bg-ouro/10 border-ouro"
                      : "bg-white/5 border-linha-escura hover:border-ouro/40"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ouro block">
                      {fx.round} {date ? `· ${formatMatchDay(date)}` : ""}
                    </span>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <TeamBadge team={homeTeam} small />
                      <span className="font-bold text-xs uppercase tracking-wider truncate">
                        {homeName}
                      </span>
                      <span
                        className={`font-display text-base px-2 py-0.5 rounded ${
                          finished
                            ? "bg-black/50 text-ouro"
                            : "bg-white/10 text-white/70 text-xs"
                        }`}
                      >
                        {finished ? `${fx.homeScore} × ${fx.awayScore}` : "VS"}
                      </span>
                      <span className="font-bold text-xs uppercase tracking-wider truncate">
                        {awayName}
                      </span>
                      <TeamBadge team={awayTeam} small />
                    </div>
                  </div>

                  <Link
                    to="/admin/jogos"
                    className="btn btn--sm btn--ghost text-[11px] px-3 py-1.5 shrink-0"
                  >
                    {finished ? "Placar" : "Editar"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
