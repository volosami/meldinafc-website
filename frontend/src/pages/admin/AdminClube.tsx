import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { MFC_INFO } from "../../data/staticData";
import {
  Shield,
  Building,
  Award,
  User,
  Quote,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const AdminClube: React.FC = () => {
  const [stadium, setStadium] = useState(MFC_INFO.estadio);
  const [coach, setCoach] = useState(MFC_INFO.tecnico);
  const [president, setPresident] = useState(MFC_INFO.presidente);
  const [motto, setMotto] = useState(MFC_INFO.lema);
  const [season, setSeason] = useState<number>(MFC_INFO.temporada);
  const [foundationYear, setFoundationYear] = useState<number>(MFC_INFO.fundacao);
  const [league, setLeague] = useState(MFC_INFO.liga);
  const [division, setDivision] = useState(MFC_INFO.divisao);
  const [programName, setProgramName] = useState(MFC_INFO.programa);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadClub() {
      const data = await api.getClubInfo();
      if (cancelled || !data) return;
      if (data.stadium) setStadium(data.stadium);
      if (data.coach) setCoach(data.coach);
      if (data.president) setPresident(data.president);
      if (data.motto) setMotto(data.motto);
      if (data.season) setSeason(Number(data.season));
      if (data.foundationYear) setFoundationYear(Number(data.foundationYear));
      if (data.league) setLeague(data.league);
      if (data.division) setDivision(data.division);
      if (data.programName) setProgramName(data.programName);
    }
    loadClub();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await api.updateClubInfo({
        stadium: stadium.trim(),
        coach: coach.trim(),
        president: president.trim(),
        motto: motto.trim(),
        season: Number(season),
        foundationYear: Number(foundationYear),
        league: league.trim(),
        division: division.trim(),
        programName: programName.trim(),
      });
      setFeedback({
        type: "ok",
        text: "Identidade institucional do Meldina FC atualizada com sucesso!",
      });
    } catch (err: any) {
      setFeedback({
        type: "err",
        text:
          err?.response?.data?.error ||
          "Erro ao atualizar as informações institucionais do clube.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. HEADER (.admin-hero) */}
      <section className="admin-hero">
        <img
          className="admin-hero__mark"
          src="/assets/img/monograma-outline.png"
          alt=""
        />
        <div className="wrap">
          <p className="eyebrow">Institucional · Identidade Oficial</p>
          <h1 className="display">Clube & Estádio</h1>
          <p>
            Configure os dados oficiais de fundação, presidência, comando técnico,
            estádio e lema exibidos na página institucional do Meldina FC.
          </p>
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

      {/* 2. SPLIT-VIEW: FORMULÁRIO + PREVIEW INSTITUCIONAL AO VIVO */}
      <div className="admin-split">
        {/* COLUNA ESQUERDA: FORMULÁRIO (.form-card) */}
        <div className="form-card space-y-6">
          <div className="border-b border-linha-escura pb-4">
            <p className="eyebrow mb-1">Diretoria & Estatuto</p>
            <h2 className="display text-3xl">Dados Oficiais do Clube</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="club-stadium" className="flex items-center gap-1.5">
                  <Building size={13} className="text-ouro" /> Estádio Oficial
                </label>
                <input
                  id="club-stadium"
                  type="text"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="Ex: Lovebomb Arena"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="club-motto" className="flex items-center gap-1.5">
                  <Quote size={13} className="text-ouro" /> Lema Oficial
                </label>
                <input
                  id="club-motto"
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Ex: Muito além do jogo"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="club-president" className="flex items-center gap-1.5">
                  <User size={13} className="text-ouro" /> Presidente
                </label>
                <input
                  id="club-president"
                  type="text"
                  value={president}
                  onChange={(e) => setPresident(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="club-coach" className="flex items-center gap-1.5">
                  <Shield size={13} className="text-ouro" /> Técnico / Treinador
                </label>
                <input
                  id="club-coach"
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="field">
                <label htmlFor="club-season" className="flex items-center gap-1.5">
                  <Award size={13} className="text-ouro" /> Temporada
                </label>
                <input
                  id="club-season"
                  type="number"
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="club-foundation" className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-ouro" /> Fundação
                </label>
                <input
                  id="club-foundation"
                  type="number"
                  value={foundationYear}
                  onChange={(e) => setFoundationYear(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="club-league">Liga / Modalidade</label>
                <input
                  id="club-league"
                  type="text"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="club-division">Divisão Atual</label>
                <input
                  id="club-division"
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="club-program">Nome do Programa de Sócios</label>
              <input
                id="club-program"
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn btn--grena py-3.5 px-8 text-sm font-semibold tracking-wider"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando Alterações..." : "Salvar Dados do Clube →"}
              </button>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: PREVIEW INSTITUCIONAL AO VIVO */}
        <aside className="admin-preview-pane">
          <div className="admin-preview-box">
            <div className="admin-preview-box__head">
              <span className="admin-preview-box__badge">
                Preview ao Vivo · Identidade Institucional
              </span>
              <span className="text-xs text-white/60">
                Fundado em {foundationYear || 2017}
              </span>
            </div>

            <div className="admin-preview-box__body space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="crest-stage w-36 h-36 shrink-0 mx-auto sm:mx-0">
                  <img src="/assets/img/escudo.png" alt="Escudo Oficial Meldina FC" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="eyebrow justify-center sm:justify-start">
                    Meldina Futebol Clube · Desde {foundationYear || 2017}
                  </p>
                  <h3 className="display text-4xl leading-none">
                    “{motto || "Muito além do jogo"}”
                  </h3>
                  <p className="text-xs text-white/70 mt-2">
                    Sob a presidência de{" "}
                    <strong className="text-white">{president || "André Almeida"}</strong> e o
                    comando técnico de{" "}
                    <strong className="text-white">{coach || "Celso Roth"}</strong>, mandando
                    seus jogos na{" "}
                    <strong className="text-ouro">{stadium || "Lovebomb Arena"}</strong>.
                  </p>
                </div>
              </div>

              {/* Grade de Metadados Institucionais (.profile__meta) */}
              <div className="profile__meta !my-0">
                <div>
                  <small>Estádio Oficial</small>
                  <b>{stadium || "Lovebomb Arena"}</b>
                </div>
                <div>
                  <small>Presidente</small>
                  <b>{president || "André Almeida"}</b>
                </div>
                <div>
                  <small>Técnico / Treinador</small>
                  <b>{coach || "Celso Roth"}</b>
                </div>
                <div>
                  <small>Temporada & Fundação</small>
                  <b>
                    {season || 2026} (Fundado em {foundationYear || 2017})
                  </b>
                </div>
                <div>
                  <small>Competição & Divisão</small>
                  <b>
                    {league || "Pro Clubs"} · {division || "Série A"}
                  </b>
                </div>
                <div>
                  <small>Programa de Sócios</small>
                  <b className="text-ouro">{programName || "Clube Meldina"}</b>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
