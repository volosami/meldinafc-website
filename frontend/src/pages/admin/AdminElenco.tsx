import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Player } from "../../types";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { UserCheck, Edit2, CheckCircle2 } from "lucide-react";

export const AdminElenco: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Campos do Jogador
  const [name, setName] = useState("");
  const [number, setNumber] = useState(1);
  const [position, setPosition] = useState("Atacante");
  const [group, setGroup] = useState("Atacantes");
  const [photoUrl, setPhotoUrl] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("Direito");
  const [matches, setMatches] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [bio, setBio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setName(p.name);
    setNumber(p.number);
    setPosition(p.position);
    setGroup(p.group || "Atacantes");
    setPhotoUrl(p.photoUrl);
    setPreferredFoot(p.preferredFoot || "Direito");
    setMatches(p.matches);
    setGoals(p.goals);
    setAssists(p.assists);
    setBio(p.bio || "");
    setFeedback("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    setIsSubmitting(true);

    try {
      await api.updatePlayer(selectedPlayer.id, {
        name,
        number: Number(number),
        position,
        group,
        photoUrl,
        preferredFoot,
        matches: Number(matches),
        goals: Number(goals),
        assists: Number(assists),
        bio,
      });
      setFeedback("✅ Atleta e foto atualizados com sucesso!");
      setSelectedPlayer(null);
      load();
    } catch {
      setFeedback("❌ Erro ao atualizar atleta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">Gestão do Elenco</h1>
        <p className="text-sm text-gray-400 mt-1">
          Atualize fotos de perfil, dados cadastrais e estatísticas dos atletas do Meldina FC.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded bg-white/10 border border-ouro text-sm text-ouro font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      <div className="bg-noite p-6 rounded-lg border border-linha-escura">
        <h2 className="font-display text-2xl uppercase mb-6 text-ouro">Atletas Registrados ({players.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white/5 rounded border border-linha-escura flex items-center justify-between gap-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  className="w-14 h-14 rounded-full object-cover border border-ouro shrink-0 bg-black/40"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/img/escudo.png";
                  }}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white truncate">
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
                className="btn btn--sm btn--ghost text-xs shrink-0 flex items-center gap-1.5"
              >
                <Edit2 size={12} /> Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DE ATLETA E FOTO */}
      {selectedPlayer && (
        <div className="modal is-open">
          <div className="modal__backdrop" onClick={() => setSelectedPlayer(null)}></div>
          <div className="modal__box modal--md text-white p-6 max-h-[90vh] overflow-y-auto">
            <button
              className="modal__close"
              onClick={() => setSelectedPlayer(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl uppercase mb-1 flex items-center gap-2">
              <UserCheck className="text-ouro" size={24} /> Editar Atleta
            </h3>
            <p className="text-xs text-ouro mb-6 font-bold">
              {selectedPlayer.name} (#{selectedPlayer.number}) · {selectedPlayer.position}
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* UPLOAD DA FOTO DO JOGADOR */}
              <ImageUploadField
                label="Foto de Perfil do Atleta"
                value={photoUrl}
                onChange={setPhotoUrl}
                placeholder="/assets/players/foto.jpg ou faça upload"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="field">
                  <label>Nome do Jogador</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Número da Camisa</label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="field">
                  <label>Posição</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Pé Preferido</label>
                  <select
                    value={preferredFoot}
                    onChange={(e) => setPreferredFoot(e.target.value)}
                  >
                    <option value="Direito">Direito</option>
                    <option value="Esquerdo">Esquerdo</option>
                    <option value="Ambidestro">Ambidestro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="field">
                  <label>Jogos</label>
                  <input
                    type="number"
                    min="0"
                    value={matches}
                    onChange={(e) => setMatches(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="field">
                  <label>Gols</label>
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
              </div>

              <div className="field">
                <label>Biografia / Perfil</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Descrição do estilo de jogo do atleta..."
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="btn btn--block btn--grena py-3 text-sm font-bold tracking-wider"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações do Atleta →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
