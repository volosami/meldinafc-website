import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { MFC_INFO, TROPHIES, HISTORY } from "../data/staticData";

interface ClubInfoState {
  stadium: string;
  season: number;
  foundationYear: number;
  coach: string;
  president: string;
  league: string;
  division: string;
  programName: string;
  motto: string;
}

export const Clube: React.FC = () => {
  const [club, setClub] = useState<ClubInfoState>({
    stadium: MFC_INFO.estadio,
    season: MFC_INFO.temporada,
    foundationYear: MFC_INFO.fundacao,
    coach: MFC_INFO.tecnico,
    president: MFC_INFO.presidente,
    league: MFC_INFO.liga,
    division: MFC_INFO.divisao,
    programName: MFC_INFO.programa,
    motto: MFC_INFO.lema,
  });

  useEffect(() => {
    let cancelled = false;
    api
      .getClubInfo()
      .then((data) => {
        if (cancelled || !data) return;
        setClub((prev) => ({
          stadium: data.stadium || prev.stadium,
          season: Number(data.season) || prev.season,
          foundationYear: Number(data.foundationYear) || prev.foundationYear,
          coach: data.coach || prev.coach,
          president: data.president || prev.president,
          league: data.league || prev.league,
          division: data.division || prev.division,
          programName: data.programName || prev.programName,
          motto: data.motto || prev.motto,
        }));
      })
      .catch(() => {
        // Fallback para MFC_INFO estático
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">O Clube</span>
          </nav>
          <p className="eyebrow">Institucional · {club.motto}</p>
          <h1 className="display">O Clube</h1>
          <p>
            Fundado em {club.foundationYear}, no FIFA 18, o Meldina FC é dez vezes campeão da
            primeira divisão e campeão da Copa EA. Depois do título da Segunda Divisão em 2025, o
            clube volta à elite do {club.league} ({club.division}) em {club.season}, mandando seus
            jogos na {club.stadium}.
          </p>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <p className="eyebrow" style={{ color: "var(--grena)" }}>
                Nossa Origem
              </p>
              <h2 className="display text-4xl mb-6">Tradição e Garra</h2>
              <p className="lead font-serif">
                O Meldina Futebol Clube representa mais do que 11 jogadores em campo: é uma família
                forjada na superação — {club.motto.toLowerCase()}.
              </p>
              <p>
                Em {club.foundationYear}, um grupo de amigos fundou o Meldina para disputar o{" "}
                {club.league}. Vieram a Copa EA, o tricampeonato da primeira divisão no FIFA 21 e
                sete títulos no FIFA 23. Em 2024, com o novo sistema da EA, uma nova geração assumiu
                o elenco e, liderada pelo presidente {club.president} e pelo vice Carrijo, levantou
                a taça da Segunda Divisão em 2025.
              </p>
              <p>
                Hoje, sob o comando tático do professor {club.coach} e com a força da torcida na{" "}
                {club.stadium}, o Meldina disputa a {club.division} de {club.season} e busca
                consolidar seu nome entre os maiores clubes virtuais do país.
              </p>
            </div>
            <div className="crest-stage">
              <img src="/assets/img/escudo.png" alt="Escudo Oficial" />
            </div>
          </div>
        </div>
      </section>

      {/* SALA DE TROFÉUS */}
      <section className="section trophy-room" id="trofeus">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Glórias</p>
              <h2 className="display">Sala de Troféus</h2>
            </div>
            <p className="trophy-total">
              <b>{TROPHIES.reduce((n, t) => n + t.count, 0)}</b> títulos na história
            </p>
          </div>
          <ol className="trophy-tl">
            {TROPHIES.map((t, i) => (
              <li key={t.id} className={`trophy-tl__item ${i % 2 ? "is-left" : "is-right"}`}>
                <svg className="trophy-tl__star" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 1.5 3.1 7.1 7.7.7-5.8 5.1 1.7 7.6L12 18l-6.7 4 1.7-7.6-5.8-5.1 7.7-.7Z" />
                </svg>
                <article className="trophy-card">
                  <div className="trophy-card__media">
                    <img src={t.image} alt={`Troféu ${t.title} ${t.game}`} loading="lazy" />
                    {t.count > 1 && <span className="trophy-card__count">{t.count}×</span>}
                  </div>
                  <div className="trophy-card__year">
                    {t.year}
                    <small>{t.game}</small>
                  </div>
                  <div className="trophy-card__title">
                    {t.title}
                    <small>{t.competition}</small>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LINHA DO TEMPO */}
      <section className="section" style={{ background: "var(--noite-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Linha do tempo</p>
              <h2 className="display">Trajetória</h2>
            </div>
          </div>
          <div className="timeline">
            {HISTORY.map((h) => (
              <div key={h.year} className="tl">
                <span className="tl__y">
                  {h.year}
                  <small>{h.game}</small>
                </span>
                <div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
