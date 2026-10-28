import React, { useState, useRef, useId } from "react";
import { api } from "../../services/api";
import { normalizeAssetUrl } from "../../lib/format";
import { Upload, Link as LinkIcon, CheckCircle2, AlertCircle, Images, X } from "lucide-react";

export type GalleryTab = "news" | "players" | "club";

interface GalleryItem {
  url: string;
  label: string;
}

const GALLERY_ITEMS: Record<GalleryTab, GalleryItem[]> = {
  news: [
    { url: "/assets/news/kiki-tunel.jpg", label: "Kiki no Túnel" },
    { url: "/assets/news/escalacao-carrijo.jpg", label: "Escalação Carrijo" },
    { url: "/assets/news/quotes-celso-2.jpg", label: "Coletiva Celso II" },
    { url: "/assets/news/story-meldina-alem-do-jogo.jpg", label: "Muito Além do Jogo" },
    { url: "/assets/news/patrocinador.jpg", label: "Patrocinador nuFUT" },
    { url: "/assets/news/ele-fica.jpg", label: "Ele Fica (Guigs)" },
    { url: "/assets/news/ultimo-playoff.jpg", label: "Último Playoff" },
    { url: "/assets/news/quotes-kiki.jpg", label: "Aspas Kiki" },
    { url: "/assets/news/meldina-magazine.jpg", label: "Meldina Magazine I" },
    { url: "/assets/news/meldina-magazine-2.jpg", label: "Meldina Magazine II" },
    { url: "/assets/news/quotes-carrijo.jpg", label: "Aspas Carrijo" },
    { url: "/assets/news/nota-oficial.jpg", label: "Nota Oficial EA" },
    { url: "/assets/news/quotes-celso.jpg", label: "Coletiva Celso I" },
    { url: "/assets/news/quotes-guigs.jpg", label: "Aspas Guigs" },
    { url: "/assets/news/pelo-acesso.jpg", label: "Pelo Acesso (Título)" },
    { url: "/assets/news/group-photo.jpg", label: "União em Campo" },
    { url: "/assets/news/hoje-tem-meldina-2.jpg", label: "Hoje Tem Meldina (Estreia)" },
    { url: "/assets/news/hoje-tem-meldina-4.jpg", label: "Concentração Playoff" },
    { url: "/assets/news/hoje-tem-meldina-group.jpg", label: "Elenco Concentrado" },
  ],
  players: [
    { url: "/assets/players/muralha-1.jpg", label: "Muralha #1" },
    { url: "/assets/players/kiki-2.jpg", label: "Kiki #2" },
    { url: "/assets/players/jonga-6.jpg", label: "Jonga #6" },
    { url: "/assets/players/gaab-12.jpg", label: "Gaab #12" },
    { url: "/assets/players/lacerda-78.jpg", label: "Lacerda #78" },
    { url: "/assets/players/rafael-21.jpg", label: "Rafael #21" },
    { url: "/assets/players/guigs-18.jpg", label: "Guigs #18" },
    { url: "/assets/players/carrijo-10.jpg", label: "Carrijo #10" },
    { url: "/assets/players/kristhian-87.jpg", label: "Kristhian #87" },
    { url: "/assets/players/caio-7.jpg", label: "Caio #7" },
    { url: "/assets/players/almeida-9.jpg", label: "Almeida #9" },
  ],
  club: [
    { url: "/assets/img/camisa-1.jpg", label: "Camisa I Oficial" },
    { url: "/assets/img/camisa-2.jpg", label: "Camisa II Oficial" },
    { url: "/assets/img/camisa-2-duo.jpg", label: "Camisa II Duo" },
    { url: "/assets/img/camisa-2-modelo.jpg", label: "Camisa II Modelo" },
    { url: "/assets/img/camisa-2-loja.jpg", label: "Camisa II Loja" },
    { url: "/assets/img/mtv-banner.jpg", label: "Banner Meldina TV" },
    { url: "/assets/img/escudo.png", label: "Escudo Oficial" },
    { url: "/assets/img/clube-meldina/cm-logo.png", label: "Clube Meldina" },
  ],
};

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  defaultGalleryTab?: GalleryTab;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "/assets/news/exemplo.jpg ou https://...",
  defaultGalleryTab = "news",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<GalleryTab>(defaultGalleryTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const normalizedValue = normalizeAssetUrl(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const uploadedUrl = await api.uploadImage(file);
      onChange(normalizeAssetUrl(uploadedUrl));
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Erro ao fazer upload da imagem. Verifique o formato e tamanho.";
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectGalleryImage = (url: string) => {
    onChange(normalizeAssetUrl(url));
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/75">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* Input de URL direta */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
            <LinkIcon size={14} />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              const norm = normalizeAssetUrl(value);
              if (norm !== value) onChange(norm);
            }}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/20 rounded text-sm text-white focus:outline-none focus:border-ouro transition-colors"
          />
        </div>

        {/* Botões de Ação: Galeria do Clube + Upload Local */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGallery((prev) => !prev)}
            aria-expanded={showGallery}
            className={`btn btn--sm text-xs flex items-center gap-1.5 ${
              showGallery
                ? "bg-ouro text-noite border-ouro"
                : "btn--ghost"
            }`}
          >
            <Images size={14} />
            Galeria do Clube
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${inputId}`}
          />
          <label
            htmlFor={`upload-${inputId}`}
            className={`btn btn--sm text-xs cursor-pointer flex items-center gap-1.5 ${
              isUploading
                ? "opacity-50 pointer-events-none"
                : "btn--grena"
            }`}
          >
            <Upload size={14} />
            {isUploading ? "Enviando..." : "Enviar Foto"}
          </label>
        </div>
      </div>

      {error && (
        <p className="text-xs text-erro-claro flex items-center gap-1 mt-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {/* Drawer / Painel Visual da Galeria do Clube */}
      {showGallery && (
        <div className="mt-3 p-4 rounded-md bg-noite border border-linha-escura space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-linha-escura">
            <div className="tabs" role="tablist" aria-label="Categorias da galeria do clube">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "news"}
                onClick={() => setActiveTab("news")}
                className={`tab text-xs py-1.5 px-3.5 ${activeTab === "news" ? "is-active" : ""}`}
              >
                Notícias ({GALLERY_ITEMS.news.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "players"}
                onClick={() => setActiveTab("players")}
                className={`tab text-xs py-1.5 px-3.5 ${activeTab === "players" ? "is-active" : ""}`}
              >
                Elenco ({GALLERY_ITEMS.players.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "club"}
                onClick={() => setActiveTab("club")}
                className={`tab text-xs py-1.5 px-3.5 ${activeTab === "club" ? "is-active" : ""}`}
              >
                Clube & Uniformes ({GALLERY_ITEMS.club.length})
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowGallery(false)}
              className="text-xs text-white/60 hover:text-ouro flex items-center gap-1 uppercase tracking-wider font-semibold"
            >
              <X size={14} /> Fechar
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {GALLERY_ITEMS[activeTab].map((item) => {
              const isSelected = normalizedValue === item.url;
              return (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleSelectGalleryImage(item.url)}
                  className={`group relative rounded overflow-hidden text-left transition-all bg-noite-2 border-2 ${
                    isSelected
                      ? "border-ouro ring-1 ring-ouro/50"
                      : "border-linha-escura hover:border-ouro/60"
                  }`}
                >
                  <div className="aspect-video w-full bg-black/50 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.label}
                      loading="lazy"
                      className={`w-full h-full ${
                        item.url.endsWith(".png") ? "object-contain p-2" : "object-cover object-top"
                      } group-hover:scale-105 transition-transform duration-300`}
                    />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 bg-ouro text-noite rounded-full p-0.5 shadow">
                        <CheckCircle2 size={13} />
                      </span>
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-noite-2">
                    <span className="block text-[11px] font-semibold text-white/90 truncate">
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-white/45 truncate">
                      {item.url.split("/").pop()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pré-visualização da Imagem Vinculada */}
      {normalizedValue && (
        <div className="mt-2 flex items-center gap-3 p-2.5 bg-white/5 rounded border border-linha-escura max-w-md">
          <img
            src={normalizedValue}
            alt="Pré-visualização"
            className="w-14 h-14 object-cover rounded border border-ouro/40 bg-black/40 shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/assets/img/escudo-mono.png";
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-ouro font-semibold flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle2 size={12} /> Foto vinculada
            </span>
            <p className="text-xs text-white/60 truncate mt-0.5" title={normalizedValue}>
              {normalizedValue}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
