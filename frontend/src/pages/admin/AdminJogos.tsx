import React, { useState, useEffect, useRef, useMemo } from "react";
import { api } from "../../services/api";
import { Fixture, Standing, Team, NewsArticle } from "../../types";
import {
  STATIC_FIXTURES,
  STATIC_STANDINGS,
  STATIC_TEAMS,
  STATIC_NEWS,
} from "../../data/staticData";
import {
  asList,
  formatDayMonth,
  formatFull,
  formatMatchDay,
  formatTime,
  safeDate,
} from "../../lib/format";
import { isPlayed, outcomeOf, sortByDate } from "../../lib/fixtures";
import { TeamBadge } from "../../components/ui/TeamBadge";
import {
  Calendar,
  Trophy,
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

type MainTab = "jogos" | "tabela";

const FORM_LABEL: Record<string, { short: string; long: string; cls: string }> = {
  W: { short: "V", long: "Vitória", cls: "w" },
  D: { short: "E", long: "Empate", cls: "d" },
  L: { short: "D", long: "Derrota", cls: "l" },
};

function toDatetimeLocal(iso?: string | null): string {
  const d = safeDate(iso) || new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export const AdminJogos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>("jogos");

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>(Object.values(STATIC_TEAMS));
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------- TAB 1: FIXTURE FORM STATES ----------------
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [opponentId, setOpponentId] = useState<string>("tupinamba");
  const [isHome, setIsHome] = useState<boolean>(true);
  const [competition, setCompetition] = useState<string>("Pro Clubs · Série A");
  const [round, setRound] = useState<string>("7ª rodada");
  const [matchDate, setMatchDate] = useState<string>(() =>
    toDatetimeLocal("2026-10-06T22:00:00Z")
  );
  const [venue, setVenue] = useState<string>("Lovebomb Arena");
  const [hasScore, setHasScore] = useState<boolean>(false);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(false);
  const [newsId, setNewsId] = useState<string>("");

  // ---------------- TAB 2: STANDING FORM STATES ----------------
  const [selectedTeamId, setSelectedTeamId] = useState<string>("mfc");
  const [stMatches, setStMatches] = useState<number>(6);
  const [stWins, setStWins] = useState<number>(5);
  const [stDraws, setStDraws] = useState<number>(0);
  const [stLosses, setStLosses] = useState<number>(1);
  const [stGoalsFor, setStGoalsFor] = useState<number>(15);
  const [stGoalsAgainst, setStGoalsAgainst] = useState<number>(6);
  const [stForm, setStForm] = useState<string>("WWWWW");

  const formTopRef = useRef<HTMLDivElement>(null);

  const teamsById = useMemo(() => {
    const map: Record<string, Team> = { ...STATIC_TEAMS };
    for (const t of teams) {
      map[t.id] = { ...STATIC_TEAMS[t.id], ...t };
    }
    return map;
  }, [teams]);

  const opponentTeams = useMemo(
    () => Object.values(teamsById).filter((t) => t.id !== "mfc" && !t.isUs),
    [teamsById]
  );

  const loadAll = async () => {
    setLoading(true);
    try {
      const [fx, st, tm, nw] = await Promise.all([
        api.getFixtures(),
        api.getStandings(),
        api.getTeams(),
        api.getNews(),
      ]);
      const fxList = asList(fx, STATIC_FIXTURES);
      const stList = asList(st, STATIC_STANDINGS);
      setFixtures(fxList);
      setStandings(stList);
      setTeams(asList(tm, Object.values(STATIC_TEAMS)));
      setNewsList(asList(nw, STATIC_NEWS));
      return { fxList, stList };
    } catch {
      setFixtures(STATIC_FIXTURES);
      setStandings(STATIC_STANDINGS);
      setTeams(Object.values(STATIC_TEAMS));
      setNewsList(STATIC_NEWS);
      return { fxList: STATIC_FIXTURES, stList: STATIC_STANDINGS };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll().then(({ stList }) => {
      const mfcRow = stList.find((s) => s.teamId === "mfc") || stList[0];
      if (mfcRow) {
        populateStandingForm(mfcRow);
      }
    });
  }, []);

  const populateStandingForm = (row: Standing) => {
    setSelectedTeamId(row.teamId);
    setStMatches(row.matches ?? 0);
    setStWins(row.wins ?? 0);
    setStDraws(row.draws ?? 0);
    setStLosses(row.losses ?? 0);
    setStGoalsFor(row.goalsFor ?? 0);
    setStGoalsAgainst(row.goalsAgainst ?? 0);
    setStForm((row.form || "").toUpperCase().slice(0, 5));
  };

  const handleSelectStandingTeam = (teamId: string) => {
    const found = standings.find((s) => s.teamId === teamId);
    if (found) {
      populateStandingForm(found);
    } else {
      setSelectedTeamId(teamId);
    }
  };

  // ---------------- FIXTURE HANDLERS ----------------
  const handleStartNewFixture = () => {
    setEditingFixture(null);
    setOpponentId(opponentTeams[0]?.id || "tupinamba");
    setIsHome(true);
    setCompetition("Pro Clubs · Série A");
    setRound(`${fixtures.length + 1}ª rodada`);
    setMatchDate(toDatetimeLocal(new Date().toISOString()));
    setVenue("Lovebomb Arena");
    setHasScore(false);
    setHomeScore(0);
    setAwayScore(0);
    setIsNext(false);
    setNewsId("");
    setFeedback(null);
    setActiveTab("jogos");
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartEditFixture = (f: Fixture) => {
    setEditingFixture(f);
    setOpponentId(f.opponentId);
    setIsHome(Boolean(f.isHome));
    setCompetition(f.competition || "Pro Clubs · Série A");
    setRound(f.round || "");
    setMatchDate(toDatetimeLocal(f.matchDate));
    setVenue(f.venue || (f.isHome ? "Lovebomb Arena" : ""));
    const played = isPlayed(f);
    setHasScore(played);
    setHomeScore(f.homeScore ?? 0);
    setAwayScore(f.awayScore ?? 0);
    setIsNext(Boolean(f.isNext));
    setNewsId(f.newsId || "");
    setFeedback(null);
    setActiveTab("jogos");
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleIsHomeChange = (home: boolean) => {
    setIsHome(home);
    if (home && (!venue || venue.startsWith("Estádio") || venue.startsWith("Arena"))) {
      setVenue("Lovebomb Arena");
    } else if (!home && venue === "Lovebomb Arena") {
      const opp = teamsById[opponentId];
      setVenue(opp ? `Arena ${opp.shortName}` : "Estádio Visitante");
    }
  };

  const handleSubmitFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const parsedDate = safeDate(matchDate) || new Date();
    const payload: Partial<Fixture> = {
      opponentId,
      isHome,
      competition: competition.trim() || "Pro Clubs · Série A",
      round: round.trim() || "Rodada",
      matchDate: parsedDate.toISOString(),
      venue: venue.trim() || (isHome ? "Lovebomb Arena" : null),
      homeScore: hasScore ? Number(homeScore) : null,
      awayScore: hasScore ? Number(awayScore) : null,
      isNext,
      newsId: newsId.trim() || null,
    };

    try {
      if (editingFixture) {
        await api.updateFixture(editingFixture.id, payload);
        setFeedback({ type: "ok", text: "Partida atualizada com sucesso!" });
      } else {
        await api.createFixture(payload);
        setFeedback({ type: "ok", text: "Nova partida adicionada ao calendário!" });
        handleStartNewFixture();
      }
      await loadAll();
    } catch (err: any) {
      setFeedback({
        type: "err",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Erro ao salvar a partida. Verifique os dados informados.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFixture = async (f: Fixture) => {
    const opp = teamsById[f.opponentId];
    const label = `${f.isHome ? "Meldina FC" : opp?.name || f.opponentId} × ${
      !f.isHome ? "Meldina FC" : opp?.name || f.opponentId
    } (${f.round})`;
    if (!window.confirm(`Tem certeza que deseja excluir a partida "${label}"?`)) return;

    try {
      await api.deleteFixture(f.id);
      setFixtures((prev) => prev.filter((item) => item.id !== f.id));
      if (editingFixture?.id === f.id) {
        handleStartNewFixture();
      }
      setFeedback({ type: "ok", text: `Partida ${label} removida.` });
    } catch (err: any) {
      setFeedback({
        type: "err",
        text: err?.response?.data?.error || "Não foi possível excluir a partida.",
      });
    }
  };

  // ---------------- STANDING HANDLERS ----------------
  const addFormResult = (char: "W" | "D" | "L") => {
    setStForm((prev) => (prev + char).slice(-5));
  };

  const handleSubmitStanding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await api.updateStanding(selectedTeamId, {
        matches: Number(stMatches),
        wins: Number(stWins),
        draws: Number(stDraws),
        losses: Number(stLosses),
        goalsFor: Number(stGoalsFor),
        goalsAgainst: Number(stGoalsAgainst),
        form: stForm.toUpperCase().replace(/[^WDL]/g, "").slice(0, 5),
      });
      const teamName = teamsById[selectedTeamId]?.name || selectedTeamId;
      setFeedback({
        type: "ok",
        text: `Classificação de ${teamName} atualizada na Tabela Série A!`,
      });
      await loadAll();
    } catch (err: any) {
      setFeedback({
        type: "err",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Erro ao atualizar a tabela de classificação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- LIVE PREVIEW COMPUTATIONS ----------------
  const meldinaTeam = teamsById.mfc || STATIC_TEAMS.mfc;
  const previewOpponent = teamsById[opponentId] || STATIC_TEAMS.tupinamba;

  const previewFixture: Fixture = {
    id: editingFixture?.id || "preview-fx",
    matchDate: (safeDate(matchDate) || new Date()).toISOString(),
    competition: competition || "Pro Clubs · Série A",
    round: round || "7ª rodada",
    isHome,
    opponentId,
    opponent: previewOpponent,
    homeScore: hasScore ? Number(homeScore) : null,
    awayScore: hasScore ? Number(awayScore) : null,
    venue: venue || (isHome ? "Lovebomb Arena" : null),
    newsId: newsId || null,
    isNext,
  };

  const previewDate = safeDate(previewFixture.matchDate) || new Date();
  const previewHome = previewFixture.isHome
    ? { team: meldinaTeam, name: "Meldina FC" }
    : { team: previewOpponent, name: previewOpponent?.name || opponentId };
  const previewAway = previewFixture.isHome
    ? { team: previewOpponent, name: previewOpponent?.name || opponentId }
    : { team: meldinaTeam, name: "Meldina FC" };
  const previewOutcome = hasScore ? outcomeOf(previewFixture) : null;

  const orderedFixtures = useMemo(() => sortByDate(fixtures), [fixtures]);

  // Live Standings Table with unsaved edits applied & re-sorted
  const liveStandings = useMemo(() => {
    const base = standings.length > 0 ? standings : STATIC_STANDINGS;
    const updated = base.map((row) => {
      if (row.teamId !== selectedTeamId) {
        const pts = row.points ?? row.wins * 3 + row.draws;
        const gd = row.goalDiff ?? row.goalsFor - row.goalsAgainst;
        return { ...row, points: pts, goalDiff: gd };
      }
      const wins = Number(stWins) || 0;
      const draws = Number(stDraws) || 0;
      const losses = Number(stLosses) || 0;
      const gf = Number(stGoalsFor) || 0;
      const ga = Number(stGoalsAgainst) || 0;
      return {
        ...row,
        matches: Number(stMatches) || 0,
        wins,
        draws,
        losses,
        goalsFor: gf,
        goalsAgainst: ga,
        points: wins * 3 + draws,
        goalDiff: gf - ga,
        form: stForm.toUpperCase().replace(/[^WDL]/g, "").slice(0, 5),
      };
    });

    return [...updated]
      .sort((a, b) => {
        const ptsDiff = (b.points ?? 0) - (a.points ?? 0);
        if (ptsDiff !== 0) return ptsDiff;
        const winsDiff = b.wins - a.wins;
        if (winsDiff !== 0) return winsDiff;
        const gdDiff = (b.goalDiff ?? 0) - (a.goalDiff ?? 0);
        if (gdDiff !== 0) return gdDiff;
        return b.goalsFor - a.goalsFor;
      })
      .map((row, idx) => ({ ...row, position: idx + 1 }));
  }, [
    standings,
    selectedTeamId,
    stMatches,
    stWins,
    stDraws,
    stLosses,
    stGoalsFor,
    stGoalsAgainst,
    stForm,
  ]);

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
            <p className="eyebrow">Pro Clubs · Série A & Playoffs</p>
            <h1 className="display">Jogos & Classificação</h1>
            <p>
              Gerencie o calendário de partidas, lance resultados oficiais e atualize a
              tabela da Série A com recálculo automático de pontos e saldo de gols.
            </p>
          </div>
          <div className="shrink-0 relative z-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleStartNewFixture}
              className="btn text-xs flex items-center gap-2"
            >
              <PlusCircle size={16} /> + Agendar Partida
            </button>
          </div>
        </div>
      </section>

      {/* ABAS PRINCIPAIS */}
      <div className="tabs" role="tablist" aria-label="Gerenciar jogos ou tabela">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "jogos"}
          onClick={() => setActiveTab("jogos")}
          className={`tab flex items-center gap-2 ${
            activeTab === "jogos" ? "is-active" : ""
          }`}
        >
          <Calendar size={15} /> Calendário de Jogos ({fixtures.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tabela"}
          onClick={() => setActiveTab("tabela")}
          className={`tab flex items-center gap-2 ${
            activeTab === "tabela" ? "is-active" : ""
          }`}
        >
          <Trophy size={15} /> Tabela Série A ({liveStandings.length} clubes)
        </button>
      </div>

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

      {/* =====================================================================
          ABA 1: CALENDÁRIO DE JOGOS
         ===================================================================== */}
      {activeTab === "jogos" && (
        <div ref={formTopRef} className="space-y-10">
          <div className="admin-split">
            {/* COLUNA ESQUERDA: FORMULÁRIO DA PARTIDA */}
            <div className="form-card space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-linha-escura pb-4">
                <div>
                  <p className="eyebrow mb-1">
                    {editingFixture ? "Modo de Edição" : "Calendário Oficial"}
                  </p>
                  <h2 className="display text-3xl flex items-center gap-2.5">
                    {editingFixture ? (
                      <>
                        <Edit3 size={22} className="text-ouro" /> Editar Partida ({editingFixture.round})
                      </>
                    ) : (
                      <>
                        <PlusCircle size={22} className="text-ouro" /> Nova Partida
                      </>
                    )}
                  </h2>
                </div>
                {editingFixture && (
                  <button
                    type="button"
                    onClick={handleStartNewFixture}
                    className="btn btn--sm btn--ghost text-xs"
                  >
                    + Nova Partida
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitFixture} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="fx-opponent">Adversário</label>
                    <select
                      id="fx-opponent"
                      value={opponentId}
                      onChange={(e) => setOpponentId(e.target.value)}
                    >
                      {opponentTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.acronym})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="fx-home">Mando de Campo</label>
                    <select
                      id="fx-home"
                      value={isHome ? "home" : "away"}
                      onChange={(e) => handleIsHomeChange(e.target.value === "home")}
                    >
                      <option value="home">Mandante (Lovebomb Arena)</option>
                      <option value="away">Visitante (Fora de casa)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="fx-comp">Competição</label>
                    <input
                      id="fx-comp"
                      type="text"
                      list="fx-comp-list"
                      value={competition}
                      onChange={(e) => setCompetition(e.target.value)}
                      required
                    />
                    <datalist id="fx-comp-list">
                      <option value="Pro Clubs · Série A" />
                      <option value="Playoffs de Elite" />
                      <option value="Copa EA" />
                    </datalist>
                  </div>

                  <div className="field">
                    <label htmlFor="fx-round">Rodada / Fase</label>
                    <input
                      id="fx-round"
                      type="text"
                      placeholder="Ex: 7ª rodada, Jogo decisivo..."
                      value={round}
                      onChange={(e) => setRound(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="fx-date">Data e Horário</label>
                    <input
                      id="fx-date"
                      type="datetime-local"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="fx-venue">Estádio / Local</label>
                    <input
                      id="fx-venue"
                      type="text"
                      placeholder="Ex: Lovebomb Arena"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status do Jogo: Agendado vs Encerrado */}
                <div className="p-4 rounded bg-white/5 border border-linha-escura space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ouro">
                      Status & Placar da Partida
                    </span>
                    <div className="tabs">
                      <button
                        type="button"
                        onClick={() => setHasScore(false)}
                        className={`tab text-xs py-1 px-3 ${!hasScore ? "is-active" : ""}`}
                      >
                        Agendado (Sem placar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasScore(true)}
                        className={`tab text-xs py-1 px-3 ${hasScore ? "is-active" : ""}`}
                      >
                        Encerrado (Com placar)
                      </button>
                    </div>
                  </div>

                  {hasScore && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-linha-escura">
                      <div className="field">
                        <label htmlFor="fx-homescore">
                          Gols Mandante ({previewHome.name})
                        </label>
                        <input
                          id="fx-homescore"
                          type="number"
                          min={0}
                          max={99}
                          value={homeScore}
                          onChange={(e) => setHomeScore(Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="fx-awayscore">
                          Gols Visitante ({previewAway.name})
                        </label>
                        <input
                          id="fx-awayscore"
                          type="number"
                          min={0}
                          max={99}
                          value={awayScore}
                          onChange={(e) => setAwayScore(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <label
                    htmlFor="fx-isnext"
                    className="flex items-center gap-3 p-3.5 rounded bg-white/5 border border-linha-escura cursor-pointer hover:border-ouro/50 transition-colors h-full"
                  >
                    <input
                      type="checkbox"
                      id="fx-isnext"
                      checked={isNext}
                      onChange={(e) => setIsNext(e.target.checked)}
                      className="accent-ouro w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        Marcar como Próximo Jogo
                      </span>
                      <span className="text-[11px] text-white/60 block">
                        Destaca na Matchbar da Home e no topo do calendário
                      </span>
                    </div>
                  </label>

                  <div className="field">
                    <label htmlFor="fx-news">Relato / Notícia Vinculada (Opcional)</label>
                    <select
                      id="fx-news"
                      value={newsId}
                      onChange={(e) => setNewsId(e.target.value)}
                    >
                      <option value="">— Nenhuma matéria vinculada —</option>
                      {newsList.map((n) => (
                        <option key={n.slug} value={n.slug}>
                          {n.title.slice(0, 48)} ({n.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="btn btn--grena py-3.5 px-8 text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Salvando..."
                      : editingFixture
                      ? "Salvar Partida →"
                      : "Adicionar ao Calendário →"}
                  </button>
                  {editingFixture && (
                    <button
                      type="button"
                      onClick={handleStartNewFixture}
                      className="btn btn--ghost text-xs"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* COLUNA DIREITA: PREVIEW AO VIVO DA PARTIDA */}
            <aside className="admin-preview-pane">
              <div className="admin-preview-box">
                <div className="admin-preview-box__head">
                  <span className="admin-preview-box__badge">
                    Preview ao Vivo · Confronto
                  </span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                    {previewFixture.competition}
                  </span>
                </div>

                <div className="admin-preview-box__body space-y-6">
                  {/* 1. Linha de Calendário (.fx idêntica a Jogos.tsx) */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2.5">
                      Exibição na lista de <code className="text-ouro">/jogos</code>:
                    </p>
                    <div
                      className={`fx !grid-cols-1 gap-4 text-center ${
                        previewFixture.isNext ? "is-next" : ""
                      }`}
                    >
                      <div className="fx__when">
                        <time dateTime={previewFixture.matchDate}>
                          <b>{formatDayMonth(previewDate)}</b>{" "}
                          <small className="ml-1">{formatTime(previewDate)}</small>
                        </time>
                        <span className="fx__comp">{previewFixture.round}</span>
                      </div>

                      <div className="fx__match">
                        <div className="fx__team justify-end text-right">
                          <span>{previewHome.name}</span>
                          <TeamBadge team={previewHome.team} />
                        </div>
                        <div className={`fx__score ${!hasScore ? "vs" : ""}`}>
                          {hasScore ? `${homeScore} × ${awayScore}` : "VS"}
                        </div>
                        <div className="fx__team">
                          <TeamBadge team={previewAway.team} />
                          <span>{previewAway.name}</span>
                        </div>
                      </div>

                      <div className="fx__act !items-center">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {previewOutcome && (
                            <span className={previewOutcome.tagClass}>
                              {previewOutcome.label}
                            </span>
                          )}
                          {previewFixture.isNext && (
                            <span className="result-tag t-next">Próximo jogo</span>
                          )}
                        </div>
                        {previewFixture.venue && (
                          <span className="fx__venue">
                            <MapPin aria-hidden="true" /> {previewFixture.venue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Card da Matchbar da Home */}
                  <div className="pt-4 border-t border-linha-escura">
                    <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2.5">
                      Exibição no Match Center da <code className="text-ouro">Home</code>:
                    </p>
                    <div className="p-5 rounded-md bg-noite border border-linha-escura">
                      {!hasScore ? (
                        <>
                          <div className="mc-label">
                            <span>Próximo Jogo</span>
                            <span className="text-ouro">{previewFixture.round}</span>
                          </div>
                          <div className="fixture">
                            <div className="team">
                              <TeamBadge team={previewHome.team} />
                              <span>{previewHome.name}</span>
                            </div>
                            <div className="fixture__mid">
                              <time
                                className="fixture__time"
                                dateTime={previewFixture.matchDate}
                              >
                                {formatTime(previewDate)}
                              </time>
                              <div className="fixture__date">
                                {formatMatchDay(previewDate)}
                              </div>
                              {previewFixture.venue && (
                                <div className="fixture__venue">
                                  <MapPin aria-hidden="true" />
                                  <span>{previewFixture.venue}</span>
                                </div>
                              )}
                            </div>
                            <div className="team">
                              <TeamBadge team={previewAway.team} />
                              <span>{previewAway.name}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mc-label">
                            <span>Último Resultado</span>
                            {previewOutcome && (
                              <span className={previewOutcome.tagClass}>
                                {previewOutcome.label}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center py-2">
                            <div className="score">
                              <span>{homeScore}</span>
                              <i>×</i>
                              <span>{awayScore}</span>
                            </div>
                            <p className="text-xs text-white/75 mt-2 uppercase tracking-wider font-semibold">
                              {previewHome.name} {homeScore} × {awayScore}{" "}
                              {previewAway.name}
                            </p>
                            <span className="text-[11px] text-ouro uppercase tracking-widest mt-1">
                              {previewFixture.round}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* LISTA COMPLETA DO CALENDÁRIO (.fixtures / .fx) */}
          <section className="space-y-4">
            <div className="flex items-end justify-between border-b border-linha-escura pb-4">
              <div>
                <p className="eyebrow mb-1">Temporada 2026</p>
                <h2 className="display text-3xl">
                  Partidas Cadastradas ({orderedFixtures.length})
                </h2>
              </div>
            </div>

            {loading ? (
              <p className="text-white/70 py-6">Carregando calendário…</p>
            ) : (
              <ol className="fixtures">
                {orderedFixtures.map((f) => {
                  const finished = isPlayed(f);
                  const date = safeDate(f.matchDate);
                  const opp = teamsById[f.opponentId] || f.opponent;
                  const oppName = opp?.name || f.opponentId;
                  const home = f.isHome
                    ? { team: meldinaTeam, name: "Meldina FC" }
                    : { team: opp, name: oppName };
                  const away = f.isHome
                    ? { team: opp, name: oppName }
                    : { team: meldinaTeam, name: "Meldina FC" };
                  const outcome = finished ? outcomeOf(f) : null;
                  const venueText = f.venue || (f.isHome ? "Lovebomb Arena" : null);
                  const isBeingEdited = editingFixture?.id === f.id;

                  return (
                    <li
                      key={f.id}
                      className={`fx ${f.isNext ? "is-next" : ""} ${
                        isBeingEdited ? "!border-ouro ring-2 ring-ouro/50" : ""
                      }`}
                    >
                      <div className="fx__when">
                        {date ? (
                          <time dateTime={f.matchDate}>
                            <span className="sr-only">{formatFull(date)}</span>
                            <b aria-hidden="true">{formatDayMonth(date)}</b>
                            <small aria-hidden="true">{formatTime(date)}</small>
                          </time>
                        ) : (
                          <b>Data a definir</b>
                        )}
                        <span className="fx__comp">{f.round}</span>
                      </div>

                      <div className="fx__match">
                        <div className="fx__team" aria-hidden="true">
                          <span>{home.name}</span>
                          <TeamBadge team={home.team} />
                        </div>
                        <div
                          className={`fx__score ${!finished ? "vs" : ""}`}
                          aria-hidden="true"
                        >
                          {finished ? `${f.homeScore} × ${f.awayScore}` : "VS"}
                        </div>
                        <div className="fx__team" aria-hidden="true">
                          <TeamBadge team={away.team} />
                          <span>{away.name}</span>
                        </div>
                      </div>

                      <div className="fx__act">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {outcome && (
                            <span className={outcome.tagClass}>{outcome.label}</span>
                          )}
                          {f.isNext && (
                            <span className="result-tag t-next">Próximo jogo</span>
                          )}
                        </div>
                        {venueText && (
                          <span className="fx__venue">
                            <MapPin aria-hidden="true" /> {venueText}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditFixture(f)}
                            className="btn btn--sm text-[11px] py-1 px-3 flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFixture(f)}
                            className="p-1.5 rounded bg-grena/30 hover:bg-erro text-white transition-colors"
                            title="Excluir partida"
                            aria-label="Excluir partida"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          ABA 2: TABELA SÉRIE A
         ===================================================================== */}
      {activeTab === "tabela" && (
        <div className="admin-split">
          {/* COLUNA ESQUERDA: EDITOR DE DESEMPENHO DO CLUBE */}
          <div className="form-card space-y-6">
            <div className="border-b border-linha-escura pb-4">
              <p className="eyebrow mb-1">Classificação Série A 2026</p>
              <h2 className="display text-3xl flex items-center gap-2.5">
                <Trophy size={22} className="text-ouro" /> Atualizar Desempenho
              </h2>
              <p className="text-xs text-white/65 mt-1">
                Selecione um clube abaixo (ou clique diretamente na linha da tabela ao
                lado) para editar vitórias, saldo de gols e sequência recente.
              </p>
            </div>

            <form onSubmit={handleSubmitStanding} className="space-y-5">
              <div className="field">
                <label htmlFor="st-team">Clube da Série A</label>
                <select
                  id="st-team"
                  value={selectedTeamId}
                  onChange={(e) => handleSelectStandingTeam(e.target.value)}
                >
                  {liveStandings.map((s) => {
                    const t = teamsById[s.teamId] || s.team;
                    return (
                      <option key={s.teamId} value={s.teamId}>
                        {s.position}º — {t?.name || s.teamId} ({s.points} pts)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="field">
                  <label htmlFor="st-matches">Jogos (J)</label>
                  <input
                    id="st-matches"
                    type="number"
                    min={0}
                    value={stMatches}
                    onChange={(e) => setStMatches(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="st-wins">Vitórias (V)</label>
                  <input
                    id="st-wins"
                    type="number"
                    min={0}
                    value={stWins}
                    onChange={(e) => setStWins(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="st-draws">Empates (E)</label>
                  <input
                    id="st-draws"
                    type="number"
                    min={0}
                    value={stDraws}
                    onChange={(e) => setStDraws(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="st-losses">Derrotas (D)</label>
                  <input
                    id="st-losses"
                    type="number"
                    min={0}
                    value={stLosses}
                    onChange={(e) => setStLosses(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                <div className="field">
                  <label htmlFor="st-gf">Gols Pró (GP)</label>
                  <input
                    id="st-gf"
                    type="number"
                    min={0}
                    value={stGoalsFor}
                    onChange={(e) => setStGoalsFor(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="st-ga">Gols Contra (GC)</label>
                  <input
                    id="st-ga"
                    type="number"
                    min={0}
                    value={stGoalsAgainst}
                    onChange={(e) => setStGoalsAgainst(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="stat rounded">
                  <b>{(Number(stWins) || 0) * 3 + (Number(stDraws) || 0)}</b>
                  <small>Pontos (Auto)</small>
                </div>
                <div className="stat rounded">
                  <b>{(Number(stGoalsFor) || 0) - (Number(stGoalsAgainst) || 0)}</b>
                  <small>Saldo (SG)</small>
                </div>
              </div>

              {/* Últimos Jogos (Form W/D/L) */}
              <div className="field">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label htmlFor="st-form">Últimos 5 Jogos (W = Vitória, D = Empate, L = Derrota)</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => addFormResult("W")}
                      className="px-2.5 py-1 rounded text-[11px] font-bold bg-vitoria text-white"
                      title="Adicionar Vitória (W)"
                    >
                      + V (W)
                    </button>
                    <button
                      type="button"
                      onClick={() => addFormResult("D")}
                      className="px-2.5 py-1 rounded text-[11px] font-bold bg-cinza text-white"
                      title="Adicionar Empate (D)"
                    >
                      + E (D)
                    </button>
                    <button
                      type="button"
                      onClick={() => addFormResult("L")}
                      className="px-2.5 py-1 rounded text-[11px] font-bold bg-grena-2 text-white"
                      title="Adicionar Derrota (L)"
                    >
                      + D (L)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStForm("")}
                      className="px-2 py-1 rounded text-[11px] bg-white/10 text-white/70 hover:text-white flex items-center gap-1"
                      title="Limpar sequência"
                    >
                      <RotateCcw size={11} /> Limpar
                    </button>
                  </div>
                </div>
                <input
                  id="st-form"
                  type="text"
                  maxLength={5}
                  placeholder="Ex: WWWWW"
                  value={stForm}
                  onChange={(e) =>
                    setStForm(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^WDL]/g, "")
                        .slice(0, 5)
                    )
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn--grena py-3.5 px-8 text-sm w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando Tabela..." : "Salvar Classificação do Clube →"}
              </button>
            </form>
          </div>

          {/* COLUNA DIREITA: PREVIEW AO VIVO DA TABELA (.table-wrap / .table) */}
          <aside className="admin-preview-pane">
            <div className="admin-preview-box">
              <div className="admin-preview-box__head">
                <span className="admin-preview-box__badge">
                  Preview ao Vivo · Tabela Série A
                </span>
                <span className="text-xs text-white/60">
                  Clique em um clube para editar
                </span>
              </div>

              <div className="admin-preview-box__body">
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Pos</th>
                        <th scope="col">Clube</th>
                        <th scope="col"><abbr title="Jogos">J</abbr></th>
                        <th scope="col"><abbr title="Vitórias">V</abbr></th>
                        <th scope="col"><abbr title="Empates">E</abbr></th>
                        <th scope="col"><abbr title="Derrotas">D</abbr></th>
                        <th scope="col"><abbr title="Gols pró">GP</abbr></th>
                        <th scope="col"><abbr title="Gols contra">GC</abbr></th>
                        <th scope="col"><abbr title="Saldo de gols">SG</abbr></th>
                        <th scope="col"><abbr title="Pontos">PTS</abbr></th>
                        <th scope="col">Últimos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveStandings.map((s, idx) => {
                        const team = teamsById[s.teamId] ?? s.team;
                        const isUs = s.teamId === "mfc" || team?.isUs;
                        const isSelected = s.teamId === selectedTeamId;
                        const pos = s.position ?? idx + 1;
                        const zone =
                          idx < 4
                            ? "zone-g"
                            : idx >= liveStandings.length - 2
                            ? "zone-r"
                            : "";

                        return (
                          <tr
                            key={s.teamId}
                            onClick={() => handleSelectStandingTeam(s.teamId)}
                            className={`cursor-pointer transition-colors ${
                              isUs ? "is-us" : "hover:bg-white/5"
                            } ${isSelected ? "ring-1 ring-inset ring-ouro bg-ouro/10" : ""}`}
                          >
                            <td>
                              <span className={`pos-badge ${zone}`}>{pos}</span>
                            </td>
                            <td className="t">
                              <TeamBadge team={team} small />
                              <span>{team?.name || s.teamId}</span>
                            </td>
                            <td>{s.matches}</td>
                            <td>{s.wins}</td>
                            <td>{s.draws}</td>
                            <td>{s.losses}</td>
                            <td>{s.goalsFor}</td>
                            <td>{s.goalsAgainst}</td>
                            <td>{s.goalDiff}</td>
                            <td className="pts text-ouro font-bold">{s.points}</td>
                            <td>
                              <div className="form-dots">
                                {(s.form ?? "").split("").map((c, i) => {
                                  const f = FORM_LABEL[c] ?? FORM_LABEL.L;
                                  return (
                                    <i key={i} className={f.cls} title={f.long}>
                                      <span aria-hidden="true">{f.short}</span>
                                    </i>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="table-legend">
                  <span>
                    <i className="pos-badge zone-g" aria-hidden="true"></i> Zona de
                    classificação
                  </span>
                  <span>
                    <i className="pos-badge zone-r" aria-hidden="true"></i> Zona de
                    rebaixamento
                  </span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
