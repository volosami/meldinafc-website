import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Fixture, Standing } from "../types";

export const Jogos: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [tab, setTab] = useState<"jogos" | "tabela">("jogos");

  useEffect(() => {
    async function load() {
      const [fx, st] = await Promise.all([api.getFixtures(), api.getStandings()]);
      setFixtures(fx);
      setStandings(st);
    }
    load();
  }, []);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Jogos & Tabela</span>
          </div>
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
          <div className="tabs mb-10">
            <button
              className={`tab ${tab === "jogos" ? "is-active" : ""}`}
              onClick={() => setTab("jogos")}
            >
              Calendário de Jogos
            </button>
            <button
              className={`tab ${tab === "tabela" ? "is-active" : ""}`}
              onClick={() => setTab("tabela")}
            >
              Tabela Série A
            </button>
          </div>

          {/* ABA 1: CALENDÁRIO DE JOGOS */}
          {tab === "jogos" && (
            <div className="fixtures">
              {fixtures.map((f) => {
                const isFinished = f.homeScore !== null && f.homeScore !== undefined;
                return (
                  <div key={f.id} className={`fx ${f.isNext ? "is-next" : ""}`}>
                    <div className="fx__when">
                      <b>{new Date(f.matchDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</b>
                      <small>
                        {new Date(f.matchDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </small>
                      <span className="fx__comp">{f.round}</span>
                    </div>

                    <div className="fx__match">
                      <div className="fx__team">
                        <span>{f.isHome ? "Meldina FC" : f.opponent?.name || f.opponentId}</span>
                        {f.isHome ? (
                          <img src="/assets/img/escudo.png" alt="Meldina FC" />
                        ) : f.opponentId === "desola" ? (
                          <img src="/assets/img/desola.png" alt="De Sola" />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                            {f.opponent?.acronym || "ADV"}
                          </span>
                        )}
                      </div>

                      <div className={`fx__score ${!isFinished ? "vs" : ""}`}>
                        {isFinished ? `${f.homeScore} × ${f.awayScore}` : "VS"}
                      </div>

                      <div className="fx__team">
                        {!f.isHome ? (
                          <img src="/assets/img/escudo.png" alt="Meldina FC" />
                        ) : f.opponentId === "desola" ? (
                          <img src="/assets/img/desola.png" alt="De Sola" />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                            {f.opponent?.acronym || "ADV"}
                          </span>
                        )}
                        <span>{!f.isHome ? "Meldina FC" : f.opponent?.name || f.opponentId}</span>
                      </div>
                    </div>

                    <div className="fx__act">
                      <span className="fx__venue">📍 {f.venue || "Lovebomb Arena"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ABA 2: TABELA DE CLASSIFICAÇÃO */}
          {tab === "tabela" && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Clube</th>
                    <th>J</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>GP</th>
                    <th>GC</th>
                    <th>SG</th>
                    <th>PTS</th>
                    <th>Forma</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, idx) => {
                    const isUs = s.teamId === "mfc";
                    return (
                      <tr key={s.teamId} className={isUs ? "is-us" : ""}>
                        <td>
                          <span className={`pos-badge ${idx < 4 ? "zone-g" : idx > 9 ? "zone-r" : ""}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="t">
                          {isUs ? (
                            <img src="/assets/img/escudo.png" alt="" />
                          ) : s.teamId === "desola" ? (
                            <img src="/assets/img/desola.png" alt="" />
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">
                              {s.team?.acronym || "FC"}
                            </span>
                          )}
                          <span>{s.team?.name || s.teamId}</span>
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
                            {s.form.split("").map((c, i) => (
                              <i
                                key={i}
                                className={c === "W" ? "w" : c === "D" ? "d" : "l"}
                              >
                                {c}
                              </i>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
