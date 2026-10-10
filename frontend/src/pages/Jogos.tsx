import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { api } from "../services/api";
import { Fixture, Standing } from "../types";
import { STATIC_FIXTURES, STATIC_STANDINGS, STATIC_TEAMS } from "../data/staticData";
import { asList, formatDayMonth, formatFull, formatTime, safeDate } from "../lib/format";
import { isPlayed, opponentOf, outcomeOf, pickNextMatch, sortByDate } from "../lib/fixtures";
import { TeamBadge } from "../components/ui/TeamBadge";

type TabKey = "jogos" | "tabela";
const TABS: { key: TabKey; label: string }[] = [
  { key: "jogos", label: "Calendário de Jogos" },
  { key: "tabela", label: "Tabela Série A" },
];

const FORM_LABEL: Record<string, { short: string; long: string; cls: string }> = {
  W: { short: "V", long: "Vitória", cls: "w" },
  D: { short: "E", long: "Empate", cls: "d" },
  L: { short: "D", long: "Derrota", cls: "l" },
};

export const Jogos: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<TabKey>("jogos");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getFixtures(), api.getStandings()])
      .then(([fx, st]) => {
        if (cancelled) return;
        setFixtures(asList(fx, STATIC_FIXTURES));
        setStandings(asList(st, STATIC_STANDINGS));
      })
      .catch(() => {
        if (cancelled) return;
        setFixtures(STATIC_FIXTURES);
        setStandings(STATIC_STANDINGS);
      })
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const ordered = sortByDate(fixtures);
  const nextMatch = pickNextMatch(null, ordered, Date.now());
  const table = [...standings].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.key === tab);
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].key);
    tabRefs.current[next]?.focus();
  };

  const meldina = STATIC_TEAMS.mfc;

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Jogos & Tabela</span>
          </nav>
          <p className="eyebrow">Pro Clubs · Série A 2026</p>
          <h1 className="display">
            Calendário<br />
            <em>& Classificação</em>
          </h1>
          <p>
            Acompanhe a trajetória do Meldina FC na elite: tabela atualizada em tempo real, resultados anteriores e próximas batalhas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {/* Abas */}
          <div className="tabs mb-10" role="tablist" aria-label="Jogos e tabela" onKeyDown={onTabKeyDown}>
            {TABS.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`jogos-tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls={`jogos-panel-${t.key}`}
                tabIndex={tab === t.key ? 0 : -1}
                className={`tab ${tab === t.key ? "is-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {!loaded && <p className="text-white/70" role="status">Carregando jogos…</p>}

          {/* ABA 1: CALENDÁRIO DE JOGOS */}
          {loaded && tab === "jogos" && (
            <div role="tabpanel" id="jogos-panel-jogos" aria-labelledby="jogos-tab-jogos">
              {ordered.length === 0 ? (
                <p className="text-white/70">O calendário da temporada ainda não foi divulgado.</p>
              ) : (
                <ol className="fixtures">
                  {ordered.map((f) => {
                    const finished = isPlayed(f);
                    const date = safeDate(f.matchDate);
                    const opp = opponentOf(f);
                    const oppName = opp?.name || f.opponentId;
                    const home = f.isHome ? { team: meldina, name: "Meldina FC" } : { team: opp, name: oppName };
                    const away = f.isHome ? { team: opp, name: oppName } : { team: meldina, name: "Meldina FC" };
                    const outcome = finished ? outcomeOf(f) : null;
                    const venue = f.venue || (f.isHome ? "Lovebomb Arena" : null);
                    const summary = finished
                      ? `${home.name} ${f.homeScore} a ${f.awayScore} ${away.name}, ${outcome!.label.toLowerCase()} do Meldina`
                      : `${home.name} contra ${away.name}`;
                    return (
                      <li key={f.id} className={`fx ${nextMatch?.id === f.id ? "is-next" : ""}`}>
                        <div className="fx__when">
                          {date ? (
                            <time dateTime={f.matchDate}>
                              <span className="sr-only">{formatFull(date)}</span>
                              <b aria-hidden="true">{formatDayMonth(date)}</b>
                              <small aria-hidden="true">{formatTime(date)}</small>
                            </time>
                          ) : (
                            <b>Data a definir</b>
                          )}
                          <span className="fx__comp">{f.round}</span>
                        </div>

                        <div className="fx__match">
                          <div className="fx__team" aria-hidden="true">
                            <span>{home.name}</span>
                            <TeamBadge team={home.team} />
                          </div>
                          <div className={`fx__score ${!finished ? "vs" : ""}`} aria-hidden="true">
                            {finished ? `${f.homeScore} × ${f.awayScore}` : "VS"}
                          </div>
                          <div className="fx__team" aria-hidden="true">
                            <TeamBadge team={away.team} />
                            <span>{away.name}</span>
                          </div>
                          <span className="sr-only">{summary}</span>
                        </div>

                        <div className="fx__act">
                          {outcome && <span className={outcome.tagClass}>{outcome.label}</span>}
                          {nextMatch?.id === f.id && <span className="result-tag t-next">Próximo jogo</span>}
                          {venue && (
                            <span className="fx__venue">
                              <MapPin aria-hidden="true" /> {venue}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          )}

          {/* ABA 2: TABELA DE CLASSIFICAÇÃO */}
          {loaded && tab === "tabela" && (
            <div role="tabpanel" id="jogos-panel-tabela" aria-labelledby="jogos-tab-tabela">
              {table.length === 0 ? (
                <p className="text-white/70">A tabela ainda não foi divulgada.</p>
              ) : (
                <>
                  <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabela da Série A, role para os lados">
                    <table className="table">
                      <caption className="sr-only">Classificação da Série A 2026</caption>
                      <thead>
                        <tr>
                          <th scope="col">Pos</th>
                          <th scope="col">Clube</th>
                          <th scope="col"><abbr title="Jogos">J</abbr></th>
                          <th scope="col"><abbr title="Vitórias">V</abbr></th>
                          <th scope="col"><abbr title="Empates">E</abbr></th>
                          <th scope="col"><abbr title="Derrotas">D</abbr></th>
                          <th scope="col"><abbr title="Gols pró">GP</abbr></th>
                          <th scope="col"><abbr title="Gols contra">GC</abbr></th>
                          <th scope="col"><abbr title="Saldo de gols">SG</abbr></th>
                          <th scope="col"><abbr title="Pontos">PTS</abbr></th>
                          <th scope="col">Últimos jogos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.map((s, idx) => {
                          const team = s.team ?? STATIC_TEAMS[s.teamId];
                          const isUs = s.teamId === "mfc" || team?.isUs;
                          const pos = s.position ?? idx + 1;
                          const zone = idx < 4 ? "zone-g" : idx >= table.length - 2 ? "zone-r" : "";
                          return (
                            <tr key={s.teamId} className={isUs ? "is-us" : ""}>
                              <td>
                                <span className={`pos-badge ${zone}`}>{pos}</span>
                                {zone === "zone-g" && <span className="sr-only"> (zona de classificação)</span>}
                                {zone === "zone-r" && <span className="sr-only"> (zona de rebaixamento)</span>}
                              </td>
                              <td className="t">
                                <TeamBadge team={team} small />
                                <span>{team?.name || s.teamId}</span>
                              </td>
                              <td>{s.matches}</td>
                              <td>{s.wins}</td>
                              <td>{s.draws}</td>
                              <td>{s.losses}</td>
                              <td>{s.goalsFor}</td>
                              <td>{s.goalsAgainst}</td>
                              <td>{s.goalDiff}</td>
                              <td className="pts text-ouro font-bold">{s.points}</td>
                              <td>
                                <div className="form-dots">
                                  {(s.form ?? "").split("").map((c, i) => {
                                    const f = FORM_LABEL[c] ?? FORM_LABEL.L;
                                    return (
                                      <i key={i} className={f.cls} title={f.long}>
                                        <span aria-hidden="true">{f.short}</span>
                                        <span className="sr-only">{f.long}</span>
                                      </i>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="table-legend">
                    <span><i className="pos-badge zone-g" aria-hidden="true"></i> Zona de classificação</span>
                    <span><i className="pos-badge zone-r" aria-hidden="true"></i> Zona de rebaixamento</span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
