import React, { useState } from "react";
import { normalizeAssetUrl } from "../../lib/format";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Classe do painel exibido no lugar da imagem quando ela falta ou falha. */
  fallbackClassName?: string;
};

/** Imagem que, se faltar ou não carregar, vira um painel grená com o escudo. */
export const FallbackImage: React.FC<Props> = ({ src, fallbackClassName, onError, ...rest }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const normalizedSrc = normalizeAssetUrl(src);

  if (!normalizedSrc || failedSrc === normalizedSrc) {
    return (
      <div className={`img-fallback ${fallbackClassName ?? ""}`} aria-hidden="true">
        <img src="/assets/img/escudo-mono.png" alt="" />
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      decoding="async"
      {...rest}
      onError={(e) => {
        setFailedSrc(normalizedSrc);
        onError?.(e);
      }}
    />
  );
};
