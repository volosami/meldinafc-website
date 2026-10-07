import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { NewsArticle } from "../../types";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { PlusCircle, Edit3, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";

export const AdminNoticias: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

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
    if (!editingNews) {
      const autoSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
    }
  };

  const handleStartEdit = (item: NewsArticle) => {
    setEditingNews(item);
    setTitle(item.title);
    setSlug(item.slug);
    setSummary(item.summary);
    setContent(item.content);
    setCategory(item.category);
    setImageUrl(item.imageUrl || "/assets/news/sete-lagos.jpg");
    setIsFeatured(item.isFeatured || false);
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory("jogos");
    setImageUrl("/assets/news/sete-lagos.jpg");
    setIsFeatured(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      if (editingNews) {
        // Atualizar notícia existente
        await api.updateNews(editingNews.slug, {
          title,
          summary,
          content,
          category,
          imageUrl,
          isFeatured,
        });
        setFeedback("✅ Notícia atualizada com sucesso!");
        handleCancelEdit();
      } else {
        // Criar nova notícia
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
          handleCancelEdit();
        }
      }
      loadNews();
    } catch {
      setFeedback("❌ Erro ao salvar notícia. Verifique os campos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (newsSlug: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      await api.deleteNews(newsSlug);
      setNews((prev) => prev.filter((n) => n.slug !== newsSlug));
      if (editingNews?.slug === newsSlug) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">Gerenciador de Notícias</h1>
        <p className="text-sm text-gray-400 mt-1">Crie, edite e publique artigos no portal do Meldina FC.</p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      {/* FORMULÁRIO DE NOVA NOTÍCIA OU EDIÇÃO */}
      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl uppercase text-ouro flex items-center gap-2">
            {editingNews ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            {editingNews ? "Editar Publicação" : "Nova Publicação"}
          </h2>
          {editingNews && (
            <button
              onClick={handleCancelEdit}
              className="btn btn--sm btn--ghost text-xs text-gray-400 hover:text-white"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={!!editingNews}
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

            {/* Componente de Upload / URL de Imagem de Capa */}
            <ImageUploadField
              label="Foto de Capa da Notícia"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="/assets/news/capa.jpg ou envie pelo botão"
            />
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="btn btn--grena py-3 px-8 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : editingNews
                ? "Salvar Alterações →"
                : "Publicar Notícia →"}
            </button>
            {editingNews && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn--ghost text-xs text-gray-400"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA DE NOTÍCIAS CADASTRADAS */}
      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-4">Notícias Publicadas ({news.length})</h2>
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded border transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                editingNews?.slug === item.slug
                  ? "bg-grena/20 border-ouro"
                  : "bg-white/5 border-linha-escura hover:border-gray-600"
              }`}
            >
              <div className="flex items-start gap-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover border border-linha-escura shrink-0 bg-black/40"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/news/sete-lagos.jpg";
                    }}
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-grena px-2 py-0.5 rounded uppercase font-bold text-white">
                      {item.category}
                    </span>
                    {item.isFeatured && (
                      <span className="text-[10px] bg-ouro text-noite px-1.5 py-0.5 rounded font-black uppercase">
                        Destaque
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base mt-1 text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.summary}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="btn btn--sm text-xs bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
                >
                  <Edit3 size={12} /> Editar
                </button>
                <a
                  href={`/noticias/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--ghost btn--sm text-xs flex items-center gap-1"
                >
                  <ExternalLink size={12} /> Ver
                </a>
                <button
                  onClick={() => handleDelete(item.slug)}
                  className="btn btn--sm text-xs bg-red-800 hover:bg-red-700 text-white flex items-center gap-1"
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
