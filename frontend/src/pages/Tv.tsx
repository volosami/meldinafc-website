import React from "react";
import { MFC_INFO } from "../data/staticData";

export const Tv: React.FC = () => {
  const videos = [
    {
      id: "v1",
      title: "Bastidores da Vitória Histórica sobre o Sete Lagos",
      show: "Meldina Inside",
      dur: "14:20",
      thumb: "/assets/news/sete-lagos.jpg",
      date: "22 de Setembro, 2026",
    },
    {
      id: "v2",
      title: "Meldcast #08 · Celso Roth fala sobre a liderança da Série A",
      show: "Meldcast",
      dur: "48:15",
      thumb: "/assets/news/quotes-celso.jpg",
      date: "19 de Setembro, 2026",
    },
    {
      id: "v3",
      title: "Melhores Momentos: Real Ventura 1 × 2 Meldina FC",
      show: "Gols da Rodada",
      dur: "06:45",
      thumb: "/assets/news/pelo-acesso.jpg",
      date: "14 de Setembro, 2026",
    },
    {
      id: "v4",
      title: "Apresentação do Manto II · Bastidores do ensaio oficial",
      show: "Especial",
      dur: "08:30",
      thumb: "/assets/news/camisas.jpg",
      date: "20 de Setembro, 2026",
    },
  ];

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Meldina TV</span>
          </div>
          <p className="eyebrow">Canal Oficial</p>
          <h1 className="display">
            A voz<br />
            <em>do vestiário</em>
          </h1>
          <p>
            Assista aos bastidores, entrevistas exclusivas, transmissões de jogos e resenhas no canal oficial do Meldina FC no YouTube.
          </p>
        </div>
      </section>

      <section className="section tv">
        <div className="wrap">
          <div className="section-head">
            <div>
              <img className="tv__logo" src="/assets/img/mtv-white.png" alt="Meldina TV" />
              <p className="text-gray-300 text-sm mt-3 max-w-md">
                Vídeos semanais com o elenco e comissão técnica.
              </p>
            </div>
            <a
              className="btn"
              href={MFC_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Canal no YouTube →
            </a>
          </div>

          <div className="video-grid">
            {/* Vídeo Principal */}
            <a
              href={MFC_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="video"
            >
              <div className="video__thumb">
                <img src={videos[0].thumb} alt="" className="bg" />
                <div className="video__overlay">
                  <span className="video__show">
                    <small>{videos[0].show}</small>
                    {videos[0].title}
                  </span>
                </div>
                <span className="video__dur">{videos[0].dur}</span>
                <span className="video__play">▶</span>
              </div>
              <div className="video__title">{videos[0].title}</div>
              <div className="video__meta">{videos[0].date}</div>
            </a>

            {/* Lista Lateral */}
            <div className="video-list">
              {videos.slice(1).map((v) => (
                <a
                  key={v.id}
                  href={MFC_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video video--row"
                >
                  <div className="video__thumb">
                    <img src={v.thumb} alt="" className="bg" />
                    <span className="video__play">▶</span>
                  </div>
                  <div>
                    <div className="video__show">
                      <small className="text-xs text-ouro font-bold uppercase">{v.show}</small>
                    </div>
                    <div className="video__title text-sm">{v.title}</div>
                    <div className="video__meta text-xs">{v.date}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
