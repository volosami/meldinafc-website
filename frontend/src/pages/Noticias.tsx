import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { NewsArticle } from "../types";
import { STATIC_NEWS } from "../data/staticData";
import { asList } from "../lib/format";
import { NewsCard } from "../components/NewsCard";

export const Noticias: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<string>("todas");

  useEffect(() => {
    let cancelled = false;
    api
      .getNews()
      .then((data) => !cancelled && setNews(asList(data, STATIC_NEWS)))
      .catch(() => !cancelled && setNews(STATIC_NEWS))
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ["todas", "jogos", "clube", "entrevistas"];
  const filteredNews =
    filter === "todas" ? news : news.filter((n) => n.category === filter);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Notícias</span>
          </nav>
          <p className="eyebrow">Imprensa & Comunicação</p>
          <h1 className="display">
            Notícias<br />
            <em>Oficiais</em>
          </h1>
          <p>
            Fique por dentro de tudo o que acontece nos bastidores, jogos, contratações e comunicados da diretoria do Meldina FC.
          </p>
        </div>
      </section>

      <section className="section section--creme">
        <div className="wrap">
          <div className="tabs mb-10" role="group" aria-label="Filtrar notícias">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={filter === cat}
                className={`tab ${filter === cat ? "is-active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat === "todas" ? "Todas as Notícias" : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {!loaded ? (
            <p className="text-tinta/70" role="status">Carregando notícias…</p>
          ) : filteredNews.length === 0 ? (
            <div className="text-tinta/80">
              <p>Nenhuma notícia nesta categoria por enquanto.</p>
              {filter !== "todas" && (
                <button type="button" className="link-arrow mt-4" onClick={() => setFilter("todas")}>
                  Ver todas as notícias
                </button>
              )}
            </div>
          ) : (
            <div className="news-grid">
              {filteredNews.map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  feature={idx === 0 && filter === "todas"}
                  eager={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
