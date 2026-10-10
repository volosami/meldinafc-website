import React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { FallbackImage } from "./ui/FallbackImage";
import { formatDateShort, safeDate } from "../lib/format";

const TAG_CLASS: Record<string, string> = { clube: "t-clube", tv: "t-tv" };

/** Card de notícia (Home e Notícias). A imagem é decorativa: o título já é o link. */
export const NewsCard: React.FC<{ item: NewsArticle; feature?: boolean; eager?: boolean }> = ({
  item,
  feature,
  eager,
}) => {
  const date = safeDate(item.publishedAt);
  return (
    <article className={`news-card ${feature ? "news-card--feature" : ""}`}>
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
