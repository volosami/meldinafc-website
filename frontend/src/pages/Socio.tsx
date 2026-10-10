import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { api } from "../services/api";
import { useModalFocus } from "../hooks/useModalFocus";

/*
 * Clube Meldina. Pela regra "ninguém paga" (PRODUCT.md): os preços dos planos
 * são só vitrine, o cadastro termina numa confirmação e nenhum dado de
 * pagamento é pedido ou exibido. O retorno de pagamento da API é ignorado.
 */

type PlanKey = "BRONZE" | "PRATA" | "OURO";

const PLANS: {
  key: PlanKey;
  name: string;
  tier: string;
  price: string;
  ribbon?: string;
  perks: { text: string; on: boolean }[];
}[] = [
  {
    key: "BRONZE",
    name: "Bronze",
    tier: "Plano Inicial",
    price: "R$ 14,90",
    perks: [
      { text: "Carteirinha digital de sócio", on: true },
      { text: "5% de desconto na Loja Oficial", on: true },
      { text: "Acesso ao grupo oficial no WhatsApp", on: true },
      { text: "Desconto em ingressos de jogos", on: false },
      { text: "Camisa oficial autografada", on: false },
    ],
  },
  {
    key: "PRATA",
    name: "Prata",
    tier: "Mais Popular",
    price: "R$ 29,90",
    perks: [
      { text: "Carteirinha digital de sócio", on: true },
      { text: "10% de desconto na Loja Oficial", on: true },
      { text: "20% de desconto em ingressos", on: true },
      { text: "Participação em sorteios mensais", on: true },
      { text: "Camisa oficial autografada", on: false },
    ],
  },
  {
    key: "OURO",
    name: "Ouro",
    tier: "Elite Grená",
    price: "R$ 49,90",
    ribbon: "Recomendado",
    perks: [
      { text: "Todos os benefícios do Prata", on: true },
      { text: "20% de desconto na Loja Oficial", on: true },
      { text: "Acesso VIP nos eventos do clube", on: true },
      { text: "Sorteio de 1 Camisa Oficial por ano", on: true },
      { text: "Nome gravado no Mural do Clube", on: true },
    ],
  },
];

type Field = "name" | "email" | "phone" | "cpf";
type Errors = Partial<Record<Field, string>>;

// Mesmas regras que a API aplica, para o erro aparecer antes do envio.
function validate(v: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 3) errors.name = "Informe seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Informe um e-mail válido, como nome@email.com.";
  if (v.phone.replace(/\D/g, "").length < 8) errors.phone = "Informe um telefone com DDD.";
  if (v.cpf.replace(/\D/g, "").length !== 11) errors.cpf = "O CPF precisa ter 11 números.";
  return errors;
}

