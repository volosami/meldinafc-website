import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Player } from "../types";

export const Elenco: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState<string>("todos");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    async function load() {
      const data = await api.getPlayers();
      setPlayers(data);
    }
    load();
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
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Elenco</span>
          </div>
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
          <div className="tabs mb-12">
            {groups.map((g) => (
              <button
                key={g.key}
                className={`tab ${filter === g.key ? "is-active" : ""}`}
                onClick={() => setFilter(g.key)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Atletas por setor */}
          {visibleGroups.map((g) => (
            <React.Fragment key={g.key}>
              <div className="group-title">
                <h2 className="display">{g.key}</h2>
                <span>
                  {g.players.length} {g.players.length > 1 ? "JOGADORES" : "JOGADOR"}
                </span>
              </div>
              <div className="squad-grid">
                {g.players.map((p) => (
                  <button
                    key={p.id}
                    className={`player-card ${p.position === "Goleiro" ? "player-card--gk" : ""}`}
                    onClick={() => setSelectedPlayer(p)}
                  >
                    <img src={p.photoUrl} alt={p.name} />
                    <span className="player-card__num">{p.number}</span>
                    <div className="player-card__info">
                      <div>
                        {p.isCaptain && <span className="captain captain--sm">C</span>}
                        <span className="player-card__pos">{p.position}</span>
                        <span className="player-card__name">{p.name}</span>
                      </div>
                      <span className="player-card__n">{p.number}</span>
                    </div>
                    <span className="player-card__bar"></span>
                  </button>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* MODAL DETALHE DO JOGADOR */}
      {selectedPlayer && (
        <div className="modal is-open">
          <div className="modal__backdrop" onClick={() => setSelectedPlayer(null)}></div>
          <div className="modal__box">
            <button
              className="modal__close"
              onClick={() => setSelectedPlayer(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="profile">
              <div className={`profile__media ${selectedPlayer.position === "Goleiro" ? "gk" : ""}`}>
                <img src={selectedPlayer.photoUrl} alt={selectedPlayer.name} />
                <span className="num">{selectedPlayer.number}</span>
              </div>
              <div className="profile__body">
                <p className="eyebrow">{selectedPlayer.position}</p>
                <h2 className="display">{selectedPlayer.name}</h2>
                <div className="profile__meta">
                  <div>
                    <small>Pé preferido</small>
                    <b>{selectedPlayer.preferredFoot}</b>
                  </div>
                  <div>
                    <small>No clube desde</small>
                    <b>{selectedPlayer.joinedYear}</b>
                  </div>
                </div>
                <div className="stats">
                  <div className="stat">
                    <b>{selectedPlayer.matches}</b>
                    <small>Jogos</small>
                  </div>
                  <div className="stat">
                    <b>{selectedPlayer.goals}</b>
                    <small>Gols</small>
                  </div>
                  <div className="stat">
                    <b>{selectedPlayer.assists}</b>
                    <small>Assistências</small>
                  </div>
                  {selectedPlayer.extraKey && (
                    <div className="stat">
                      <b>{selectedPlayer.extraValue}</b>
                      <small>{selectedPlayer.extraKey}</small>
                    </div>
                  )}
                </div>
                <p className="profile__bio">{selectedPlayer.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
