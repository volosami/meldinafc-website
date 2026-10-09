import React from "react";
import { MFC_INFO } from "../data/staticData";

export const Clube: React.FC = () => {
  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>O Clube</span>
          </div>
          <p className="eyebrow">Institucional</p>
          <h1 className="display">
            A paixão<br />
            <em>que move</em>
          </h1>
          <p>
            Fundado em {MFC_INFO.fundacao}, o Meldina FC nasceu da união de torcedores apaixonados e conquistou o título da Série B de 2025 para chegar à elite do Pro Clubs.
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
                Em 2024, um grupo de amigos decidiu fundar o Meldina para disputar ligas de alto nível. Com raça em cada dividida e liderança do presidente André Almeida e do vice Carrijo, o clube subiu degrau por degrau até levantar a taça da Série B em 2025.
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
      <section className="section section--creme" id="trofeus">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ color: "var(--grena)" }}>Conquistas</p>
              <h2 className="display">Sala de Troféus</h2>
            </div>
          </div>
          <div className="bg-white p-8 rounded border border-linha-clara flex flex-col md:flex-row items-center gap-8 text-tinta">
            <div className="text-6xl text-ouro">🏆</div>
            <div>
              <span className="font-regal text-xs text-grena uppercase tracking-widest font-bold block">Temporada 2025</span>
              <h3 className="font-display text-3xl uppercase mt-1">Campeão Pro Clubs · Série B</h3>
              <p className="text-sm text-gray-600 mt-2">
                Campanha histórica com 14 vitórias, melhor ataque e acesso garantido com 3 rodadas de antecedência.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
