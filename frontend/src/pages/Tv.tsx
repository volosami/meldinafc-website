import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { MFC_INFO } from "../data/staticData";
import { FallbackImage } from "../components/ui/FallbackImage";

const NEW_TAB = <span className="sr-only"> (abre em nova aba)</span>;

export const Tv: React.FC = () => {
  const videos = [
    {
      id: "v1",
      title: "Bastidores da Vitória Histórica sobre o Sete Lagos",
      show: "Meldina Inside",
      dur: "14:20",
      thumb: "/assets/news/escalacao-carrijo.jpg",
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
      thumb: "/assets/img/camisa-2.jpg",
      date: "20 de Setembro, 2026",
    },
  ];

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Meldina TV</span>
          </nav>
          <h1 className="page-hero__logo">
            <img src="/assets/img/mtv-white.png" alt="Meldina TV" />
          </h1>
          <p>
            Bastidores, entrevistas, podcasts e resenhas no YouTube. Os jogos do Meldina FC são transmitidos ao vivo na Twitch.
          </p>
        </div>
      </section>

      <section className="section section--tight live-band">
        <div className="wrap live-band__inner">
          <div>
            <p className="eyebrow">Ao vivo · Twitch</p>
            <h2 className="display">Todos os jogos, ao vivo</h2>
            <p className="text-white/75 text-sm mt-3 max-w-xl">
              Acompanhe as partidas do Meldina FC exclusivamente no canal da Twitch.
            </p>
          </div>
          <a
            className="btn btn--twitch"
            href={MFC_INFO.twitch}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
            Assistir na Twitch
            {NEW_TAB}
          </a>
        </div>
      </section>

      <section className="section tv">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>
                <img className="tv__logo" src="/assets/img/mtv-white.png" alt="Vídeos da Meldina TV" loading="lazy" />
              </h2>
              <p className="text-white/75 text-sm mt-3 max-w-md">
                Vídeos semanais com o elenco e comissão técnica.
              </p>
            </div>
            <a
              className="btn"
              href={MFC_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Canal no YouTube <ArrowRight aria-hidden="true" />
              {NEW_TAB}
            </a>
          </div>

          <div className="video-grid">
            {/* Vídeo Principal */}
            <a
              href={MFC_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="video"
              aria-label={`${videos[0].title}, ${videos[0].show}, ${videos[0].dur}. Assistir no YouTube (abre em nova aba)`}
            >
              <div className="video__thumb">
                <FallbackImage src={videos[0].thumb} alt="" className="bg" loading="lazy" />
                <div className="video__overlay">
                  <span className="video__show">
                    <small>{videos[0].show}</small>
                    {videos[0].title}
                  </span>
                </div>
                <span className="video__dur">{videos[0].dur}</span>
                <span className="video__play" aria-hidden="true"><Play /></span>
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
                  aria-label={`${v.title}, ${v.show}, ${v.dur}. Assistir no YouTube (abre em nova aba)`}
                >
                  <div className="video__thumb">
                    <FallbackImage src={v.thumb} alt="" className="bg" loading="lazy" />
                    <span className="video__play" aria-hidden="true"><Play /></span>
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
