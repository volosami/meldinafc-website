import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { Player } from "../types";
import { useModalFocus } from "../hooks/useModalFocus";
import { normalizeAssetUrl } from "../lib/format";

/** Perfil do jogador em diálogo modal acessível (Home e Elenco). */
export const PlayerDialog: React.FC<{ player: Player; onClose: () => void }> = ({ player, onClose }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalFocus(true, boxRef, onClose, closeRef);

  const normalizedPhoto = normalizeAssetUrl(player.photoUrl);

  return (
    <div className="modal is-open">
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true"></div>
      <div
        ref={boxRef}
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-dialog-title"
      >
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Fechar perfil">
          <X aria-hidden="true" />
        </button>
        <div className="profile">
          <div className={`profile__media ${player.position === "Goleiro" ? "gk" : ""}`}>
            <img src={normalizedPhoto || "/assets/img/escudo-mono.png"} alt="" />
            <span className="num" aria-hidden="true">{player.number}</span>
          </div>
          <div className="profile__body">
            <p className="eyebrow">{player.position} · Camisa {player.number}</p>
            <h2 className="display" id="player-dialog-title">{player.name}</h2>
            {(player.isCaptain || player.roleTitle) && (
              <p className="flex flex-wrap gap-2">
                {player.isCaptain && <span className="captain">Capitão</span>}
                {player.roleTitle && <span className="captain captain--role">{player.roleTitle}</span>}
              </p>
            )}
            <div className="profile__meta">
              <div>
                <small>Pé preferido</small>
                <b>{player.preferredFoot}</b>
              </div>
              <div>
                <small>No clube desde</small>
                <b>{player.joinedYear}</b>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <b>{player.matches}</b>
                <small>Jogos</small>
              </div>
              <div className="stat">
                <b>{player.goals}</b>
                <small>Gols</small>
              </div>
              <div className="stat">
                <b>{player.assists}</b>
                <small>Assistências</small>
              </div>
              {player.extraKey && (
                <div className="stat">
                  <b>{player.extraValue}</b>
                  <small>{player.extraKey}</small>
                </div>
              )}
            </div>
            <p className="profile__bio">{player.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fotos do elenco têm versão reduzida em /players/thumbs/ para os cards (~4x mais leve).
// Fotos enviadas pelo painel não têm thumb: nesse caso (ou se a thumb falhar) usa a original.
function thumbOf(url: string): string {
  const norm = normalizeAssetUrl(url);
  return norm.startsWith("/assets/players/") ? norm.replace("/assets/players/", "/assets/players/thumbs/") : norm;
}

const CardPhoto: React.FC<{ src: string }> = ({ src }) => {
  const [failedThumb, setFailedThumb] = useState<string | null>(null);
  const normSrc = normalizeAssetUrl(src);
  const thumb = thumbOf(normSrc);
  const useFull = failedThumb === thumb;
  return (
    <img
      src={useFull ? normSrc : thumb}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => thumb !== normSrc && setFailedThumb(thumb)}
    />
  );
};

/** Card de jogador que abre o perfil; lido uma única vez por leitores de tela. */
export const PlayerCard: React.FC<{ player: Player; onOpen: (p: Player) => void }> = ({ player: p, onOpen }) => (
  <button
    type="button"
    className={`player-card ${p.position === "Goleiro" ? "player-card--gk" : ""}`}
    onClick={() => onOpen(p)}
    aria-haspopup="dialog"
    aria-label={`${p.name}, ${p.position}, camisa ${p.number}${p.isCaptain ? ", capitão" : ""}. Ver perfil`}
  >
    <CardPhoto src={normalizeAssetUrl(p.photoUrl)} />
    <span className="player-card__num" aria-hidden="true">{p.number}</span>
    <div className="player-card__info" aria-hidden="true">
      <div>
        {p.isCaptain && <span className="captain captain--sm">C</span>}
        <span className="player-card__pos">{p.position}</span>
        <span className="player-card__name">{p.name}</span>
      </div>
      <span className="player-card__n">{p.number}</span>
    </div>
    <span className="player-card__bar"></span>
  </button>
);
