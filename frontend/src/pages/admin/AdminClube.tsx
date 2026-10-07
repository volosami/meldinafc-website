import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Shield, Building, Award, User, Quote, CheckCircle2 } from "lucide-react";

export const AdminClube: React.FC = () => {
  const [stadium, setStadium] = useState("Lovebomb Arena");
  const [coach, setCoach] = useState("Celso Roth");
  const [president, setPresident] = useState("André Almeida");
  const [motto, setMotto] = useState("Muito além do jogo");
  const [season, setSeason] = useState(2026);
  const [league, setLeague] = useState("Pro Clubs");
  const [division, setDivision] = useState("Série A");
  const [programName, setProgramName] = useState("Clube Meldina");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadClub() {
      const data = await api.getClubInfo();
      if (data) {
        if (data.stadium) setStadium(data.stadium);
        if (data.coach) setCoach(data.coach);
        if (data.president) setPresident(data.president);
        if (data.motto) setMotto(data.motto);
        if (data.season) setSeason(data.season);
        if (data.league) setLeague(data.league);
        if (data.division) setDivision(data.division);
        if (data.programName) setProgramName(data.programName);
      }
    }
    loadClub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      await api.updateClubInfo({
        stadium,
        coach,
        president,
        motto,
        season: Number(season),
        league,
        division,
        programName,
      });
      setFeedback("✅ Informações do clube atualizadas com sucesso!");
    } catch {
      setFeedback("❌ Erro ao atualizar informações do clube.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">
          Informações Institucionais do Clube
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure estádio, corpo diretivo, lema e detalhes da temporada oficial do Meldina FC.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="flex items-center gap-1.5">
                <Building size={14} className="text-ouro" /> Estádio Oficial
              </label>
              <input
                type="text"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                placeholder="Ex: Lovebomb Arena"
                required
              />
            </div>

            <div className="field">
              <label className="flex items-center gap-1.5">
                <Quote size={14} className="text-ouro" /> Lema Oficial
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="Ex: Muito além do jogo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="flex items-center gap-1.5">
                <User size={14} className="text-ouro" /> Presidente
              </label>
              <input
                type="text"
                value={president}
                onChange={(e) => setPresident(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="flex items-center gap-1.5">
                <Shield size={14} className="text-ouro" /> Técnico / Treinador
              </label>
              <input
                type="text"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="field">
              <label className="flex items-center gap-1.5">
                <Award size={14} className="text-ouro" /> Temporada
              </label>
              <input
                type="number"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                required
              />
            </div>

            <div className="field">
              <label>Liga / Modalidade</label>
              <input
                type="text"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Divisão Atual</label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Nome do Programa de Sócios</label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--grena py-3 px-8 text-sm font-semibold tracking-wider"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando Alterações..." : "Salvar Dados do Clube →"}
          </button>
        </form>
      </div>
    </div>
  );
};
