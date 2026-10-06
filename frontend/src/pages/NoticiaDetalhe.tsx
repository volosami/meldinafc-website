import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { NewsArticle } from "../types";

export const NoticiaDetalhe: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (slug) {
        const data = await api.getNewsBySlug(slug);
        setArticle(data);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="section wrap text-center py-20">
        <p className="text-gray-400">Carregando notícia...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="section wrap text-center py-20">
        <h2 className="display text-3xl mb-4">Notícia não encontrada</h2>
        <Link to="/noticias" className="btn btn--sm">
          Voltar para Notícias
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="page-hero">
        <div className="wrap max-w-4xl">
          <div className="breadcrumb">
            <Link to="/">Início</Link> <span>/</span> <Link to="/noticias">Notícias</Link> <span>/</span> <span>{article.category}</span>
          </div>
          <p className="eyebrow">{article.category}</p>
          <h1 className="display text-3xl md:text-5xl">{article.title}</h1>
          <p className="text-sm text-gray-300 mt-4">
            Publicado em {new Date(article.publishedAt).toLocaleDateString("pt-BR")} por {article.author}
          </p>
        </div>
      </section>

      <section className="section section--creme">
        <div className="wrap max-w-3xl">
          {article.imageUrl && (
            <div className="mb-10 rounded overflow-hidden shadow-lg">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover max-h-[460px]"
              />
            </div>
          )}

          <div className="prose text-tinta leading-relaxed text-lg space-y-6">
            <p className="font-serif italic text-xl text-gray-800 border-l-4 border-grena pl-4 py-1">
              {article.summary}
            </p>
            <p>{article.content}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-linha-clara flex justify-between items-center">
            <Link to="/noticias" className="link-arrow text-grena font-bold">
              ← Voltar para Notícias
            </Link>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Compartilhar:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                className="text-grena hover:underline"
              >
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="text-grena hover:underline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