const SuccessDialog: React.FC<{ planName: string; onClose: () => void }> = ({ planName, onClose }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  useModalFocus(true, boxRef, onClose);
  return (
    <div className="modal modal--sm is-open">
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true"></div>
      <div
        ref={boxRef}
        className="modal__box text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="socio-ok-title"
      >
        <button className="modal__close" onClick={onClose} aria-label="Fechar">
          <X aria-hidden="true" />
        </button>
        <img className="cm-logo cm-logo--dialog" src="/assets/img/clube-meldina/cm-white.svg" alt="" width={1500} height={915} />
        <h2 className="display text-3xl text-ouro mb-2" id="socio-ok-title">Bem-vindo ao Meldina!</h2>
        <p className="text-white/75 text-sm mb-6">
          Seu cadastro no plano <strong className="text-white">{planName}</strong> foi registrado.
          Agora você faz parte do Clube Meldina.
        </p>
        <button type="button" className="btn btn--block" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export const Socio: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("OURO");
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", phone: "", cpf: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const plan = PLANS.find((p) => p.key === selectedPlan)!;

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const choosePlan = (key: PlanKey) => {
    setSelectedPlan(key);
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg("");

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`#socio-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerMember({
        name: values.name.trim(),
        email: values.email.trim(),
        cpf: values.cpf.replace(/\D/g, ""),
        phone: values.phone.trim(),
        plan: selectedPlan,
      });

      if (res?.success) {
        setSuccessPlan(res.data?.member?.plan ? PLANS.find((p) => p.key === res.data.member.plan)?.name ?? plan.name : plan.name);
        setValues({ name: "", email: "", phone: "", cpf: "" });
      } else {
        setErrorMsg(res?.error || "Não foi possível concluir o cadastro. Confira os dados e tente novamente.");
      }
    } catch (err: unknown) {
      const apiError = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setErrorMsg(
        apiError ||
          "Não conseguimos falar com o servidor do clube. Verifique sua conexão e tente de novo em instantes; seus dados continuam no formulário."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldProps = (field: Field) => ({
    id: `socio-${field}`,
    value: values[field],
    onChange: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `socio-${field}-err` : undefined,
  });

  const fieldError = (field: Field) =>
    errors[field] ? (
      <span className="err" id={`socio-${field}-err`}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <div>
      <section className="page-hero page-hero--cm">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Clube Meldina</span>
          </nav>
          <p className="eyebrow">Programa Oficial de Sócios</p>
          <h1 className="cm-logo cm-logo--page">
            <img src="/assets/img/clube-meldina/cm-white.svg" alt="Clube Meldina" width={1500} height={915} decoding="async" />
          </h1>
          <p>
            Seja sócio-torcedor do Meldina FC. Garanta descontos exclusivos em camisas, acesso prioritário aos jogos e ajude a fortalecer o nosso clube na Série A.
          </p>
        </div>
      </section>

      {/* PLANOS */}
      <section className="section" id="planos">
        <div className="wrap">
          <div className="section-head text-center mx-auto mb-12">
            <div>
              <p className="eyebrow justify-center">Categorias</p>
              <h2 className="display text-4xl">Escolha seu plano</h2>
            </div>
          </div>

          <div className="plans">
            {PLANS.map((p) => {
              const isSelected = selectedPlan === p.key;
              return (
                <article
                  key={p.key}
                  className={`plan ${p.ribbon ? "plan--hl" : ""} ${isSelected ? "border-ouro" : ""}`}
                  aria-labelledby={`plan-${p.key}`}
                >
                  {p.ribbon && <span className="plan__ribbon">{p.ribbon}</span>}
                  <span className={`plan__tier ${p.ribbon ? "text-ouro" : ""}`}>{p.tier}</span>
                  <h3 className="display plan__name" id={`plan-${p.key}`}>{p.name}</h3>
                  <div className="plan__price">
                    <b>{p.price}</b>
                    <small>/mês</small>
                  </div>
                  <ul>
                    {p.perks.map((perk) => (
                      <li key={perk.text} className={perk.on ? "" : "off"}>
                        {perk.on ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                        <span>
                          {!perk.on && <span className="sr-only">Não incluso: </span>}
                          {perk.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`btn btn--block ${isSelected ? "" : "btn--ghost"}`}
                    aria-pressed={isSelected}
                    onClick={() => choosePlan(p.key)}
                  >
                    {isSelected ? "Plano selecionado" : `Selecionar ${p.name}`}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO DE ADESÃO */}
      <section className="section section--creme" id="formulario">
        <div className="wrap max-w-2xl">
          <div className="form-card text-white">
            <h2 className="display text-3xl mb-2">Cadastro de Sócio</h2>
            <p className="text-white/70 text-sm mb-6" aria-live="polite">
              Plano selecionado: <strong className="text-ouro font-bold">{plan.name}</strong> ({plan.price}/mês)
            </p>

            {errorMsg && (
              <div className="form-alert" role="alert">
                {errorMsg}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className={`field ${errors.name ? "has-error" : ""}`}>
                <label htmlFor="socio-name">Nome completo</label>
                <input type="text" autoComplete="name" maxLength={120} placeholder="Seu nome completo" {...fieldProps("name")} />
                {fieldError("name")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`field ${errors.email ? "has-error" : ""}`}>
                  <label htmlFor="socio-email">E-mail</label>
                  <input type="email" autoComplete="email" inputMode="email" maxLength={160} placeholder="seu@email.com" {...fieldProps("email")} />
                  {fieldError("email")}
                </div>
                <div className={`field ${errors.phone ? "has-error" : ""}`}>
                  <label htmlFor="socio-phone">Telefone / WhatsApp</label>
                  <input type="tel" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="(11) 99999-9999" {...fieldProps("phone")} />
                  {fieldError("phone")}
                </div>
              </div>

              <div className={`field ${errors.cpf ? "has-error" : ""}`}>
                <label htmlFor="socio-cpf">CPF (apenas números)</label>
                <input type="text" inputMode="numeric" autoComplete="off" maxLength={14} placeholder="000.000.000-00" {...fieldProps("cpf")} />
                {fieldError("cpf")}
              </div>

              <button
                type="submit"
                className="btn btn--block text-base py-4 mt-6"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Cadastrando…" : "Confirmar adesão"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {successPlan && <SuccessDialog planName={successPlan} onClose={() => setSuccessPlan(null)} />}
    </div>
  );
};
