import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Pause, Play } from "lucide-react";
import { api } from "../services/api";
import { Player, Fixture, Standing, NewsArticle } from "../types";
import {
  MFC_INFO,
  STATIC_PLAYERS,
  STATIC_FIXTURES,
  STATIC_STANDINGS,
  STATIC_NEWS,
  STATIC_TEAMS,
} from "../data/staticData";
import { asList, formatFull, formatMatchDay, formatTime } from "../lib/format";
import { kickoff, opponentOf, outcomeOf, pickLastResult, pickNextMatch } from "../lib/fixtures";
import { TeamBadge } from "../components/ui/TeamBadge";
import { NewsCard } from "../components/NewsCard";
import { PlayerCard, PlayerDialog } from "../components/PlayerDialog";

const SLIDE_COUNT = 3;
/* ---------- Hooks ---------- */

function useReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/* ---------- Componentes ---------- */

const Countdown: React.FC<{ target: number; now: number }> = ({ target, now }) => {
  const diff = target - now;
  if (diff <= 0) return null;
  const totalMin = Math.floor(diff / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  const label = `Faltam ${days} ${days === 1 ? "dia" : "dias"}, ${hours} ${hours === 1 ? "hora" : "horas"} e ${mins} ${mins === 1 ? "minuto" : "minutos"}`;
  return (
    <div className="countdown" role="timer" aria-label={label}>
      <div aria-hidden="true">
        <b>{days}</b>
        <small>{days === 1 ? "dia" : "dias"}</small>
      </div>
      <div aria-hidden="true">
        <b>{String(hours).padStart(2, "0")}</b>
        <small>h</small>
      </div>
      <div aria-hidden="true">
        <b>{String(mins).padStart(2, "0")}</b>
        <small>min</small>
      </div>
    </div>
  );
};

/* ---------- Página ---------- */

const HERO_TABS = [
  { kicker: "Futebol", title: "Campeão da Segunda Divisão, líder na elite" },
  { kicker: "Loja", title: "Nova camisa II: a coroa pesa" },
  { kicker: "Clube Meldina", title: "Planos desde R$ 14,90" },
];

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const autoplay = !reducedMotion && !userPaused && !hoverPaused;

  const [loaded, setLoaded] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [apiNextMatch, setApiNextMatch] = useState<Fixture | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const now = useNow(30000);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [p, nm, fx, st, nw] = await Promise.all([
          api.getPlayers(),
          api.getNextMatch(),
          api.getFixtures(),
          api.getStandings(),
          api.getNews(),
        ]);
        if (cancelled) return;
        setPlayers(asList(p, STATIC_PLAYERS));
        setApiNextMatch(nm && typeof nm.matchDate === "string" ? nm : null);
        setFixtures(asList(fx, STATIC_FIXTURES));
        setStandings(asList(st, STATIC_STANDINGS));
        setNews(asList(nw, STATIC_NEWS));
      } catch {
        if (cancelled) return;
        setPlayers(STATIC_PLAYERS);
        setFixtures(STATIC_FIXTURES);
        setStandings(STATIC_STANDINGS);
        setNews(STATIC_NEWS);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Slides inativos saem da ordem de tabulação e da árvore de acessibilidade.
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) el.inert = i !== activeSlide;
    });
  }, [activeSlide]);

  // O avanço do carrossel segue a animação da barra da aba ativa (tabfill, 7s),
  // então pausar a animação também pausa a troca de slide.
  const onTabAnimationEnd = (e: React.AnimationEvent) => {
    if (!autoplay || e.animationName !== "tabfill") return;
    setActiveSlide((s) => (s + 1) % SLIDE_COUNT);
  };

  const focusTab = useCallback((i: number) => {
    setActiveSlide(i);
    tabRefs.current[i]?.focus();
  }, []);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: (activeSlide + 1) % SLIDE_COUNT,
      ArrowLeft: (activeSlide - 1 + SLIDE_COUNT) % SLIDE_COUNT,
      Home: 0,
      End: SLIDE_COUNT - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      focusTab(keys[e.key]);
    }
  };

  const onHeroBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverPaused(false);
  };

  const nextMatch = pickNextMatch(apiNextMatch, fixtures, now);
  const lastResult = pickLastResult(fixtures);
  const topStandings = [...standings]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .slice(0, 4);

  const slideProps = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      slideRefs.current[i] = el;
    },
    id: `hero-slide-${i}`,
    role: "tabpanel",
    "aria-labelledby": `hero-tab-${i}`,
    className: `hero__slide ${activeSlide === i ? "is-active" : ""}`,
  });

  return (
    <div>
      {/* 1. HERO CAROUSEL */}
      <section
        className={`hero${autoplay ? "" : " is-paused"}`}
        id="hero"
        aria-roledescription="carrossel"
        aria-label="Destaques"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocus={() => setHoverPaused(true)}
        onBlur={onHeroBlur}
      >
        <img className="hero__bgmark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="hero__grain"></div>
        <div className="hero__slides wrap">
          {/* Slide 1 */}
          <article {...slideProps(0)}>
            <div className="hero__copy">
              <p className="eyebrow">Pro Clubs · Série A 2026</p>
              <h1 className="display">
                Muito além<br />
                <em>do jogo</em>
              </h1>
              <p>
                Campeão da Segunda Divisão em 2025, o Meldina perdeu a estreia na elite — e
                respondeu com cinco vitórias seguidas e a liderança.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/noticias/vitoria-sete-lagos">
                  Leia o relato <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="btn btn--ghost" to="/jogos">
                  Próximos jogos
                </Link>
              </div>
            </div>
            <div className="hero__media">
              <span className="hero__number" aria-hidden="true">9</span>
              <img src="/assets/players/almeida-9.jpg" alt="Almeida, camisa 9" {...{ fetchpriority: "high" }} />
            </div>
          </article>

          {/* Slide 2 */}
          <article {...slideProps(1)}>
            <div className="hero__copy">
              <p className="eyebrow">Nova camisa II · Lider</p>
              <h2 className="display">
                A coroa<br />
                <em>pesa</em>
              </h2>
              <p>
                Branca, com gola e punhos em grená e ouro. A nova camisa II do Meldina
                chegou para a estreia na elite — já na Loja Oficial.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/loja">
                  Ver na loja <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="btn btn--ghost" to="/noticias/camisa-ii-lider">
                  Conheça os detalhes
                </Link>
              </div>
            </div>
            <div className="hero__media hero__media--photo">
              <span className="hero__number" aria-hidden="true">II</span>
              <img src="/assets/img/camisa-2-modelo.jpg" alt="Modelo vestindo a camisa II do Meldina" decoding="async" {...{ fetchpriority: "low" }} />
            </div>
          </article>

          {/* Slide 3 */}
          <article {...slideProps(2)}>
            <div className="hero__copy">
              <p className="eyebrow">Programa oficial de sócios</p>
              <h2 className="display">
                Clube<br />
                <em>Meldina</em>
              </h2>
              <p>
                Prioridade na compra de ingressos, até 50% de desconto nos jogos, 15%
                off na loja e experiências exclusivas com o elenco.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/socio">
                  Quero ser sócio <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="btn btn--ghost" to="/socio">
                  Ver planos
                </Link>
              </div>
            </div>
            <div className="hero__media">
              <span className="hero__number" aria-hidden="true">10</span>
              <img src="/assets/players/carrijo-10.jpg" alt="Carrijo, camisa 10" decoding="async" {...{ fetchpriority: "low" }} />
            </div>
          </article>
        </div>

        {/* Hero Navigation Tabs */}
        <div className="hero__nav">
          <div className="wrap">
            <div className="hero__tabs" role="tablist" aria-label="Destaques" onKeyDown={onTabKeyDown}>
              {HERO_TABS.map((tab, i) => (
                <button
                  key={tab.kicker}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`hero-tab-${i}`}
                  role="tab"
                  aria-selected={activeSlide === i}
                  aria-controls={`hero-slide-${i}`}
                  tabIndex={activeSlide === i ? 0 : -1}
                  className={`hero__tab ${activeSlide === i ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(i)}
                  onAnimationEnd={onTabAnimationEnd}
                >
                  <small>{tab.kicker}</small>
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
            {!reducedMotion && (
              <button
                type="button"
                className="hero__pause"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Retomar a troca automática dos destaques" : "Pausar a troca automática dos destaques"}
              >
                {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. TICKER BAR */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ticker__item">
              <img src="/assets/img/escudo-mono.png" alt="" />
              <span>
                <b>Meldina FC</b> · Campeão da Segunda Divisão 2025 · Líder Série A 2026 · {MFC_INFO.lema}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MATCHBAR / MATCH CENTER */}
      <section className="matchbar" aria-label="Central de jogos" aria-busy={!loaded}>
        <div className="wrap">
          {/* Próximo Jogo */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Próxima partida</span>
              <b>{nextMatch?.competition || "Pro Clubs · Série A"}</b>
            </div>
            {!loaded ? (
              <div className="mc-skeleton" aria-hidden="true"></div>
            ) : nextMatch ? (
              (() => {
                const date = new Date(kickoff(nextMatch));
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
                  <>
                    <div className="fixture">
                      {nextMatch.isHome ? meldina : rival}
                      <div className="fixture__mid">
                        <time className="fixture__time" dateTime={nextMatch.matchDate}>
                          <span className="sr-only">{formatFull(date)}</span>
                          <span aria-hidden="true">{formatTime(date)}</span>
                        </time>
                        <div className="fixture__date" aria-hidden="true">{formatMatchDay(date)}</div>
                        {nextMatch.venue && (
                          <div className="fixture__venue">
                            <MapPin aria-hidden="true" />
                            <span>{nextMatch.venue}</span>
                          </div>
                        )}
                      </div>
                      {nextMatch.isHome ? rival : meldina}
                    </div>
                    <Countdown target={kickoff(nextMatch)} now={now} />
                  </>
                );
              })()
            ) : (
              <div className="mc-empty">
                <p>Próximo jogo a definir.</p>
                <Link className="link-arrow" to="/jogos">
                  Ver calendário <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {/* Último Resultado */}
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
                    <span>Último resultado</span>
                    {outcome && <span className={outcome.tagClass}>{outcome.label}</span>}
                  </div>
                  {!loaded ? (
                    <div className="mc-skeleton" aria-hidden="true"></div>
                  ) : lastResult ? (
                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="score" aria-hidden="true">
                        <span>{lastResult.homeScore}</span>
                        <i>×</i>
                        <span>{lastResult.awayScore}</span>
                      </div>
                      <p className="text-xs text-white/65 mt-2 uppercase tracking-wider text-center">
                        {homeName} {lastResult.homeScore} × {lastResult.awayScore} {awayName}
                        {lastResult.round ? ` · ${lastResult.round}` : ""}
                      </p>
                    </div>
                  ) : (
                    <div className="mc-empty">
                      <p>Nenhum jogo disputado nesta temporada.</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Classificação Resumida */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Tabela Série A</span>
              <Link to="/jogos" className="link-arrow">
                Completa <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {!loaded ? (
              <div className="mc-skeleton" aria-hidden="true"></div>
            ) : topStandings.length ? (
              <table className="mini-table">
                <caption className="sr-only">Quatro primeiros colocados da Série A</caption>
                <tbody>
                  {topStandings.map((s, idx) => {
                    const team = s.team ?? STATIC_TEAMS[s.teamId];
                    const isUs = s.teamId === "mfc" || team?.isUs;
                    return (
                      <tr key={s.teamId} className={isUs ? "is-us" : ""}>
                        <td>{s.position ?? idx + 1}º</td>
                        <td className="t">
                          <TeamBadge team={team} small />
                          <span>{team?.shortName || s.teamId}</span>
                        </td>
                        <td>{s.points} pts</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="mc-empty">
                <p>Tabela ainda não divulgada.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. NOTÍCIAS */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Últimas</p>
              <h2 className="display">Notícias</h2>
            </div>
            <Link className="link-arrow" to="/noticias">
              Todas as notícias <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          {loaded && news.length === 0 ? (
            <p className="text-tinta/70">Nenhuma notícia publicada ainda.</p>
          ) : (
            <div className="news-grid">
              {news.map((item, idx) => (
                <NewsCard key={item.id} item={item} feature={idx === 0} eager={idx === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. ELENCO RAIL */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Temporada 2026</p>
              <h2 className="display">Nosso elenco</h2>
            </div>
            <Link className="link-arrow" to="/elenco">
              Elenco completo <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          {loaded && players.length === 0 ? (
            <p className="text-white/70">Elenco ainda não divulgado.</p>
          ) : (
            <div className="squad-rail">
              {players.map((p) => (
                <PlayerCard key={p.id} player={p} onOpen={setSelectedPlayer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. MELDINA TV */}
      <section className="section tv">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>
                <img className="tv__logo" src="/assets/img/mtv-white.png" alt="Meldina TV" loading="lazy" decoding="async" />
              </h2>
              <p className="text-white/75 text-sm mt-3 max-w-md">
                MFC News, Meldcast, bastidores e melhores momentos no YouTube. Jogos ao vivo na Twitch.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn" href={MFC_INFO.youtube} target="_blank" rel="noopener noreferrer">
                Inscreva-se no YouTube
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              <a className="btn btn--ghost" href={MFC_INFO.twitch} target="_blank" rel="noopener noreferrer">
                Jogos ao vivo na Twitch
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOJA PRODUTOS EM DESTAQUE */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Loja oficial</p>
              <h2 className="display">Nova camisa II</h2>
            </div>
            <Link className="link-arrow" to="/loja">
              Ver toda a loja <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="kit-feature">
            <Link className="kit kit--product" to="/loja" aria-label="Camisa II Oficial, R$ 199,90. Ver na loja">
              <img src="/assets/img/camisa-2-produto.jpg" alt="" loading="lazy" decoding="async" />
              <div className="kit__body" aria-hidden="true">
                <p className="eyebrow">Lançamento · 2026</p>
                <h3 className="display">Camisa II Oficial</h3>
                <p className="kit__price">R$ 199,90</p>
                <span className="btn btn--sm">Ver na loja</span>
              </div>
            </Link>
            <Link className="kit kit--product" to="/loja" aria-label="Camisa I Oficial, R$ 199,90. Ver na loja">
              <img src="/assets/img/camisa-1-produto.jpg" alt="" loading="lazy" decoding="async" />
              <div className="kit__body" aria-hidden="true">
                <p className="eyebrow">Temporada 2026</p>
                <h3 className="display">Camisa I Oficial</h3>
                <p className="kit__price">R$ 199,90</p>
                <span className="btn btn--sm">Ver na loja</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SÓCIO CTA */}
      <section className="cta-band cta-band--socio">
        <div className="cta-band__img">
          <img src="/assets/players/gaab-12.jpg" alt="" loading="lazy" decoding="async" />
        </div>
        <img className="cta-band__crown" src="/assets/img/monograma-outline.png" alt="" loading="lazy" decoding="async" />
        <div className="wrap">
          <p className="eyebrow">Clube Meldina</p>
          <h2 className="display">
            Jogue junto com o <em>Meldina</em>
          </h2>
          <p>
            Faça parte da nossa história. Descontos em camisas oficiais, prioridade em ingressos e conteúdos exclusivos direto no WhatsApp.
          </p>
          <div className="stat-row">
            <div><b>20%</b><small>off em ingressos</small></div>
            <div><b>20%</b><small>off na loja</small></div>
            <div><b>R$ 14,90</b><small>a partir de / mês</small></div>
          </div>
          <div className="cta-band__actions">
            <Link to="/socio" className="btn btn--pulse">
              Quero ser sócio <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/socio" className="btn btn--ghost">
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      {selectedPlayer && (
        <PlayerDialog player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};
