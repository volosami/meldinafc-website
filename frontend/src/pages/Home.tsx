import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Player, Fixture, Standing, NewsArticle } from "../types";
import { MFC_INFO } from "../data/staticData";

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [nextMatch, setNextMatch] = useState<Fixture | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    async function loadData() {
      const [p, nm, fx, st, nw] = await Promise.all([
        api.getPlayers(),
        api.getNextMatch(),
        api.getFixtures(),
        api.getStandings(),
        api.getNews(),
      ]);
      setPlayers(p);
      setNextMatch(nm);
      setFixtures(fx);
      setStandings(st);
      setNews(nw);
    }
    loadData();
  }, []);

  // Auto-play hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const lastFinishedMatch = fixtures.filter((f) => f.homeScore !== null && f.homeScore !== undefined).slice(-1)[0];

  return (
    <div>
      {/* 1. HERO CAROUSEL */}
      <section className="hero" id="hero" aria-label="Destaques">
        <img
          className="hero__bgmark"
          src="/assets/img/monograma-outline.png"
          alt=""
        />
        <div className="hero__grain"></div>
        <div className="hero__slides wrap">
          {/* Slide 1 */}
          <article className={`hero__slide ${activeSlide === 0 ? "is-active" : ""}`}>
            <div className="hero__copy">
              <p className="eyebrow">Pro Clubs · Série A 2026</p>
              <h1 className="display">
                Muito além<br />
                <em>do jogo</em>
              </h1>
              <p>
                Campeão da Série B em 2025, o Meldina perdeu a estreia na elite — e
                respondeu com cinco vitórias seguidas e a liderança. No domingo, 4 de
                outubro, tem clássico contra o vice-líder De Sola.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/noticias/vitoria-sete-lagos">
                  Leia o relato →
                </Link>
                <Link className="btn btn--ghost" to="/jogos">
                  Próximos jogos
                </Link>
              </div>
            </div>
            <div className="hero__media">
              <span className="hero__number">9</span>
              <img src="/assets/players/almeida-9.jpg" alt="Almeida, camisa 9" />
            </div>
          </article>

          {/* Slide 2 */}
          <article className={`hero__slide ${activeSlide === 1 ? "is-active" : ""}`}>
            <div className="hero__copy">
              <p className="eyebrow">Nova camisa II · Lider</p>
              <h2 className="display">
                A coroa<br />
                <em>pesa</em>
              </h2>
              <p>
                Branca, com gola e punhos em grená e ouro. A nova camisa II do Meldina
                chegou para a estreia na elite — já à venda na Loja Oficial.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/loja">
                  Comprar agora →
                </Link>
                <Link className="btn btn--ghost" to="/noticias/camisa-ii-lider">
                  Conheça os detalhes
                </Link>
              </div>
            </div>
            <div className="hero__media hero__media--photo">
              <span className="hero__number">II</span>
              <img src="/assets/img/camisa-2-modelo.jpg" alt="Camisa II modelo" />
            </div>
          </article>

          {/* Slide 3 */}
          <article className={`hero__slide ${activeSlide === 2 ? "is-active" : ""}`}>
            <div className="hero__copy">
              <p className="eyebrow">Programa oficial de sócios</p>
              <h2 className="display">
                Clube<br />
                <em>Meldina</em>
              </h2>
              <p>
                Prioridade na compra de ingressos, até 50% de desconto nos jogos, 15%
                off na loja e experiências exclusivas com o elenco.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/socio">
                  Quero ser sócio →
                </Link>
                <Link className="btn btn--ghost" to="/socio">
                  Ver planos
                </Link>
              </div>
            </div>
            <div className="hero__media">
              <span className="hero__number">10</span>
              <img src="/assets/players/carrijo-10.jpg" alt="Carrijo, camisa 10" />
            </div>
          </article>
        </div>

        {/* Hero Navigation Tabs */}
        <div className="hero__nav">
          <div className="wrap">
            <button
              className={`hero__tab ${activeSlide === 0 ? "is-active" : ""}`}
              onClick={() => setActiveSlide(0)}
            >
              <small>Futebol</small>
              <span>Campeão da Série B, líder na elite</span>
            </button>
            <button
              className={`hero__tab ${activeSlide === 1 ? "is-active" : ""}`}
              onClick={() => setActiveSlide(1)}
            >
              <small>Loja</small>
              <span>Nova camisa II: a coroa pesa</span>
            </button>
            <button
              className={`hero__tab ${activeSlide === 2 ? "is-active" : ""}`}
              onClick={() => setActiveSlide(2)}
            >
              <small>Clube Meldina</small>
              <span>Planos desde R$ 14,90</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TICKER BAR */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ticker__item">
              <img src="/assets/img/escudo-mono.png" alt="" />
              <span>
                <b>Meldina FC</b> · Campeão Série B 2025 · Líder Série A 2026 · {MFC_INFO.lema}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MATCHBAR / MATCH CENTER */}
      <section className="matchbar" aria-label="Central de jogos">
        <div className="wrap">
          {/* Próximo Jogo */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Próxima Partida</span>
              <b>{nextMatch?.competition || "Pro Clubs Série A"}</b>
            </div>
            {nextMatch && (
              <div className="fixture">
                <div className="team">
                  <img src="/assets/img/escudo.png" alt="Meldina FC" />
                  <span>Meldina FC</span>
                </div>
                <div className="fixture__mid">
                  <div className="fixture__time">20:30</div>
                  <div className="fixture__date">Dom · 04 Out</div>
                  <div className="fixture__venue">
                    <span>📍 Lovebomb Arena</span>
                  </div>
                </div>
                <div className="team">
                  <img src="/assets/img/desola.png" alt="De Sola FC" />
                  <span>De Sola FC</span>
                </div>
              </div>
            )}
          </div>

          {/* Último Resultado */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Último Resultado</span>
              <span className="result-tag">Vitória</span>
            </div>
            {lastFinishedMatch && (
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="score">
                  <span>{lastFinishedMatch.homeScore}</span>
                  <i>×</i>
                  <span>{lastFinishedMatch.awayScore}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider">
                  Meldina 3 × 0 Sete Lagos · 6ª rodada
                </p>
              </div>
            )}
          </div>

          {/* Classificação Resumida */}
          <div className="matchbar__cell">
            <div className="mc-label">
              <span>Tabela Série A</span>
              <Link to="/jogos" className="text-ouro text-xs hover:underline">
                Completa →
              </Link>
            </div>
            <table className="mini-table">
              <tbody>
                {standings.slice(0, 4).map((s, idx) => (
                  <tr key={s.teamId} className={s.teamId === "mfc" ? "is-us" : ""}>
                    <td>{idx + 1}º</td>
                    <td className="t">
                      {s.teamId === "mfc" ? (
                        <img src="/assets/img/escudo.png" alt="" />
                      ) : s.teamId === "desola" ? (
                        <img src="/assets/img/desola.png" alt="" />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                          {s.team?.acronym || "FC"}
                        </span>
                      )}
                      <span>{s.team?.shortName || s.teamId}</span>
                    </td>
                    <td>{s.points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. NOTÍCIAS */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Últimas</p>
              <h2 className="display">Notícias</h2>
            </div>
            <Link className="link-arrow" to="/noticias">
              Todas as notícias <span>→</span>
            </Link>
          </div>
          <div className="news-grid">
            {news.map((item, idx) => (
              <article
                key={item.id}
                className={`news-card ${idx === 0 ? "news-card--feature" : ""}`}
              >
                <div className="news-card__img">
                  <img
                    src={item.imageUrl || "/assets/news/sete-lagos.jpg"}
                    alt={item.title}
                  />
                  <span className={`news-card__tag ${item.category === "clube" ? "t-clube" : ""}`}>
                    {item.category}
                  </span>
                </div>
                <div className="news-card__body">
                  <span className="news-card__meta">
                    {new Date(item.publishedAt).toLocaleDateString("pt-BR")} · {item.author}
                  </span>
                  <h3>
                    <Link to={`/noticias/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ELENCO RAIL */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Temporada 2026</p>
              <h2 className="display">Nosso elenco</h2>
            </div>
            <Link className="link-arrow" to="/elenco">
              Elenco completo <span>→</span>
            </Link>
          </div>
          <div className="squad-rail">
            {players.map((p) => (
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

      {/* 6. MELDINA TV */}
      <section className="section tv">
        <div className="wrap">
          <div className="section-head">
            <div>
              <img className="tv__logo" src="/assets/img/mtv-white.png" alt="Meldina TV" />
              <p className="text-gray-300 text-sm mt-3 max-w-md">
                MFC News, Meldcast, bastidores e melhores momentos no YouTube. Jogos ao vivo na Twitch.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className="btn"
                href={MFC_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                Inscreva-se no YouTube
              </a>
              <a
                className="btn btn--ghost"
                href={MFC_INFO.twitch}
                target="_blank"
                rel="noopener noreferrer"
              >
                Jogos ao vivo na Twitch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOJA PRODUTOS EM DESTAQUE */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Loja oficial</p>
              <h2 className="display">Nova camisa II</h2>
            </div>
            <Link className="link-arrow" to="/loja">
              Ver toda a loja <span>→</span>
            </Link>
          </div>
          <div className="kit-feature">
            <Link className="kit kit--product" to="/loja">
              <img src="/assets/img/camisa-2-produto.jpg" alt="Camisa II" />
              <div className="kit__body">
                <p className="eyebrow">Lançamento · 2026</p>
                <h3 className="display">Camisa II Oficial</h3>
                <p className="kit__price">R$ 199,90</p>
                <span className="btn btn--sm">Comprar</span>
              </div>
            </Link>
            <Link className="kit kit--product" to="/loja">
              <img src="/assets/img/camisa-1-produto.jpg" alt="Camisa I" />
              <div className="kit__body">
                <p className="eyebrow">Temporada 2026</p>
                <h3 className="display">Camisa I Oficial</h3>
                <p className="kit__price">R$ 199,90</p>
                <span className="btn btn--sm">Comprar</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SÓCIO CTA */}
      <section className="bg-grena-deep text-white py-20 border-t border-ouro/30">
        <div className="wrap text-center max-w-3xl mx-auto">
          <p className="eyebrow justify-center">Clube Meldina</p>
          <h2 className="display text-5xl md:text-7xl mb-6">
            Jogue junto com o <em>Meldina</em>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Faça parte da nossa história. Descontos em camisas oficiais, prioridade em ingressos e conteúdos exclusivos direto no WhatsApp.
          </p>
          <Link to="/socio" className="btn btn--grena text-lg px-8 py-4">
            Escolher Plano de Sócio →
          </Link>
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
