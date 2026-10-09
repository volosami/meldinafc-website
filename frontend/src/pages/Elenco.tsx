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

  const filteredPlayers =
    filter === "todos"
      ? players
      : players.filter((p) => p.group === filter);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Elenco</span>
          </div>
          <p className="eyebrow">Temporada 2026</p>
          <h1 className="display">
            Guerreiros<br />
            <em>em campo</em>
          </h1>
          <p>
            Conheça os atletas que vestem a camisa grená e ouro na disputa da elite da Série A do Pro Clubs.
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

          {/* Grid de Atletas */}
          <div className="squad-grid">
            {filteredPlayers.map((p) => (
              <button
                key={p.id}
                className={`player-card ${p.position === "Goleiro" ? "player-card--gk" : ""}`}
                onClick={() => setSelectedPlayer(p)}
              >
                <img src={p.photoUrl} alt={p.name} />
                <span className="player-card__num">{p.number}</span>
                <div className="player-card__info">
                  <div>
                    <span className="player-card__pos">{p.position}</span>
                    <span className="player-card__name">{p.name}</span>
                  </div>
                  <span className="player-card__n">{p.number}</span>
                </div>
                <span className="player-card__bar"></span>
              </button>
            ))}
          </div>
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
