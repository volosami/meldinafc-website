import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Fixture } from "../../types";

export const AdminJogos: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Fixture | null>(null);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const load = async () => {
    const data = await api.getFixtures();
    setFixtures(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenScoreModal = (f: Fixture) => {
    setSelectedMatch(f);
    setHomeScore(f.homeScore ?? 0);
    setAwayScore(f.awayScore ?? 0);
    setFeedback("");
  };

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      await api.updateFixtureScore(selectedMatch.id, homeScore, awayScore);
      setFeedback("✅ Placar atualizado com sucesso!");
      setSelectedMatch(null);
      load();
    } catch {
      setFeedback("❌ Erro ao atualizar placar.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">Gerenciador de Partidas</h1>
        <p className="text-sm text-gray-400 mt-1">Atualize placares e resultados dos jogos da temporada 2026.</p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold">
          {feedback}
        </div>
      )}

      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-6 text-ouro">Partidas do Campeonato</h2>

        <div className="space-y-3">
          {fixtures.map((f) => {
            const isFinished = f.homeScore !== null && f.homeScore !== undefined;
            return (
              <div
                key={f.id}
                className="p-4 bg-white/5 rounded border border-linha-escura flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <span className="text-xs text-ouro font-bold uppercase mr-2">{f.round}</span>
                  <span className="text-xs text-gray-400">{new Date(f.matchDate).toLocaleDateString("pt-BR")}</span>
                  <h3 className="font-semibold text-base mt-1 text-white">
                    {f.isHome ? "Meldina FC" : f.opponent?.name || f.opponentId} × {!f.isHome ? "Meldina FC" : f.opponent?.name || f.opponentId}
                  </h3>
                  <span className="text-xs text-gray-500">📍 {f.venue || "Lovebomb Arena"}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-display text-xl bg-black/40 px-3 py-1 rounded text-white border border-linha-escura">
                    {isFinished ? `${f.homeScore} × ${f.awayScore}` : "A disputar"}
                  </div>
                  <button
                    onClick={() => handleOpenScoreModal(f)}
                    className="btn btn--sm btn--grena text-xs"
                  >
                    Editar Placar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DE PLACAR */}
      {selectedMatch && (
        <div className="modal is-open">
          <div className="modal__backdrop" onClick={() => setSelectedMatch(null)}></div>
          <div className="modal__box modal--sm text-white p-6">
            <button
              className="modal__close"
              onClick={() => setSelectedMatch(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl uppercase mb-2">Atualizar Placar</h3>
            <p className="text-xs text-gray-400 mb-6">
              {selectedMatch.isHome ? "Meldina FC" : selectedMatch.opponent?.name} × {!selectedMatch.isHome ? "Meldina FC" : selectedMatch.opponent?.name}
            </p>

            <form onSubmit={handleUpdateScore} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="field">
                  <label>{selectedMatch.isHome ? "Meldina FC" : selectedMatch.opponent?.shortName}</label>
                  <input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="field">
                  <label>{!selectedMatch.isHome ? "Meldina FC" : selectedMatch.opponent?.shortName}</label>
                  <input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--block btn--grena py-3">
                Salvar Placar Final
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
