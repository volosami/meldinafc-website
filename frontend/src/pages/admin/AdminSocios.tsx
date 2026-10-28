import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { Member } from "../../types";
import { asList, formatDateShort, safeDate } from "../../lib/format";
import {
  Check,
  X,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

type PlanKey = "BRONZE" | "PRATA" | "OURO";
type StatusKey = "ACTIVE" | "PENDING" | "CANCELLED";

const PLANS: Record<
  PlanKey,
  {
    key: PlanKey;
    name: string;
    price: string;
    ribbon?: string;
    perks: { text: string; on: boolean }[];
  }
> = {
  BRONZE: {
    key: "BRONZE",
    name: "Bronze",
    price: "R$ 14,90",
    perks: [
      { text: "Carteirinha digital de sócio", on: true },
      { text: "Acesso ao grupo oficial no WhatsApp", on: true },
      { text: "5% de desconto na Loja Oficial", on: true },
      { text: "Desconto em ingressos", on: false },
      { text: "Participação em sorteios mensais", on: false },
      { text: "Sorteio anual de camisa oficial autografada", on: false },
      { text: "Acesso VIP nos eventos do clube", on: false },
    ],
  },
  PRATA: {
    key: "PRATA",
    name: "Prata",
    price: "R$ 29,90",
    perks: [
      { text: "Carteirinha digital de sócio", on: true },
      { text: "Acesso ao grupo oficial no WhatsApp", on: true },
      { text: "10% de desconto na Loja Oficial", on: true },
      { text: "20% de desconto em ingressos", on: true },
      { text: "Participação em sorteios mensais", on: true },
      { text: "Sorteio anual de camisa oficial autografada", on: false },
      { text: "Acesso VIP nos eventos do clube", on: false },
    ],
  },
  OURO: {
    key: "OURO",
    name: "Ouro",
    price: "R$ 49,90",
    ribbon: "Recomendado",
    perks: [
      { text: "Carteirinha digital de sócio", on: true },
      { text: "Acesso ao grupo oficial no WhatsApp", on: true },
      { text: "20% de desconto na Loja Oficial", on: true },
      { text: "50% de desconto em ingressos", on: true },
      { text: "Participação em sorteios mensais", on: true },
      { text: "Sorteio anual de camisa oficial autografada", on: true },
      { text: "Acesso VIP nos eventos do clube", on: true },
      { text: "Nome gravado no Mural do Clube", on: true },
    ],
  },
};

const STATUS_META: Record<StatusKey, { label: string; badgeClass: string }> = {
  ACTIVE: {
    label: "ATIVO",
    badgeClass: "bg-vitoria/25 text-[#6ee7a8] border border-vitoria",
  },
  PENDING: {
    label: "PENDENTE",
    badgeClass: "bg-ouro/20 text-ouro border border-ouro/50",
  },
  CANCELLED: {
    label: "CANCELADO",
    badgeClass: "bg-grena-2/25 text-erro-claro border border-grena-2",
  },
};

export function maskCpf(cpf: string): string {
  const digits = (cpf || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }
  if (digits.length > 4) {
    return `***${digits.slice(-4, -2)}-**`;
  }
  return "***.***.***-**";
}

export const AdminSocios: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form states (No-Money Rule: no payment fields!)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [plan, setPlan] = useState<PlanKey>("OURO");
  const [status, setStatus] = useState<StatusKey>("ACTIVE");

  // Filter & Search
  const [filterPlan, setFilterPlan] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await api.getMembers();
      setMembers(asList(data, []));
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleStartNew = () => {
    setEditingMember(null);
    setName("");
    setEmail("");
    setPhone("");
    setCpf("");
    setPlan("OURO");
    setStatus("ACTIVE");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartEdit = (m: Member) => {
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email);
    setPhone(m.phone || "");
    setCpf(m.cpf || "");
    setPlan((m.plan as PlanKey) || "OURO");
    setStatus((m.status as StatusKey) || "ACTIVE");
    setFeedback(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length < 11) {
      setFeedback({ type: "err", text: "O CPF do associado deve conter 11 dígitos numéricos." });
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingMember) {
        await api.updateMember(editingMember.id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          cpf: cleanCpf,
          plan,
          status,
        });
        setFeedback({
          type: "ok",
          text: `Cadastro do sócio ${name.trim()} atualizado com sucesso!`,
        });
      } else {
        await api.createMember({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          cpf: cleanCpf,
          plan,
          status,
        });
        setFeedback({
          type: "ok",
          text: `Novo sócio-torcedor ${name.trim()} registrado no Clube Meldina!`,
        });
        handleStartNew();
      }
      await loadMembers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Não foi possível salvar o cadastro do sócio. Verifique CPF e e-mail.";
      setFeedback({ type: "err", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (m: Member) => {
    if (!window.confirm(`Tem certeza que deseja excluir o sócio "${m.name}"?`)) return;
    try {
      await api.deleteMember(m.id);
      setMembers((prev) => prev.filter((item) => item.id !== m.id));
      if (editingMember?.id === m.id) {
        handleStartNew();
      }
      setFeedback({ type: "ok", text: `Associado ${m.name} removido da base.` });
    } catch (err: any) {
      setFeedback({
        type: "err",
        text: err?.response?.data?.error || "Erro ao excluir associado.",
      });
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchPlan = filterPlan === "TODOS" || m.plan === filterPlan;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.cpf || "").includes(q);
    return matchPlan && matchSearch;
  });

  const currentPlanMeta = PLANS[plan] || PLANS.OURO;
  const currentStatusMeta = STATUS_META[status] || STATUS_META.ACTIVE;
  const previewDate = safeDate(editingMember?.createdAt) || new Date();

  return (
    <div className="space-y-10">
      {/* 1. HEADER (.admin-hero page-hero--cm) */}
      <section className="admin-hero page-hero--cm">
        <img
          className="admin-hero__mark"
          src="/assets/img/monograma-outline.png"
          alt=""
        />
        <div className="wrap flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Programa Oficial de Sócios</p>
            <div className="flex flex-wrap items-center gap-5 my-2">
              <img
                src="/assets/img/clube-meldina/cm-logo.png"
                alt="Clube Meldina"
                className="h-16 sm:h-20 w-auto object-contain"
              />
              <h1 className="display">Sócios-Torcedores</h1>
            </div>
            <p>
              Gerencie os associados do Clube Meldina nas categorias Bronze, Prata e Ouro
              e visualize a carteirinha oficial personalizada em tempo real.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <button
              type="button"
              onClick={handleStartNew}
              className="btn text-xs flex items-center gap-2"
            >
              <UserPlus size={16} /> + Novo Sócio
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

      {/* 2. SPLIT-VIEW: FORMULÁRIO + CARTEIRINHA AO VIVO */}
      <div ref={formTopRef} className="admin-split">
        {/* COLUNA ESQUERDA: FORMULÁRIO (.form-card) */}
        <div className="form-card space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-linha-escura pb-4">
            <div>
              <p className="eyebrow mb-1">
                {editingMember ? "Edição de Associado" : "Adesão Administrativa"}
              </p>
              <h2 className="display text-3xl flex items-center gap-2.5">
                {editingMember ? (
                  <>
                    <Edit3 size={22} className="text-ouro" /> Editar Sócio: {editingMember.name}
                  </>
                ) : (
                  <>
                    <UserPlus size={22} className="text-ouro" /> Cadastrar Novo Sócio
                  </>
                )}
              </h2>
            </div>
            {editingMember && (
              <button
                type="button"
                onClick={handleStartNew}
                className="btn btn--sm btn--ghost text-xs"
              >
                + Novo Sócio
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="field">
              <label htmlFor="member-name">Nome Completo do Associado</label>
              <input
                id="member-name"
                type="text"
                placeholder="Ex: Gabriel Carrijo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="member-email">E-mail</label>
                <input
                  id="member-email"
                  type="email"
                  placeholder="socio@meldinafc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="member-phone">Telefone / WhatsApp</label>
                <input
                  id="member-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="field">
                <label htmlFor="member-cpf">CPF (11 dígitos)</label>
                <input
                  id="member-cpf"
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="member-plan">Plano Clube Meldina</label>
                <select
                  id="member-plan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as PlanKey)}
                >
                  <option value="OURO">Ouro (R$ 49,90/mês)</option>
                  <option value="PRATA">Prata (R$ 29,90/mês)</option>
                  <option value="BRONZE">Bronze (R$ 14,90/mês)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="member-status">Status da Assinatura</label>
                <select
                  id="member-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusKey)}
                >
                  <option value="ACTIVE">ATIVO (ACTIVE)</option>
                  <option value="PENDING">PENDENTE (PENDING)</option>
                  <option value="CANCELLED">CANCELADO (CANCELLED)</option>
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
                  : editingMember
                  ? "Salvar Alterações →"
                  : "Confirmar Cadastro de Sócio →"}
              </button>
              {editingMember && (
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

        {/* COLUNA DIREITA: PREVIEW DA CARTEIRINHA CLUBE MELDINA */}
        <aside className="admin-preview-pane">
          <div className="admin-preview-box">
            <div className="admin-preview-box__head">
              <span className="admin-preview-box__badge">
                Preview ao Vivo · Carteirinha & Plano
              </span>
              <span className="text-xs text-white/60 flex items-center gap-1">
                <CreditCard size={13} className="text-ouro" /> Clube Meldina{" "}
                {currentPlanMeta.name}
              </span>
            </div>

            <div className="admin-preview-box__body">
              <article
                className={`plan ${
                  currentPlanMeta.ribbon ? "plan--hl" : ""
                } border-ouro`}
              >
                <img
                  className="plan__card !mt-2"
                  src={`/assets/img/clube-meldina/card-${plan.toLowerCase()}.png`}
                  alt={`Carteirinha Clube Meldina ${currentPlanMeta.name}`}
                  width={640}
                  height={349}
                />

                {/* Ficha do Associado Vinculado */}
                <div className="p-4 mb-5 rounded-md bg-white/5 border border-linha-escura space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ouro">
                      Titular da Carteirinha
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentStatusMeta.badgeClass}`}
                    >
                      {currentStatusMeta.label}
                    </span>
                  </div>
                  <h4 className="display text-2xl text-white truncate">
                    {name.trim() || "Nome do Associado"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/70 pt-1 border-t border-linha-escura">
                    <div>
                      <small className="block text-[10px] uppercase text-white/45">
                        CPF
                      </small>
                      <span className="font-mono">{maskCpf(cpf)}</span>
                    </div>
                    <div>
                      <small className="block text-[10px] uppercase text-white/45">
                        Desde
                      </small>
                      <span>{formatDateShort(previewDate)}</span>
                    </div>
                    <div className="col-span-2 truncate">
                      <small className="block text-[10px] uppercase text-white/45">
                        Contato
                      </small>
                      <span>
                        {email.trim() || "socio@meldinafc.com"}
                        {phone.trim() ? ` · ${phone.trim()}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="plan__head">
                  <h3 className="display plan__name !text-4xl !my-1">
                    {currentPlanMeta.name}
                  </h3>
                  {currentPlanMeta.ribbon && (
                    <span className="plan__ribbon">{currentPlanMeta.ribbon}</span>
                  )}
                </div>

                <div className="plan__price !mb-4">
                  <b className="!text-3xl">{currentPlanMeta.price}</b>
                  <small>/mês (vitrine)</small>
                </div>

                <ul className="!mb-0">
                  {currentPlanMeta.perks.map((perk) => (
                    <li key={perk.text} className={perk.on ? "" : "off"}>
                      {perk.on ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                      <span>{perk.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. TABELA DE SÓCIOS CADASTRADOS */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-linha-escura pb-4">
          <div>
            <p className="eyebrow mb-1">Quadro Social</p>
            <h2 className="display text-3xl">
              Associados Registrados ({filteredMembers.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Buscar nome, e-mail ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/5 border border-linha-escura rounded-full text-xs text-white focus:outline-none focus:border-ouro w-full sm:w-64"
              />
            </div>

            <div className="tabs" role="group" aria-label="Filtrar por plano">
              {["TODOS", "OURO", "PRATA", "BRONZE"].map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => setFilterPlan(pKey)}
                  className={`tab text-xs py-2 px-3.5 ${
                    filterPlan === pKey ? "is-active" : ""
                  }`}
                >
                  {pKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-white/70 py-8">Carregando quadro de sócios…</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="!text-left">Associado</th>
                  <th scope="col" className="!text-left">Contato</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Plano</th>
                  <th scope="col">Status</th>
                  <th scope="col">Adesão</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-white/60">
                      Nenhum sócio-torcedor encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => {
                    const stMeta =
                      STATUS_META[(m.status as StatusKey) || "ACTIVE"] ||
                      STATUS_META.ACTIVE;
                    const dt = safeDate(m.createdAt);
                    const isBeingEdited = editingMember?.id === m.id;

                    return (
                      <tr
                        key={m.id}
                        className={`${
                          isBeingEdited
                            ? "is-us"
                            : "hover:bg-white/5 transition-colors"
                        }`}
                      >
                        <td className="!text-left font-semibold text-white">
                          {m.name}
                        </td>
                        <td className="!text-left text-xs text-white/75">
                          <div>{m.email}</div>
                          {m.phone && (
                            <div className="text-white/50">{m.phone}</div>
                          )}
                        </td>
                        <td className="font-mono text-xs text-white/80">
                          {maskCpf(m.cpf)}
                        </td>
                        <td>
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                              m.plan === "OURO"
                                ? "bg-ouro text-noite"
                                : m.plan === "PRATA"
                                ? "bg-white/15 text-white border border-white/30"
                                : "bg-grena/40 text-ouro border border-ouro/40"
                            }`}
                          >
                            {m.plan}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${stMeta.badgeClass}`}
                          >
                            {stMeta.label}
                          </span>
                        </td>
                        <td className="text-xs text-white/65">
                          {dt ? formatDateShort(dt) : "—"}
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(m)}
                              className="btn btn--sm text-[11px] py-1 px-2.5 flex items-center gap-1"
                            >
                              <Edit3 size={12} /> Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(m)}
                              className="p-1.5 rounded bg-grena/30 hover:bg-erro text-white transition-colors"
                              title={`Excluir ${m.name}`}
                              aria-label={`Excluir ${m.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
