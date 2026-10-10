import { Fixture, Team } from "../types";
import { STATIC_TEAMS } from "../data/staticData";

// Uma partida segue como "próxima" até 3h depois do início (jogo em andamento).
export const MATCH_WINDOW_MS = 3 * 60 * 60 * 1000;

export function kickoff(f: Fixture): number {
  return new Date(f.matchDate).getTime();
}

export function isPlayed(f: Fixture): boolean {
  return f.homeScore != null && f.awayScore != null;
}

export function isUpcoming(f: Fixture, now: number): boolean {
  const t = kickoff(f);
  return !isPlayed(f) && !Number.isNaN(t) && t + MATCH_WINDOW_MS > now;
}

/** Usa a próxima partida da API se ainda não passou; senão, a primeira futura do calendário. */
export function pickNextMatch(apiNext: Fixture | null, fixtures: Fixture[], now: number): Fixture | null {
  if (apiNext && isUpcoming(apiNext, now)) return apiNext;
  return (
    fixtures
      .filter((f) => isUpcoming(f, now))
      .sort((a, b) => kickoff(a) - kickoff(b))[0] ?? null
  );
}

export function pickLastResult(fixtures: Fixture[]): Fixture | null {
  const played = fixtures.filter(isPlayed);
  const dated = played.filter((f) => !Number.isNaN(kickoff(f)));
  if (dated.length) return [...dated].sort((a, b) => kickoff(b) - kickoff(a))[0];
  return played[played.length - 1] ?? null;
}

/** Ordena por data; partidas sem data válida vão para o fim, na ordem original. */
export function sortByDate(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((a, b) => {
    const ta = kickoff(a);
    const tb = kickoff(b);
    if (Number.isNaN(ta)) return Number.isNaN(tb) ? 0 : 1;
    if (Number.isNaN(tb)) return -1;
    return ta - tb;
  });
}

export function opponentOf(f: Fixture): Team | undefined {
  return f.opponent ?? STATIC_TEAMS[f.opponentId];
}

export type Outcome = { label: string; tagClass: string };

/** Resultado do ponto de vista do Meldina (homeScore é sempre do mandante). */
export function outcomeOf(f: Fixture): Outcome {
  const us = (f.isHome ? f.homeScore : f.awayScore) ?? 0;
  const them = (f.isHome ? f.awayScore : f.homeScore) ?? 0;
  if (us > them) return { label: "Vitória", tagClass: "result-tag" };
  if (us < them) return { label: "Derrota", tagClass: "result-tag l" };
  return { label: "Empate", tagClass: "result-tag d" };
}
