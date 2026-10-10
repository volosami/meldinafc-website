import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Player } from "../types";
import { STATIC_PLAYERS } from "../data/staticData";
import { asList } from "../lib/format";
import { PlayerCard, PlayerDialog } from "../components/PlayerDialog";

export const Elenco: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<string>("todos");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getPlayers()
      .then((data) => !cancelled && setPlayers(asList(data, STATIC_PLAYERS)))
      .catch(() => !cancelled && setPlayers(STATIC_PLAYERS))
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = [
    { key: "todos", label: "Todos" },
    { key: "Goleiros", label: "Goleiros" },
    { key: "Defensores", label: "Defensores" },
    { key: "Meio-campistas", label: "Meio-campo" },
    { key: "Atacantes", label: "Ataque" },
  ];

  const visibleGroups = groups
    .filter((g) => g.key !== "todos" && (filter === "todos" || g.key === filter))
    .map((g) => ({
      ...g,
      players: players.filter((p) => p.group === g.key).sort((a, b) => a.number - b.number),
    }))
    .filter((g) => g.players.length > 0);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Elenco</span>
          </nav>
          <p className="eyebrow">Temporada 2026</p>
          <h1 className="display">Elenco</h1>
          <p>
            Os guerreiros que vestem o manto grená. Clique em um jogador para ver o perfil completo e as estatísticas da temporada.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {/* Filtro por abas */}
          <div className="tabs mb-12" role="group" aria-label="Filtrar por setor">
            {groups.map((g) => (
              <button
                key={g.key}
                type="button"
                aria-pressed={filter === g.key}
                className={`tab ${filter === g.key ? "is-active" : ""}`}
                onClick={() => setFilter(g.key)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {!loaded && <p className="text-white/70" role="status">Carregando elenco…</p>}
          {loaded && visibleGroups.length === 0 && (
            <p className="text-white/70">Nenhum jogador neste setor por enquanto.</p>
          )}

          {/* Atletas por setor */}
          {visibleGroups.map((g) => (
            <React.Fragment key={g.key}>
              <div className="group-title">
                <h2 className="display">{g.key}</h2>
                <span>
                  {g.players.length} {g.players.length === 1 ? "jogador" : "jogadores"}
                </span>
              </div>
              <div className="squad-grid">
                {g.players.map((p) => (
                  <PlayerCard key={p.id} player={p} onOpen={setSelectedPlayer} />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {selectedPlayer && (
        <PlayerDialog player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};
