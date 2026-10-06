import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Player } from "../../types";

export const AdminElenco: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [feedback, setFeedback] = useState("");

  const load = async () => {
    const data = await api.getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenEdit = (p: Player) => {
    setSelectedPlayer(p);
    setMatches(p.matches);
    setGoals(p.goals);
    setAssists(p.assists);
    setFeedback("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    try {
      await api.updatePlayerStats(selectedPlayer.id, { matches, goals, assists });
      setFeedback("✅ Estatísticas do jogador atualizadas!");
      setSelectedPlayer(null);
      load();
    } catch {
      setFeedback("❌ Erro ao atualizar estatísticas.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">Gestão do Elenco</h1>
        <p className="text-sm text-gray-400 mt-1">Atualize estatísticas (jogos, gols, assistências) dos atletas.</p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold">
          {feedback}
        </div>
      )}

      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-6 text-ouro">Atletas Registrados</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white/5 rounded border border-linha-escura flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover border border-ouro"
                />
                <div>
                  <h3 className="font-bold text-base text-white">
                    {p.name} <span className="text-xs text-ouro">#{p.number}</span>
                  </h3>
                  <span className="text-xs text-gray-400 block">{p.position}</span>
                  <span className="text-xs text-gray-300 font-mono">
                    {p.matches}J · {p.goals}G · {p.assists}A
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEdit(p)}
                className="btn btn--sm btn--ghost text-xs"
              >
                Editar Stats
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DE STATS */}
      {selectedPlayer && (
        <div className="modal is-open">
          <div className="modal__backdrop" onClick={() => setSelectedPlayer(null)}></div>
          <div className="modal__box modal--sm text-white p-6">
            <button
              className="modal__close"
              onClick={() => setSelectedPlayer(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl uppercase mb-1">Editar Estatísticas</h3>
            <p className="text-xs text-ouro mb-6 font-bold">
              {selectedPlayer.name} (#{selectedPlayer.number}) · {selectedPlayer.position}
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="field">
                <label>Jogos Disputados</label>
                <input
                  type="number"
                  min="0"
                  value={matches}
                  onChange={(e) => setMatches(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label>Gols Marcados</label>
                <input
                  type="number"
                  min="0"
                  value={goals}
                  onChange={(e) => setGoals(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label>Assistências</label>
                <input
                  type="number"
                  min="0"
                  value={assists}
                  onChange={(e) => setAssists(Number(e.target.value))}
                  required
                />
              </div>

              <button type="submit" className="btn btn--block btn--grena py-3 mt-4">
                Salvar Estatísticas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
