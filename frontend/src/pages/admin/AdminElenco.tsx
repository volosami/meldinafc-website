import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { Player } from "../../types";
import { STATIC_PLAYERS } from "../../data/staticData";
import { asList, normalizeAssetUrl } from "../../lib/format";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { PlayerCard, PlayerDialog } from "../../components/PlayerDialog";
import {
  UserPlus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  IdCard,
  Shield,
} from "lucide-react";

type PreviewTab = "card" | "profile";

const POSITION_TO_GROUP: Record<string, string> = {
  Goleiro: "Goleiros",
  "Lateral-direito": "Defensores",
  "Lateral-esquerdo": "Defensores",
  Zagueiro: "Defensores",
  Volante: "Meio-campistas",
  Meia: "Meio-campistas",
  Atacante: "Atacantes",
};

const GROUPS = [
  { key: "todos", label: "Todos" },
  { key: "Goleiros", label: "Goleiros" },
  { key: "Defensores", label: "Defensores" },
  { key: "Meio-campistas", label: "Meio-campo" },
  { key: "Atacantes", label: "Ataque" },
];

export const AdminElenco: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [dialogPlayer, setDialogPlayer] = useState<Player | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [number, setNumber] = useState<number>(9);
  const [position, setPosition] = useState("Atacante");
  const [group, setGroup] = useState("Atacantes");
  const [photoUrl, setPhotoUrl] = useState("/assets/players/almeida-9.jpg");
  const [preferredFoot, setPreferredFoot] = useState("Direito");
  const [joinedYear, setJoinedYear] = useState<number>(2026);
  const [matches, setMatches] = useState<number>(0);
  const [goals, setGoals] = useState<number>(0);
  const [assists, setAssists] = useState<number>(0);
  const [extraKey, setExtraKey] = useState("Finalizações no alvo");
  const [extraValue, setExtraValue] = useState("0");
  const [isCaptain, setIsCaptain] = useState(false);
  const [roleTitle, setRoleTitle] = useState("");
  const [bio, setBio] = useState("");

  // Preview & Filter
  const [previewTab, setPreviewTab] = useState<PreviewTab>("card");
  const [filterGroup, setFilterGroup] = useState<string>("todos");

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await api.getPlayers();
      const list = asList(data, STATIC_PLAYERS);
      setPlayers(list);
      return list;
    } catch {
      setPlayers(STATIC_PLAYERS);
      return STATIC_PLAYERS;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handlePositionChange = (pos: string) => {
    setPosition(pos);
    if (POSITION_TO_GROUP[pos]) {
      setGroup(POSITION_TO_GROUP[pos]);
    }
  };

  const handleStartNew = () => {
    setEditingPlayer(null);
    setName("");
    setNumber(99);
    setPosition("Atacante");
    setGroup("Atacantes");
    setPhotoUrl("/assets/players/almeida-9.jpg");
    setPreferredFoot("Direito");
    setJoinedYear(2026);
    setMatches(0);
    setGoals(0);
    setAssists(0);
    setExtraKey("Finalizações no alvo");
    setExtraValue("0");
    setIsCaptain(false);
    setRoleTitle("");
    setBio("");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartEdit = (p: Player) => {
    setEditingPlayer(p);
    setName(p.name);
    setNumber(p.number);
    setPosition(p.position || "Atacante");
    setGroup(p.group || POSITION_TO_GROUP[p.position] || "Atacantes");
    setPhotoUrl(normalizeAssetUrl(p.photoUrl) || "/assets/img/escudo.png");
    setPreferredFoot(p.preferredFoot || "Direito");
    setJoinedYear(p.joinedYear || 2024);
    setMatches(p.matches ?? 0);
    setGoals(p.goals ?? 0);
    setAssists(p.assists ?? 0);
    setExtraKey(p.extraKey || "");
    setExtraValue(p.extraValue || "");
    setIsCaptain(Boolean(p.isCaptain));
    setRoleTitle(p.roleTitle || "");
    setBio(p.bio || "");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload: Partial<Player> = {
      name: name.trim(),
      number: Number(number),
      position: position.trim() || "Atacante",
      group: group || "Atacantes",
      photoUrl: normalizeAssetUrl(photoUrl) || "/assets/img/escudo.png",
      preferredFoot: preferredFoot || "Direito",
      joinedYear: Number(joinedYear) || 2026,
      matches: Number(matches) || 0,
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      extraKey: extraKey.trim() || null,
      extraValue: extraValue.trim() || null,
      isCaptain,
      roleTitle: roleTitle.trim() || null,
      bio: bio.trim(),
    };

    try {
      if (editingPlayer) {
        await api.updatePlayer(editingPlayer.id, payload);
        setFeedback({
          type: "ok",
          text: `Atleta ${payload.name} (#${payload.number}) atualizado com sucesso!`,
        });
      } else {
        await api.createPlayer(payload);
        setFeedback({
          type: "ok",
          text: `Novo atleta ${payload.name} (#${payload.number}) registrado no elenco!`,
        });
        handleStartNew();
      }
      await loadPlayers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Não foi possível salvar os dados do atleta. Verifique os campos.";
      setFeedback({ type: "err", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (p: Player) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o atleta ${p.name} (#${p.number}) do elenco?`
      )
    ) {
      return;
    }
    try {
      await api.deletePlayer(p.id);
      setPlayers((prev) => prev.filter((item) => item.id !== p.id));
      if (editingPlayer?.id === p.id) {
        handleStartNew();
      }
      setFeedback({ type: "ok", text: `Atleta ${p.name} removido do elenco.` });
    } catch (err: any) {
      setFeedback({
        type: "err",
        text: err?.response?.data?.error || "Erro ao excluir atleta.",
      });
    }
  };

  // Live preview player object
  const previewPlayer: Player = {
    id: editingPlayer?.id || "preview-player",
    name: name.trim() || "Nome do Atleta",
    number: Number.isFinite(Number(number)) ? Number(number) : 9,
    position: position.trim() || "Atacante",
    group: group || "Atacantes",
    photoUrl: normalizeAssetUrl(photoUrl) || "/assets/img/escudo-mono.png",
    preferredFoot: preferredFoot || "Direito",
    joinedYear: Number(joinedYear) || 2026,
    matches: Number(matches) || 0,
    goals: Number(goals) || 0,
    assists: Number(assists) || 0,
    extraKey: extraKey.trim() || null,
    extraValue: extraValue.trim() || null,
    isCaptain,
    roleTitle: roleTitle.trim() || null,
    bio:
      bio.trim() ||
      "A biografia e o perfil tático do jogador aparecerão aqui na ficha oficial aberta na página de Elenco e na Home.",
  };

  const visibleGroups = GROUPS.filter(
    (g) => g.key !== "todos" && (filterGroup === "todos" || g.key === filterGroup)
  )
    .map((g) => ({
      ...g,
      players: players
        .filter((p) => p.group === g.key)
        .sort((a, b) => a.number - b.number),
    }))
    .filter((g) => g.players.length > 0);

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
            <p className="eyebrow">Futebol Profissional · Temporada 2026</p>
            <h1 className="display">Gestão do Elenco</h1>
            <p>
              Cadastre novos guerreiros, atualize fotos 3:4, numeração, estatísticas de jogos,
              gols, assistências e cargos de liderança com preview idêntico ao site.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <button
              type="button"
              onClick={handleStartNew}
              className="btn text-xs flex items-center gap-2"
            >
              <UserPlus size={16} /> + Novo Atleta
            </button>
          </div>
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

      {/* 2. SPLIT-VIEW: FORMULÁRIO + PREVIEW AO VIVO */}
      <div ref={formTopRef} className="admin-split">
        {/* COLUNA ESQUERDA: FORMULÁRIO (.form-card) */}
        <div className="form-card space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-linha-escura pb-4">
            <div>
              <p className="eyebrow mb-1">
                {editingPlayer ? `Editando #${editingPlayer.number}` : "Registro Oficial"}
              </p>
              <h2 className="display text-3xl flex items-center gap-2.5">
                {editingPlayer ? (
                  <>
                    <Edit3 size={22} className="text-ouro" /> Editar Atleta: {editingPlayer.name}
                  </>
                ) : (
                  <>
                    <UserPlus size={22} className="text-ouro" /> Novo Atleta
                  </>
                )}
              </h2>
            </div>
            {editingPlayer && (
              <button
                type="button"
                onClick={handleStartNew}
                className="btn btn--sm btn--ghost text-xs"
              >
                + Novo Atleta
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <ImageUploadField
              label="Foto Oficial do Atleta (Proporção 3:4)"
              value={photoUrl}
              onChange={setPhotoUrl}
              defaultGalleryTab="players"
              placeholder="/assets/players/nome-numero.jpg ou envie pelo botão"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="field sm:col-span-2">
                <label htmlFor="player-name">Nome do Atleta</label>
                <input
                  id="player-name"
                  type="text"
                  placeholder="Ex: Almeida"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="player-number">Número da Camisa</label>
                <input
                  id="player-number"
                  type="number"
                  min={1}
                  max={99}
                  value={number}
                  onChange={(e) => setNumber(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="player-position">Posição em Campo</label>
                <select
                  id="player-position"
                  value={position}
                  onChange={(e) => handlePositionChange(e.target.value)}
                >
                  <option value="Goleiro">Goleiro</option>
                  <option value="Lateral-direito">Lateral-direito</option>
                  <option value="Lateral-esquerdo">Lateral-esquerdo</option>
                  <option value="Zagueiro">Zagueiro</option>
                  <option value="Volante">Volante</option>
                  <option value="Meia">Meia</option>
                  <option value="Atacante">Atacante</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="player-group">Setor na Grade (Group)</label>
                <select
                  id="player-group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value="Goleiros">Goleiros</option>
                  <option value="Defensores">Defensores</option>
                  <option value="Meio-campistas">Meio-campistas</option>
                  <option value="Atacantes">Atacantes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="player-foot">Pé Preferido</label>
                <select
                  id="player-foot"
                  value={preferredFoot}
                  onChange={(e) => setPreferredFoot(e.target.value)}
                >
                  <option value="Direito">Direito</option>
                  <option value="Esquerdo">Esquerdo</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="player-joined">No clube desde (Ano)</label>
                <input
                  id="player-joined"
                  type="number"
                  min={2017}
                  max={2030}
                  value={joinedYear}
                  onChange={(e) => setJoinedYear(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Estatísticas principais */}
            <div className="grid grid-cols-3 gap-3">
              <div className="field">
                <label htmlFor="player-matches">Jogos</label>
                <input
                  id="player-matches"
                  type="number"
                  min={0}
                  value={matches}
                  onChange={(e) => setMatches(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="player-goals">Gols</label>
                <input
                  id="player-goals"
                  type="number"
                  min={0}
                  value={goals}
                  onChange={(e) => setGoals(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="player-assists">Assistências</label>
                <input
                  id="player-assists"
                  type="number"
                  min={0}
                  value={assists}
                  onChange={(e) => setAssists(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Estatística Extra */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="player-extrakey">Estatística Extra — Nome</label>
                <input
                  id="player-extrakey"
                  type="text"
                  placeholder="Ex: Finalizações no alvo, Desarmes..."
                  value={extraKey}
                  onChange={(e) => setExtraKey(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="player-extraval">Estatística Extra — Valor</label>
                <input
                  id="player-extraval"
                  type="text"
                  placeholder="Ex: 29, 91%..."
                  value={extraValue}
                  onChange={(e) => setExtraValue(e.target.value)}
                />
              </div>
            </div>

            {/* Capitão e Cargo Institucional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <label
                htmlFor="player-captain"
                className="flex items-center gap-3 p-3.5 rounded bg-white/5 border border-linha-escura cursor-pointer hover:border-ouro/50 transition-colors h-full"
              >
                <input
                  type="checkbox"
                  id="player-captain"
                  checked={isCaptain}
                  onChange={(e) => setIsCaptain(e.target.checked)}
                  className="accent-ouro w-4 h-4"
                />
                <div>
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Shield size={14} className="text-ouro" /> Capitão da Equipe
                  </span>
                  <span className="block text-[11px] text-white/60">
                    Exibe braçadeira "C" no card e selo no perfil
                  </span>
                </div>
              </label>

              <div className="field">
                <label htmlFor="player-role">Cargo Institucional (Opcional)</label>
                <input
                  id="player-role"
                  type="text"
                  placeholder="Ex: Presidente, Vice-presidente..."
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="player-bio">Biografia / Perfil do Atleta</label>
              <textarea
                id="player-bio"
                rows={4}
                placeholder="Histórico no clube, estilo de jogo e momentos marcantes..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn btn--grena py-3.5 px-8 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : editingPlayer
                  ? "Salvar Alterações do Atleta →"
                  : "Cadastrar Novo Atleta →"}
              </button>
              {editingPlayer && (
                <button
                  type="button"
                  onClick={handleStartNew}
                  className="btn btn--ghost text-xs"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: PREVIEW AO VIVO (.admin-preview-pane) */}
        <aside className="admin-preview-pane">
          <div className="admin-preview-box">
            <div className="admin-preview-box__head">
              <span className="admin-preview-box__badge">Preview ao Vivo</span>

              <div className="tabs" role="tablist" aria-label="Modo de visualização do atleta">
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewTab === "card"}
                  onClick={() => setPreviewTab("card")}
                  className={`tab text-xs py-1.5 px-3.5 flex items-center gap-1.5 ${
                    previewTab === "card" ? "is-active" : ""
                  }`}
                >
                  <Eye size={13} /> Card no Elenco
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewTab === "profile"}
                  onClick={() => setPreviewTab("profile")}
                  className={`tab text-xs py-1.5 px-3.5 flex items-center gap-1.5 ${
                    previewTab === "profile" ? "is-active" : ""
                  }`}
                >
                  <IdCard size={13} /> Ficha Completa
                </button>
              </div>
            </div>

            {previewTab === "card" ? (
              <div className="admin-preview-box__body flex flex-col items-center">
                <p className="text-xs text-white/60 mb-4 text-center">
                  Clique no card abaixo para alternar para a Ficha Completa (
                  <code className="text-ouro">PlayerDialog</code>):
                </p>
                <div className="w-full max-w-[300px]">
                  <PlayerCard
                    player={previewPlayer}
                    onOpen={() => setPreviewTab("profile")}
                  />
                </div>
              </div>
            ) : (
              /* Renderização inline idêntica ao .profile de PlayerDialog.tsx */
              <div className="profile !grid-cols-1">
                <div
                  className={`profile__media !min-h-[340px] ${
                    previewPlayer.position === "Goleiro" ? "gk" : ""
                  }`}
                >
                  <img
                    src={previewPlayer.photoUrl || "/assets/img/escudo-mono.png"}
                    alt=""
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/img/escudo-mono.png";
                    }}
                  />
                  <span className="num" aria-hidden="true">
                    {previewPlayer.number}
                  </span>
                </div>
                <div className="profile__body !p-6">
                  <p className="eyebrow">
                    {previewPlayer.position} · Camisa {previewPlayer.number}
                  </p>
                  <h3 className="display text-5xl">{previewPlayer.name}</h3>
                  {(previewPlayer.isCaptain || previewPlayer.roleTitle) && (
                    <p className="flex flex-wrap gap-2 mt-1">
                      {previewPlayer.isCaptain && (
                        <span className="captain">Capitão</span>
                      )}
                      {previewPlayer.roleTitle && (
                        <span className="captain captain--role">
                          {previewPlayer.roleTitle}
                        </span>
                      )}
                    </p>
                  )}
                  <div className="profile__meta">
                    <div>
                      <small>Pé preferido</small>
                      <b>{previewPlayer.preferredFoot}</b>
                    </div>
                    <div>
                      <small>No clube desde</small>
                      <b>{previewPlayer.joinedYear}</b>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <b>{previewPlayer.matches}</b>
                      <small>Jogos</small>
                    </div>
                    <div className="stat">
                      <b>{previewPlayer.goals}</b>
                      <small>Gols</small>
                    </div>
                    <div className="stat">
                      <b>{previewPlayer.assists}</b>
                      <small>Assistências</small>
                    </div>
                    {previewPlayer.extraKey && (
                      <div className="stat">
                        <b>{previewPlayer.extraValue || "0"}</b>
                        <small>{previewPlayer.extraKey}</small>
                      </div>
                    )}
                  </div>
                  <p className="profile__bio">{previewPlayer.bio}</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. ELENCO REGISTRADO POR SETOR */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-linha-escura pb-4">
          <div>
            <p className="eyebrow mb-1">Plantel Oficial</p>
            <h2 className="display text-3xl">
              Atletas Registrados ({players.length})
            </h2>
          </div>

          <div className="tabs" role="group" aria-label="Filtrar por setor">
            {GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setFilterGroup(g.key)}
                className={`tab text-xs py-2 px-4 ${
                  filterGroup === g.key ? "is-active" : ""
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-white/70 py-8">Carregando elenco oficial…</p>
        ) : visibleGroups.length === 0 ? (
          <div className="form-card text-center py-12">
            <p className="text-white/70">Nenhum jogador encontrado neste setor.</p>
          </div>
        ) : (
          visibleGroups.map((g) => (
            <div key={g.key} className="space-y-4">
              <div className="group-title !mt-8">
                <h3 className="display text-3xl">{g.key}</h3>
                <span>
                  {g.players.length} {g.players.length === 1 ? "jogador" : "jogadores"}
                </span>
              </div>

              <div className="squad-grid">
                {g.players.map((p) => {
                  const isBeingEdited = editingPlayer?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex flex-col rounded-md overflow-hidden border transition-all ${
                        isBeingEdited
                          ? "border-ouro ring-2 ring-ouro"
                          : "border-linha-escura hover:border-ouro/50"
                      }`}
                    >
                      <div className="[&>.player-card]:rounded-b-none">
                        <PlayerCard player={p} onOpen={setDialogPlayer} />
                      </div>

                      {/* Barra de Ações Admin */}
                      <div className="bg-noite-2 px-3.5 py-3 border-t border-linha-escura flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="btn btn--sm text-xs py-1.5 px-3.5 flex-1 flex items-center justify-center gap-1.5"
                        >
                          <Edit3 size={13} /> Editar Atleta
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="p-2 rounded bg-grena/30 hover:bg-erro text-white transition-colors"
                          title={`Excluir ${p.name}`}
                          aria-label={`Excluir ${p.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {dialogPlayer && (
        <PlayerDialog
          player={dialogPlayer}
          onClose={() => setDialogPlayer(null)}
        />
      )}
    </div>
  );
};
