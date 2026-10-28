import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { NewsArticle } from "../../types";
import { STATIC_NEWS } from "../../data/staticData";
import { asList, formatDateLong, normalizeAssetUrl, safeDate } from "../../lib/format";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { NewsCard } from "../../components/NewsCard";
import { ArticleBody } from "../NoticiaDetalhe";
import { FallbackImage } from "../../components/ui/FallbackImage";
import {
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Quote,
  Image as ImageIcon,
  PenTool,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";

const DEFAULT_NEWS_IMAGE = "/assets/news/kiki-tunel.jpg";

type PreviewTab = "card" | "article";
type CardLayoutMode = "default" | "feature";

export const AdminNoticias: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("jogos");
  const [author, setAuthor] = useState("Redação Meldina");
  const [imageUrl, setImageUrl] = useState(DEFAULT_NEWS_IMAGE);
  const [isFeatured, setIsFeatured] = useState(false);

  // Preview states
  const [previewTab, setPreviewTab] = useState<PreviewTab>("card");
  const [cardLayoutMode, setCardLayoutMode] = useState<CardLayoutMode>("default");

  // Filter for Published News
  const [filterCategory, setFilterCategory] = useState<string>("todas");

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNews(asList(data, STATIC_NEWS));
    } catch {
      setNews(STATIC_NEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const toSlug = (val: string) =>
    val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingNews) {
      setSlug(toSlug(val));
    }
  };

  const handleFeaturedChange = (checked: boolean) => {
    setIsFeatured(checked);
    setCardLayoutMode(checked ? "feature" : "default");
  };

  const handleStartNew = () => {
    setEditingNews(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory("jogos");
    setAuthor("Redação Meldina");
    setImageUrl(DEFAULT_NEWS_IMAGE);
    setIsFeatured(false);
    setCardLayoutMode("default");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartEdit = (item: NewsArticle) => {
    setEditingNews(item);
    setTitle(item.title);
    setSlug(item.slug);
    setSummary(item.summary);
    setContent(item.content);
    setCategory(item.category || "jogos");
    setAuthor(item.author || "Redação Meldina");
    setImageUrl(normalizeAssetUrl(item.imageUrl) || DEFAULT_NEWS_IMAGE);
    setIsFeatured(Boolean(item.isFeatured));
    setCardLayoutMode(item.isFeatured ? "feature" : "default");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const insertBlock = (snippet: string) => {
    setContent((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed ? `${trimmed}\n\n${snippet}` : snippet;
    });
    setPreviewTab("article");
    setTimeout(() => {
      contentTextareaRef.current?.focus();
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const normalizedImage = normalizeAssetUrl(imageUrl) || DEFAULT_NEWS_IMAGE;

    try {
      if (editingNews) {
        await api.updateNews(editingNews.slug, {
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          category,
          author: author.trim() || "Redação Meldina",
          imageUrl: normalizedImage,
          isFeatured,
        });
        setFeedback({ type: "ok", text: "Publicação atualizada com sucesso no portal!" });
        handleStartNew();
      } else {
        const finalSlug = slug.trim() || toSlug(title);
        const res = await api.createNews({
          title: title.trim(),
          slug: finalSlug,
          summary: summary.trim(),
          content: content.trim(),
          category,
          author: author.trim() || "Redação Meldina",
          imageUrl: normalizedImage,
          isFeatured,
        });

        if (res?.success || res?.data || res?.id) {
          setFeedback({ type: "ok", text: "Nova matéria publicada com sucesso!" });
          handleStartNew();
        }
      }
      await loadNews();
    } catch (err: any) {
      const details = err?.response?.data?.details;
      if (Array.isArray(details) && details.length > 0) {
        const errorList = details.map((d: any) => `${d.path}: ${d.message}`).join(" | ");
        setFeedback({ type: "err", text: `Erro nos campos: ${errorList}` });
      } else {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Verifique os campos obrigatórios (título, resumo e conteúdo).";
        setFeedback({ type: "err", text: `Erro ao salvar notícia: ${msg}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: NewsArticle) => {
    if (!window.confirm(`Tem certeza que deseja excluir a notícia "${item.title}"?`)) return;
    try {
      await api.deleteNews(item.slug);
      setNews((prev) => prev.filter((n) => n.slug !== item.slug));
      if (editingNews?.slug === item.slug) {
        handleStartNew();
      }
      setFeedback({ type: "ok", text: `Notícia "${item.title}" removida.` });
    } catch (err: any) {
      setFeedback({
        type: "err",
        text: err?.response?.data?.error || "Não foi possível excluir a notícia.",
      });
    }
  };

  // Live preview article object
  const previewArticle: NewsArticle = {
    id: editingNews?.id || "preview-news",
    slug: slug || "preview-noticia",
    title: title.trim() || "Título da matéria aparecerá aqui em destaque",
    summary:
      summary.trim() ||
      "Resumo ou linha fina da publicação que aparece nos cards da Home, na listagem de notícias e na abertura da matéria.",
    content:
      content.trim() ||
      "Digite o conteúdo completo da matéria no formulário ao lado para visualizar os parágrafos, citações em destaque, fotos internas e assinaturas da diretoria em tempo real.\n\nQUOTE:Toda vez que a gente sai desse túnel é a mesma coisa: a torcida, a camisa, o peso da coroa.|Kiki, lateral-direito do Meldina FC",
    category: category || "jogos",
    imageUrl: normalizeAssetUrl(imageUrl) || DEFAULT_NEWS_IMAGE,
    publishedAt: editingNews?.publishedAt || new Date().toISOString(),
    author: author.trim() || "Redação Meldina",
    isFeatured,
  };

  const previewDate = safeDate(previewArticle.publishedAt) || new Date();

  const categories = [
    { key: "todas", label: "Todas" },
    { key: "jogos", label: "Jogos" },
    { key: "clube", label: "Clube" },
    { key: "entrevistas", label: "Entrevistas" },
    { key: "tv", label: "Meldina TV" },
  ];

  const filteredNews =
    filterCategory === "todas"
      ? news
      : news.filter((n) => (n.category || "").toLowerCase() === filterCategory);

  return (
    <div className="space-y-10">
      {/* 1. HEADER (.admin-hero) */}
      <section className="admin-hero">
        <img
          className="admin-hero__mark"
          src="/assets/img/monograma-outline.png"
          alt=""
        />
        <div className="wrap flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Imprensa & Comunicação</p>
            <h1 className="display">Notícias Oficiais</h1>
            <p>
              Redija matérias, notas da presidência, crônicas de pós-jogo e entrevistas coletivas
              com visualização em tempo real do card e da página de leitura.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <button
              type="button"
              onClick={handleStartNew}
              className="btn text-xs flex items-center gap-2"
            >
              <PlusCircle size={16} /> + Nova Publicação
            </button>
          </div>
        </div>
      </section>

      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded border text-sm font-semibold flex items-center justify-between gap-3 ${
            feedback.type === "ok"
              ? "bg-ouro/10 border-ouro text-ouro"
              : "bg-grena/25 border-erro text-erro-claro"
          }`}
        >
          <span className="flex items-center gap-2">
            {feedback.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {feedback.text}
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs uppercase tracking-wider opacity-75 hover:opacity-100"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 2. SPLIT-VIEW: FORMULÁRIO + PREVIEW AO VIVO */}
      <div ref={formTopRef} className="admin-split">
        {/* COLUNA ESQUERDA: FORMULÁRIO (.form-card) */}
        <div className="form-card space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-linha-escura pb-4">
            <div>
              <p className="eyebrow mb-1">
                {editingNews ? "Modo de Edição" : "Redação Meldina FC"}
              </p>
              <h2 className="display text-3xl flex items-center gap-2.5">
                {editingNews ? (
                  <>
                    <Edit3 size={22} className="text-ouro" /> Editar Publicação
                  </>
                ) : (
                  <>
                    <PlusCircle size={22} className="text-ouro" /> Nova Publicação
                  </>
                )}
              </h2>
            </div>
            {editingNews && (
              <button
                type="button"
                onClick={handleStartNew}
                className="btn btn--sm btn--ghost text-xs"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="news-title">Título da Notícia</label>
                <input
                  id="news-title"
                  type="text"
                  placeholder="Ex: Hoje tem Meldina na Lovebomb Arena"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="news-slug">Slug (URL amigável)</label>
                <input
                  id="news-slug"
                  type="text"
                  placeholder="ex: hoje-tem-meldina-lovebomb"
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  disabled={!!editingNews}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="news-category">Categoria</label>
                <select
                  id="news-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="jogos">Jogos & Resultados (jogos)</option>
                  <option value="clube">Institucional / Clube (clube)</option>
                  <option value="entrevistas">Entrevistas / Coletiva (entrevistas)</option>
                  <option value="tv">Meldina TV (tv)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="news-author">Autor / Assinatura</label>
                <input
                  id="news-author"
                  type="text"
                  placeholder="Redação Meldina"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
            </div>

            <ImageUploadField
              label="Foto de Capa da Notícia"
              value={imageUrl}
              onChange={setImageUrl}
              defaultGalleryTab="news"
              placeholder="/assets/news/kiki-tunel.jpg ou envie pelo botão"
            />

            <div className="field">
              <label htmlFor="news-summary">Resumo / Subtítulo (Linha Fina)</label>
              <textarea
                id="news-summary"
                rows={2}
                placeholder="Breve síntese exibida nos cards e no topo da matéria..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <label htmlFor="news-content">Conteúdo Completo da Matéria</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/50 mr-1">
                    Inserir bloco:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      insertBlock("QUOTE:Texto da frase em destaque|Autor, cargo no Meldina FC")
                    }
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-ouro hover:text-noite border border-linha-escura text-[11px] font-semibold transition-colors flex items-center gap-1"
                    title="Inserir citação estilizada"
                  >
                    <Quote size={11} /> Citação (QUOTE)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertBlock("IMG:/assets/news/meldina-magazine-2.jpg|Legenda da foto na matéria")
                    }
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-ouro hover:text-noite border border-linha-escura text-[11px] font-semibold transition-colors flex items-center gap-1"
                    title="Inserir imagem no corpo do texto"
                  >
                    <ImageIcon size={11} /> Foto (IMG)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertBlock("SIGN:Atenciosamente,|André Almeida|Presidente do Meldina FC")
                    }
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-ouro hover:text-noite border border-linha-escura text-[11px] font-semibold transition-colors flex items-center gap-1"
                    title="Inserir assinatura institucional"
                  >
                    <PenTool size={11} /> Assinatura (SIGN)
                  </button>
                </div>
              </div>
              <textarea
                ref={contentTextareaRef}
                id="news-content"
                rows={8}
                placeholder="Separe os parágrafos com uma linha em branco. Use os botões acima para citações (QUOTE:), imagens (IMG:) ou assinatura (SIGN:)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <label
              htmlFor="news-feat"
              className="flex items-center gap-3 p-3.5 rounded bg-white/5 border border-linha-escura cursor-pointer hover:border-ouro/50 transition-colors"
            >
              <input
                type="checkbox"
                id="news-feat"
                checked={isFeatured}
                onChange={(e) => handleFeaturedChange(e.target.checked)}
                className="accent-ouro w-4 h-4"
              />
              <div>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-ouro" />
                  Destacar como manchete principal (Feature)
                </span>
                <span className="block text-xs text-white/60">
                  Exibe esta publicação com destaque de 8 colunas na abertura de Notícias e Home.
                </span>
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn btn--grena py-3.5 px-8 text-sm"
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
                  onClick={handleStartNew}
                  className="btn btn--ghost text-xs"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: PREVIEW AO VIVO (.admin-preview-pane) */}
        <aside className="admin-preview-pane">
          <div className="admin-preview-box">
            <div className="admin-preview-box__head">
              <span className="admin-preview-box__badge">Preview ao Vivo</span>

              <div className="tabs" role="tablist" aria-label="Modo de visualização da notícia">
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewTab === "card"}
                  onClick={() => setPreviewTab("card")}
                  className={`tab text-xs py-1.5 px-3.5 flex items-center gap-1.5 ${
                    previewTab === "card" ? "is-active" : ""
                  }`}
                >
                  <Eye size={13} /> Card na Grade
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewTab === "article"}
                  onClick={() => setPreviewTab("article")}
                  className={`tab text-xs py-1.5 px-3.5 flex items-center gap-1.5 ${
                    previewTab === "article" ? "is-active" : ""
                  }`}
                >
                  <FileText size={13} /> Página da Matéria
                </button>
              </div>
            </div>

            {previewTab === "card" ? (
              <div className="admin-preview-box__body space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-white/65">
                    Formato do Card em <code className="text-ouro">/noticias</code> e Home:
                  </span>
                  <div className="tabs">
                    <button
                      type="button"
                      onClick={() => setCardLayoutMode("default")}
                      className={`tab text-[11px] py-1 px-3 ${
                        cardLayoutMode === "default" ? "is-active" : ""
                      }`}
                    >
                      Card Padrão
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardLayoutMode("feature")}
                      className={`tab text-[11px] py-1 px-3 ${
                        cardLayoutMode === "feature" ? "is-active" : ""
                      }`}
                    >
                      Card Destaque (Feature)
                    </button>
                  </div>
                </div>

                {/* Container creme idêntico à seção de notícias do site */}
                <div className="section--creme p-6 rounded-md border border-linha-clara">
                  <div
                    className={
                      cardLayoutMode === "default" ? "max-w-sm mx-auto" : "w-full"
                    }
                  >
                    <NewsCard
                      item={previewArticle}
                      layout={cardLayoutMode === "feature" ? "feature" : "default"}
                      eager
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-h-[750px] overflow-y-auto">
                {/* Hero da Matéria (.page-hero--article) */}
                <div className="page-hero page-hero--article !py-10 !px-6">
                  <div className="max-w-3xl mx-auto">
                    <p className="eyebrow">{previewArticle.category}</p>
                    <h3 className="display text-3xl sm:text-4xl leading-none">
                      {previewArticle.title}
                    </h3>
                    <p className="text-xs text-white/75 mt-3">
                      Publicado em {formatDateLong(previewDate)} por {previewArticle.author}
                    </p>
                  </div>
                </div>

                {/* Corpo da Matéria (.section--creme) */}
                <div className="section--creme p-6 sm:p-8">
                  <div className="max-w-2xl mx-auto">
                    {previewArticle.imageUrl && (
                      <figure className="article-figure !mb-6">
                        <FallbackImage
                          src={previewArticle.imageUrl}
                          alt=""
                          fallbackClassName="article-figure__fallback"
                        />
                      </figure>
                    )}
                    <ArticleBody
                      summary={previewArticle.summary}
                      content={previewArticle.content}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. NOTÍCIAS PUBLICADAS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-linha-escura pb-4">
          <div>
            <p className="eyebrow mb-1">Acervo Editorial</p>
            <h2 className="display text-3xl">
              Notícias Publicadas ({filteredNews.length})
            </h2>
          </div>

          <div className="tabs" role="group" aria-label="Filtrar notícias por categoria">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFilterCategory(cat.key)}
                className={`tab text-xs py-2 px-4 ${
                  filterCategory === cat.key ? "is-active" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-white/70 py-8">Carregando matérias publicadas…</p>
        ) : filteredNews.length === 0 ? (
          <div className="form-card text-center py-12">
            <p className="text-white/70 mb-4">Nenhuma notícia encontrada nesta categoria.</p>
            {filterCategory !== "todas" && (
              <button
                type="button"
                onClick={() => setFilterCategory("todas")}
                className="btn btn--sm btn--ghost"
              >
                Ver todas as categorias
              </button>
            )}
          </div>
        ) : (
          <div className="section--creme p-6 sm:p-8 rounded-md border border-linha-escura">
            <div className="news-grid">
              {filteredNews.map((item) => {
                const isBeingEdited = editingNews?.slug === item.slug;
                return (
                  <div
                    key={item.id || item.slug}
                    className={`col-span-12 md:col-span-6 lg:col-span-4 flex flex-col rounded-md overflow-hidden transition-all ${
                      isBeingEdited
                        ? "ring-4 ring-ouro shadow-xl"
                        : "shadow-md hover:shadow-xl"
                    }`}
                  >
                    <div className="flex-1 flex flex-col [&>.news-card]:flex-1 [&>.news-card]:rounded-b-none [&>.news-card:hover]:transform-none">
                      <NewsCard item={item} layout="default" />
                    </div>

                    {/* Barra de Ações Admin no Rodapé do Card */}
                    <div className="bg-noite-2 text-white px-4 py-3 border-t border-linha-escura flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="btn btn--sm text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Edit3 size={12} /> Editar
                        </button>
                        <Link
                          to={`/noticias/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--sm btn--ghost text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <ExternalLink size={12} /> Ver no Site
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isFeatured && (
                          <span className="text-[10px] bg-ouro text-noite px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                            Destaque
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded bg-grena/30 hover:bg-erro text-white transition-colors"
                          title="Excluir notícia"
                          aria-label={`Excluir notícia ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
