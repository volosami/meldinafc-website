import React from "react";
import { Team } from "../../types";

/** Escudo do time: o do Meldina, o logo cadastrado ou um selo com a sigla e as cores do clube. */
export const TeamBadge: React.FC<{ team?: Team; small?: boolean; className?: string }> = ({
  team,
  small,
  className,
}) => {
  if (team?.isUs || team?.id === "mfc") {
    return <img className={className} src="/assets/img/escudo-sm.png" alt="" />;
  }
  if (team?.logoUrl) {
    return <img className={className} src={team.logoUrl} alt="" />;
  }
  return (
    <span
      className={`team-badge${small ? " team-badge--sm" : ""} ${className ?? ""}`}
      style={{ background: team?.color1 || undefined, color: team?.color2 || undefined }}
      aria-hidden="true"
    >
      {team?.acronym || "FC"}
    </span>
  );
};
