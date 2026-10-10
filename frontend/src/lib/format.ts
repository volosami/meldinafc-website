/* Formatação pt-BR compartilhada entre as páginas. */

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateShort = new Intl.DateTimeFormat("pt-BR");
const dateLong = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });
const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const full = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" });
const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
const month = new Intl.DateTimeFormat("pt-BR", { month: "short" });

/** "dom." → "Dom", "out." → "Out" */
const cap = (s: string) => s.replace(".", "").replace(/^\p{L}/u, (c) => c.toUpperCase());

export function formatBRL(value: number): string {
  return Number.isFinite(value) ? brl.format(value) : "";
}

/** Data válida ou null (evita "Invalid Date" na tela). */
export function safeDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const formatDateShort = (d: Date) => dateShort.format(d);
export const formatDateLong = (d: Date) => dateLong.format(d);
/** "01 Set" */
export const formatDayMonth = (d: Date) => `${day.format(d)} ${cap(month.format(d))}`;
export const formatTime = (d: Date) => time.format(d);
export const formatFull = (d: Date) => full.format(d);

/** "Dom · 11 Out" */
export function formatMatchDay(d: Date): string {
  return `${cap(weekday.format(d))} · ${day.format(d)} ${cap(month.format(d))}`;
}

/** A API pode responder algo que não é lista (ex.: HTML de fallback); nesse caso usa o fallback. */
export function asList<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}
