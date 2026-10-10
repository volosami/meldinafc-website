import React from "react";
import { MFC_INFO, TROPHIES, HISTORY } from "../data/staticData";

export const Clube: React.FC = () => {
  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>O Clube</span>
          </div>
          <p className="eyebrow">Meldina Futebol Clube</p>
          <h1 className="display">O Clube</h1>
          <p>
            Fundado em {MFC_INFO.fundacao}, no FIFA 18, o Meldina FC é dez vezes campeão da primeira divisão e campeão da Copa EA. Depois do título da Segunda Divisão em 2025, o clube volta à elite do Pro Clubs em 2026.
          </p>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <p className="eyebrow" style={{ color: "var(--grena)" }}>Nossa Origem</p>
              <h2 className="display text-4xl mb-6">Tradição e Garra</h2>
              <p className="lead font-serif">
                O Meldina Futebol Clube representa mais do que 11 jogadores em campo: é uma família forjada na superação.
              </p>
              <p>
                Em 2017, um grupo de amigos fundou o Meldina para disputar o Pro Clubs. Vieram a Copa EA, o tricampeonato da primeira divisão no FIFA 21 e sete títulos no FIFA 23. Em 2024, com o novo sistema da EA, uma nova geração assumiu o elenco e, liderada pelo presidente André Almeida e pelo vice Carrijo, levantou a taça da Segunda Divisão em 2025.
              </p>
              <p>
                Hoje, sob o comando tático do professor Celso Roth, o Meldina é o líder da Série A e busca consolidar seu nome entre os maiores clubes virtuais do país.
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
            <p className="trophy-total"><b>{TROPHIES.reduce((n, t) => n + t.count, 0)}</b> títulos na história</p>
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
                <span className="tl__y">{h.year}<small>{h.game}</small></span>
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
