import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { NewsArticle } from "../../types";

export const AdminNoticias: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("jogos");
  const [imageUrl, setImageUrl] = useState("/assets/news/sete-lagos.jpg");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadNews = async () => {
    const data = await api.getNews();
    setNews(data);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(autoSlug);
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      const res = await api.createNews({
        title,
        slug,
        summary,
        content,
        category,
        imageUrl,
        isFeatured,
      });

      if (res.success || res.id) {
        setFeedback("✅ Notícia publicada com sucesso!");
        setTitle("");
        setSlug("");
        setSummary("");
        setContent("");
        loadNews();
      }
    } catch {
      setFeedback("❌ Erro ao publicar notícia. Verifique os campos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (newsSlug: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      await api.deleteNews(newsSlug);
      setNews((prev) => prev.filter((n) => n.slug !== newsSlug));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">Gerenciador de Notícias</h1>
        <p className="text-sm text-gray-400 mt-1">Crie, edite e publique artigos no portal do Meldina FC.</p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold">
          {feedback}
        </div>
      )}

      {/* FORMULÁRIO DE NOVA NOTÍCIA */}
      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-4 text-ouro">Nova Publicação</h2>
        <form onSubmit={handleCreateNews} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label>Título da Notícia</label>
              <input
                type="text"
                placeholder="Ex: Meldina vence clássico contra De Sola"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Slug (URL amigável)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="jogos">Jogos & Resultados</option>
                <option value="clube">Institucional / Clube</option>
                <option value="entrevistas">Entrevistas / Coletiva</option>
              </select>
            </div>
            <div className="field">
              <label>URL da Imagem de Capa</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Resumo / Subtítulo</label>
            <textarea
              rows={2}
              placeholder="Breve resumo que aparece nos cards..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Conteúdo Completo</label>
            <textarea
              rows={5}
              placeholder="Texto completo da matéria..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="feat"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-ouro"
            />
            <label htmlFor="feat" className="text-sm text-gray-300">
              Destacar como manchete principal na Home
            </label>
          </div>

          <button
            type="submit"
            className="btn btn--grena py-3 px-8 text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar Notícia →"}
          </button>
        </form>
      </div>

      {/* LISTA DE NOTÍCIAS CADASTRADAS */}
      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-4">Notícias Publicadas</h2>
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/5 rounded border border-linha-escura flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <span className="text-xs bg-grena px-2 py-0.5 rounded uppercase font-bold text-white mr-2">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
                </span>
                <h3 className="font-semibold text-base mt-1 text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{item.summary}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={`/noticias/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--ghost btn--sm text-xs"
                >
                  Ver no Site
                </a>
                <button
                  onClick={() => handleDelete(item.slug)}
                  className="btn btn--sm text-xs bg-red-800 hover:bg-red-700 text-white"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
