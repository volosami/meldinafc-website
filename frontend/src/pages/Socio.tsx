import React, { useState } from "react";
import { api } from "../services/api";

export const Socio: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<"BRONZE" | "PRATA" | "OURO">("OURO");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{
    member: any;
    pix: { code: string; amount: number };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !cpf || !phone) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerMember({
        name,
        email,
        cpf,
        phone,
        plan: selectedPlan,
      });

      if (res.success && res.data) {
        setSuccessData(res.data);
      } else {
        setErrorMsg(res.error || "Erro ao realizar cadastro.");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error || "Erro ao conectar com o servidor. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Clube Meldina</span>
          </div>
          <p className="eyebrow">Programa Oficial de Sócios</p>
          <h1 className="display">Clube Meldina</h1>
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
            {/* PLANO BRONZE */}
            <div
              className={`plan ${selectedPlan === "BRONZE" ? "border-ouro" : ""}`}
            >
              <span className="plan__tier">Plano Inicial</span>
              <h3 className="display plan__name">Bronze</h3>
              <div className="plan__price">
                <b>R$ 14,90</b>
                <small>/mês</small>
              </div>
              <ul>
                <li><span className="plan__ico">✓</span><span>Carteirinha digital de sócio</span></li>
                <li><span className="plan__ico">✓</span><span>5% de desconto na Loja Oficial</span></li>
                <li><span className="plan__ico">✓</span><span>Acesso ao grupo oficial no WhatsApp</span></li>
                <li className="off"><span className="plan__ico">✕</span><span>Desconto em ingressos de jogos</span></li>
                <li className="off"><span className="plan__ico">✕</span><span>Camisa oficial autografada</span></li>
              </ul>
              <button
                className={`btn btn--block ${selectedPlan === "BRONZE" ? "btn--grena" : "btn--ghost"}`}
                onClick={() => {
                  setSelectedPlan("BRONZE");
                  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {selectedPlan === "BRONZE" ? "Plano Selecionado" : "Selecionar Bronze"}
              </button>
            </div>

            {/* PLANO PRATA */}
            <div
              className={`plan ${selectedPlan === "PRATA" ? "border-ouro" : ""}`}
            >
              <span className="plan__tier">Mais Popular</span>
              <h3 className="display plan__name">Prata</h3>
              <div className="plan__price">
                <b>R$ 29,90</b>
                <small>/mês</small>
              </div>
              <ul>
                <li><span className="plan__ico">✓</span><span>Carteirinha digital de sócio</span></li>
                <li><span className="plan__ico">✓</span><span>10% de desconto na Loja Oficial</span></li>
                <li><span className="plan__ico">✓</span><span>20% de desconto em ingressos</span></li>
                <li><span className="plan__ico">✓</span><span>Participação em sorteios mensais</span></li>
                <li className="off"><span className="plan__ico">✕</span><span>Camisa oficial autografada</span></li>
              </ul>
              <button
                className={`btn btn--block ${selectedPlan === "PRATA" ? "btn--grena" : "btn--ghost"}`}
                onClick={() => {
                  setSelectedPlan("PRATA");
                  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {selectedPlan === "PRATA" ? "Plano Selecionado" : "Selecionar Prata"}
              </button>
            </div>

            {/* PLANO OURO */}
            <div
              className={`plan plan--hl ${selectedPlan === "OURO" ? "border-ouro" : ""}`}
            >
              <span className="plan__ribbon">Recomendado</span>
              <span className="plan__tier text-ouro">Elite Grená</span>
              <h3 className="display plan__name">Ouro</h3>
              <div className="plan__price">
                <b>R$ 49,90</b>
                <small>/mês</small>
              </div>
              <ul>
                <li><span className="plan__ico">✓</span><span>Todos os benefícios do Prata</span></li>
                <li><span className="plan__ico">✓</span><span>20% de desconto na Loja Oficial</span></li>
                <li><span className="plan__ico">✓</span><span>Acesso VIP nos eventos do clube</span></li>
                <li><span className="plan__ico">✓</span><span>Sorteio de 1 Camisa Oficial por ano</span></li>
                <li><span className="plan__ico">✓</span><span>Nome gravado no Mural do Clube</span></li>
              </ul>
              <button
                className="btn btn--block"
                onClick={() => {
                  setSelectedPlan("OURO");
                  document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {selectedPlan === "OURO" ? "Plano Selecionado" : "Selecionar Ouro"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO DE ADESÃO */}
      <section className="section section--creme" id="formulario">
        <div className="wrap max-w-2xl">
          <div className="form-card text-white">
            <h2 className="display text-3xl mb-2">Cadastro de Sócio</h2>
            <p className="text-gray-400 text-sm mb-6">
              Plano selecionado: <strong className="text-ouro font-bold">{selectedPlan}</strong> (R${" "}
              {selectedPlan === "OURO" ? "49,90" : selectedPlan === "PRATA" ? "29,90" : "14,90"}/mês)
            </p>

            {errorMsg && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="field">
                <label>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="field">
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>CPF (apenas números)</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  maxLength={14}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn--block btn--grena text-base py-4 mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Confirmar Adesão e Gerar Pix →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MODAL DE SUCESSO / PIX */}
      {successData && (
        <div className="modal is-open">
          <div className="modal__backdrop" onClick={() => setSuccessData(null)}></div>
          <div className="modal__box modal--sm text-center">
            <button
              className="modal__close"
              onClick={() => setSuccessData(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="display text-3xl text-ouro mb-2">Bem-vindo ao Meldina!</h3>
            <p className="text-gray-300 text-sm mb-6">
              Seu cadastro no plano <strong className="text-white">{successData.member.plan}</strong> foi realizado com sucesso.
            </p>

            <div className="bg-noite p-4 rounded border border-linha-escura text-left mb-6">
              <span className="text-xs text-ouro uppercase tracking-wider block font-bold mb-1">
                Pagamento via Pix (R$ {successData.pix.amount.toFixed(2).replace(".", ",")})
              </span>
              <p className="text-xs text-gray-400 break-all font-mono bg-black/40 p-2 rounded select-all">
                {successData.pix.code}
              </p>
            </div>

            <button
              className="btn btn--block btn--grena"
              onClick={() => {
                navigator.clipboard.writeText(successData.pix.code);
                alert("Código Pix copiado para a área de transferência!");
              }}
            >
              Copiar Código Pix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
