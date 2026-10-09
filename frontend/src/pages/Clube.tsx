import React from "react";
import { MFC_INFO, TROPHIES, HISTORY } from "../data/staticData";

const TrophyArt: React.FC<{ mark: string }> = ({ mark }) => (
  <svg viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset=".45" stopColor="#efaa19" />
        <stop offset="1" stopColor="#9a6a06" />
      </linearGradient>
    </defs>
    <path d="M30 14h60v30c0 22-13 38-30 42-17-4-30-20-30-42Z" fill="url(#gold)" />
    <path d="M30 22H14c0 20 8 30 20 32M90 22h16c0 20-8 30-20 32" fill="none" stroke="url(#gold)" strokeWidth="6" strokeLinecap="round" />
    <path d="M54 86h12v22H54Z" fill="url(#gold)" />
    <path d="M38 108h44l6 16H32Z" fill="url(#gold)" />
    <rect x="26" y="124" width="68" height="16" rx="2" fill="#5a000a" />
    <path d="m46 4 6 8 8-9 8 9 6-8v10H46Z" fill="url(#gold)" />
    <text x="60" y="54" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize={mark.length > 1 ? 20 : 26} fill="#5a000a">{mark}</text>
  </svg>
);

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
            Fundado em {MFC_INFO.fundacao}, no FIFA 18, o Meldina FC é dez vezes campeão da primeira divisão e campeão da Copa EA. Depois do título da Série B em 2025, o clube volta à elite do Pro Clubs em 2026.
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
                Em 2017, um grupo de amigos fundou o Meldina para disputar o Pro Clubs. Vieram a Copa EA, o tricampeonato da primeira divisão no FIFA 21 e sete títulos no FIFA 23. Em 2024, com o novo sistema da EA, uma nova geração assumiu o elenco e, liderada pelo presidente André Almeida e pelo vice Carrijo, levantou a taça da Série B em 2025.
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

      {/* IDENTIDADE E CORES */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Identidade Visual</p>
              <h2 className="display">Cores Oficiais</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-grena p-8 rounded border border-white/10">
              <span className="font-display text-3xl uppercase tracking-wider block">Grená</span>
              <span className="text-xs text-white/70 block mt-1 font-mono">#8F0010</span>
              <p className="text-sm text-white/80 mt-4">Simboliza o sangue, a luta e a paixão inegociável da torcida.</p>
            </div>
            <div className="bg-ouro p-8 rounded text-noite">
              <span className="font-display text-3xl uppercase tracking-wider block">Ouro</span>
              <span className="text-xs text-noite/70 block mt-1 font-mono">#EFAA19</span>
              <p className="text-sm text-noite/80 mt-4">A coroa, a glória e a busca incessante pelos títulos.</p>
            </div>
            <div className="bg-marinho p-8 rounded border border-white/10">
              <span className="font-display text-3xl uppercase tracking-wider block">Marinho</span>
              <span className="text-xs text-white/70 block mt-1 font-mono">#001065</span>
              <p className="text-sm text-white/80 mt-4">A sobriedade, a tradição e a firmeza institucional do clube.</p>
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
          <div className="grid gap-6">
            {TROPHIES.map((t) => (
              <article key={t.id} className="trophy">
                <div className="trophy__art">
                  <TrophyArt mark={t.mark} />
                  <span className="trophy__count">{t.count}×</span>
                </div>
                <div className="trophy__body">
                  <p className="eyebrow">{t.competition}</p>
                  <h3 className="display">{t.title}</h3>
                  <div className="trophy__years">
                    {t.seasons.map((s) => <span key={s}>{s}</span>)}
                  </div>
                  <p>{t.desc}</p>
                </div>
              </article>
            ))}
          </div>
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
