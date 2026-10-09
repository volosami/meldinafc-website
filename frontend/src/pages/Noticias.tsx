import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { NewsArticle } from "../types";

export const Noticias: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filter, setFilter] = useState<string>("todas");

  useEffect(() => {
    async function load() {
      const data = await api.getNews();
      setNews(data);
    }
    load();
  }, []);

  const categories = ["todas", "jogos", "clube", "entrevistas"];
  const filteredNews =
    filter === "todas" ? news : news.filter((n) => n.category === filter);

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Notícias</span>
          </div>
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
          <div className="tabs mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab ${filter === cat ? "is-active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat === "todas" ? "Todas as Notícias" : cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="news-grid">
            {filteredNews.map((item, idx) => (
              <article
                key={item.id}
                className={`news-card ${idx === 0 && filter === "todas" ? "news-card--feature" : ""}`}
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
    </div>
  );
};
