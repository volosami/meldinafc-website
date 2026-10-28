import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import { NewsArticle } from "../types";
import { FallbackImage } from "../components/ui/FallbackImage";
import { formatDateLong, normalizeAssetUrl, safeDate } from "../lib/format";

export const ArticleBody: React.FC<{ summary?: string; content: string }> = ({ summary, content }) => {
  const paragraphs = (content || "")
    .split(/\n\s*\n|\n(?=(?:QUOTE|IMG|LIST|SIGN):)/)
    .flatMap((block) => {
      const trimmed = block.trim();
      if (/^(?:QUOTE|IMG|LIST|SIGN):/.test(trimmed) && trimmed.includes("\n")) {
        return trimmed.split(/\n+/);
      }
      return [trimmed];
    })
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="prose article-body text-tinta leading-relaxed text-lg space-y-6">
      {summary && (
        <p className="lead font-serif italic text-xl text-tinta/85">
          {summary}
        </p>
      )}
      {paragraphs.map((p, i) => {
        if (p.startsWith("QUOTE:")) {
          const [texto, autor] = p.slice(6).split("|").map((s) => s.trim());
          return (
            <blockquote key={i} className="article-quote">
              <p>“{texto}”</p>
              {autor && <cite>— {autor}</cite>}
            </blockquote>
          );
        }
        if (p.startsWith("LIST:")) {
          const items = p.slice(5).split("|").map((s) => s.trim()).filter(Boolean);
          return (
            <ol key={i} className="article-list">
              {items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ol>
          );
        }
        if (p.startsWith("SIGN:")) {
          const lines = p.slice(5).split("|").map((s) => s.trim()).filter(Boolean);
          return (
            <p key={i} className="article-sign">
              {lines.map((l, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <br />}
                  {l}
                </React.Fragment>
              ))}
            </p>
          );
        }
        if (p.startsWith("IMG:")) {
          const [rawSrc, caption] = p.slice(4).split("|").map((s) => s.trim());
          const src = rawSrc || "";
          const resolvedSrc = normalizeAssetUrl(
            src.startsWith("assets/")
              ? `/${src}`
              : src.startsWith("/") || src.startsWith("http")
              ? src
              : `/assets/${src}`
          );
          return (
            <figure key={i} className="article-fig">
              <FallbackImage src={resolvedSrc} alt={caption || ""} />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          );
        }
        if (p === p.toUpperCase() && p.length < 60) {
          return (
            <p key={i} className="article-kicker">
              {p}
            </p>
          );
        }
        return <p key={i}>{p}</p>;
      })}
    </div>
  );
};

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
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article>
      <section className="page-hero page-hero--article">
        <div className="wrap max-w-4xl">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <Link to="/noticias">Notícias</Link>{" "}
            <span aria-hidden="true">/</span> <span aria-current="page">{article.category}</span>
          </nav>
          <p className="eyebrow">{article.category}</p>
          <h1 className="display">{article.title}</h1>
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
            <figure className="article-figure">
              <FallbackImage
                src={article.imageUrl}
                alt=""
                fallbackClassName="article-figure__fallback"
              />
            </figure>
          )}

          <ArticleBody summary={article.summary} content={article.content} />

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
