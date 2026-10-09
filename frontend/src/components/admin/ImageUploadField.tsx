import React, { useState, useRef } from "react";
import { api } from "../../services/api";
import { Upload, Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "/assets/news/exemplo.jpg ou https://...",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const uploadedUrl = await api.uploadImage(file);
      onChange(uploadedUrl);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao fazer upload da imagem. Verifique o formato e tamanho.";
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Input de URL direta */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <LinkIcon size={14} />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 bg-noite border border-linha-escura rounded text-sm text-white focus:outline-none focus:border-ouro"
          />
        </div>

        {/* Botão de Upload Local */}
        <div className="shrink-0 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />
          <label
            htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className={`btn btn--sm text-xs cursor-pointer flex items-center gap-1.5 ${
              isUploading
                ? "bg-gray-700 text-gray-400 pointer-events-none"
                : "bg-ouro/20 border border-ouro text-ouro hover:bg-ouro hover:text-noite transition-colors"
            }`}
          >
            <Upload size={14} />
            {isUploading ? "Enviando..." : "Enviar Foto"}
          </label>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {/* Pré-visualização da Imagem */}
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-white/5 rounded border border-linha-escura max-w-sm">
          <img
            src={value}
            alt="Pré-visualização"
            className="w-14 h-14 object-cover rounded border border-ouro/30 bg-black/40"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/assets/img/escudo.png";
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-ouro font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Foto vinculada
            </span>
            <p className="text-[11px] text-gray-400 truncate mt-0.5" title={value}>
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
