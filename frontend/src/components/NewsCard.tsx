import React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { FallbackImage } from "./ui/FallbackImage";
import { formatDateShort, safeDate } from "../lib/format";

const TAG_CLASS: Record<string, string> = { clube: "t-clube", tv: "t-tv" };

export type NewsLayout = "feature" | "wide" | "half" | "default";

/**
 * Grade de notícias: a 1ª é destaque (8 colunas × 2 linhas) com duas ao lado;
 * as demais vêm de três em três. A última linha nunca fica com card sobrando:
 * um card sozinho ocupa a linha inteira e dois dividem a linha ao meio.
 */
export function newsLayout(idx: number, total: number): NewsLayout {
  if (idx === 0) return "feature";
  if (idx < 3) return "default";
  const leftover = (total - 3) % 3;
  if (leftover === 1 && idx === total - 1) return "wide";
  if (leftover === 2 && idx >= total - 2) return "half";
  return "default";
}

/** Card de notícia (Home e Notícias). A imagem é decorativa: o título já é o link. */
export const NewsCard: React.FC<{ item: NewsArticle; layout?: NewsLayout; eager?: boolean }> = ({
  item,
  layout = "default",
  eager,
}) => {
  const date = safeDate(item.publishedAt);
  return (
    <article className={`news-card${layout === "default" ? "" : ` news-card--${layout}`}`}>
      <div className="news-card__img">
        <FallbackImage src={item.imageUrl || undefined} alt="" loading={eager ? undefined : "lazy"} />
        <span className={`news-card__tag ${TAG_CLASS[item.category] ?? ""}`}>{item.category}</span>
      </div>
      <div className="news-card__body">
        <span className="news-card__meta">
          {date && <time dateTime={item.publishedAt}>{formatDateShort(date)}</time>}
          {date && item.author ? " · " : ""}
          {item.author}
        </span>
        <h3>
          <Link to={`/noticias/${item.slug}`}>{item.title}</Link>
        </h3>
        {item.summary && <p>{item.summary}</p>}
      </div>
    </article>
  );
};
