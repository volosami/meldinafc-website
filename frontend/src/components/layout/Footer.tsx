import React from "react";
import { Link } from "react-router-dom";
import { MFC_INFO } from "../../data/staticData";

export const Footer: React.FC = () => {
  return (
    <>
      {/* Parceiros */}
      <section className="partners" aria-label="Parceiros">
        <div className="wrap">
          <div className="partner">
            <small>Patrocinador oficial</small>
            <img className="nufut" src="/assets/img/nufut.png" alt="nuFUT" />
          </div>
          <div className="partner">
            <small>Fornecedor oficial</small>
            <img className="lider-logo" src="/assets/img/lider.png" alt="Lider Sport" />
          </div>
          <div className="partner">
            <small>Mídia oficial</small>
            <img className="mtv" src="/assets/img/mtv-white.png" alt="Meldina TV" />
          </div>
          <div className="partner">
            <small>Programa oficial</small>
            <img className="cm-logo cm-logo--partner" src="/assets/img/clube-meldina/cm-white.svg" alt="Clube Meldina" width={1500} height={915} loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div className="footer__brand">
              <img src="/assets/img/escudo-sm.png" alt="Meldina FC" />
              <p>Meldina Futebol Clube: Muito Além do Jogo</p>
              <div className="socials">
                <a href={MFC_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href={MFC_INFO.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9L15.5 12l-5.8 3.1Z" />
                  </svg>
                </a>
                <a href={MFC_INFO.twitch} target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4>Clube</h4>
              <ul>
                <li><Link to="/clube">História</Link></li>
                <li><Link to="/clube#trofeus">Sala de troféus</Link></li>
                <li><Link to="/elenco">Elenco</Link></li>
                <li><Link to="/admin/login">Área da Diretoria</Link></li>
              </ul>
            </div>
            <div>
              <h4>Futebol</h4>
              <ul>
                <li><Link to="/jogos">Calendário</Link></li>
                <li><Link to="/jogos">Classificação</Link></li>
                <li><Link to="/noticias">Notícias</Link></li>
                <li><Link to="/tv">Meldina TV</Link></li>
              </ul>
            </div>
            <div>
              <h4>Torcedor</h4>
              <ul>
                <li><Link to="/socio">Clube Meldina</Link></li>
                <li><Link to="/loja">Loja Oficial</Link></li>
                <li><a href={MFC_INFO.twitch} target="_blank" rel="noopener noreferrer">Jogos ao vivo (Twitch)</a></li>
                <li><a href={MFC_INFO.instagram} target="_blank" rel="noopener noreferrer">@meldinafc</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="wrap footer__bottom">
          <span>© {MFC_INFO.temporada} Meldina Futebol Clube. Todos os direitos reservados.</span>
        </div>
      </footer>
    </>
  );
};
