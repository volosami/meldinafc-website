import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import { NewsArticle } from "../types";
import { FallbackImage } from "../components/ui/FallbackImage";
import { formatDateLong, safeDate } from "../lib/format";

export const NoticiaDetalhe: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setArticle(null);
    (slug ? api.getNewsBySlug(slug) : Promise.resolve(null))
      .then((data) => !cancelled && setArticle(data && typeof data.title === "string" ? data : null))
      .catch(() => !cancelled && setArticle(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Título da aba acompanha a notícia aberta.
  useEffect(() => {
    if (!article) return;
    const previous = document.title;
    document.title = `${article.title} | Meldina FC`;
    return () => {
      document.title = previous;
    };
  }, [article]);

  if (loading) {
    return (
      <div className="section wrap text-center py-20">
        <p className="text-white/70" role="status">Carregando notícia…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="section wrap text-center py-20">
        <h1 className="display text-3xl mb-4">Notícia não encontrada</h1>
        <p className="text-white/70 mb-8">O link pode estar errado ou a notícia foi retirada do ar.</p>
        <Link to="/noticias" className="btn btn--sm">
          Ver todas as notícias
        </Link>
      </div>
    );
  }

  const date = safeDate(article.publishedAt);
  const paragraphs = (article.content || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article>
      <section className="page-hero">
        <div className="wrap max-w-4xl">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <Link to="/noticias">Notícias</Link>{" "}
            <span aria-hidden="true">/</span> <span aria-current="page">{article.category}</span>
          </nav>
          <p className="eyebrow">{article.category}</p>
          <h1 className="display text-3xl md:text-5xl">{article.title}</h1>
          <p className="text-sm text-white/75 mt-4">
            {date ? (
              <>
                Publicado em <time dateTime={article.publishedAt}>{formatDateLong(date)}</time>
              </>
            ) : (
              "Publicado"
            )}
            {article.author ? ` por ${article.author}` : ""}
          </p>
        </div>
      </section>

      <section className="section section--creme">
        <div className="wrap max-w-3xl">
          {article.imageUrl && (
            <figure className="article-figure mb-10 rounded overflow-hidden shadow-lg">
              <FallbackImage
                src={article.imageUrl}
                alt=""
                className="w-full h-auto object-cover max-h-[460px]"
                fallbackClassName="article-figure__fallback"
              />
            </figure>
          )}

          <div className="prose text-tinta leading-relaxed text-lg space-y-6">
            {article.summary && (
              <p className="font-serif italic text-xl text-tinta/85">
                {article.summary}
              </p>
            )}
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-linha-clara flex flex-wrap gap-6 justify-between items-center">
            <Link to="/noticias" className="link-arrow">
              <ArrowLeft aria-hidden="true" /> Voltar para Notícias
            </Link>
            <div className="flex gap-4 text-sm text-tinta/75">
              <span>Compartilhar:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grena hover:underline"
              >
                X (Twitter)<span className="sr-only"> (abre em nova aba)</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grena hover:underline"
              >
                WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
