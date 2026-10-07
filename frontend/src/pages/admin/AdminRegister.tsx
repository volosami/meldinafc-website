import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ShieldCheck, UserCheck, Key, Lock, Mail, User } from "lucide-react";

export const AdminRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(false);

    if (password.length < 6) {
      setError("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        password,
        adminKey,
      });

      if (res.success) {
        setSuccess("✅ Conta de Administrador criada com sucesso! Redirecionando para login...");
        setTimeout(() => {
          navigate("/admin/login");
        }, 1800);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Erro ao cadastrar administrador. Verifique se a Chave da Diretoria está correta.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noite flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-noite-2 border border-linha-escura p-8 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <img src="/assets/img/escudo.png" alt="Meldina FC" className="h-16 w-auto mx-auto mb-3" />
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Meldina FC</h1>
          <p className="font-regal text-xs text-ouro uppercase tracking-widest font-bold mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} /> Novo Cadastro de Diretoria
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-xs mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 p-3 rounded text-xs mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="field">
            <label className="flex items-center gap-1">
              <User size={13} className="text-ouro" /> Nome Completo
            </label>
            <input
              type="text"
              placeholder="Ex: Carlos Andrade"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="flex items-center gap-1">
              <Mail size={13} className="text-ouro" /> E-mail Administrativo
            </label>
            <input
              type="email"
              placeholder="admin@meldinafc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="flex items-center gap-1">
              <Lock size={13} className="text-ouro" /> Senha de Acesso
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="flex items-center gap-1">
              <Key size={13} className="text-ouro" /> Chave de Segurança da Diretoria
            </label>
            <input
              type="password"
              placeholder="Digite a Admin Key configurada no servidor"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Proteção contra cadastros não autorizados (ADMIN_REGISTRATION_KEY no .env).
            </span>
          </div>

          <button
            type="submit"
            className="btn btn--block btn--grena py-3 mt-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2"
            disabled={loading}
          >
            <UserCheck size={16} />
            {loading ? "Cadastrando..." : "Registrar Administrador →"}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-6 text-xs text-gray-500">
          <Link to="/admin/login" className="hover:text-ouro transition-colors">
            Já possui acesso? Fazer Login
          </Link>
          <Link to="/" className="hover:text-ouro transition-colors">
            ← Voltar ao site oficial
          </Link>
        </div>
      </div>
    </div>
  );
};
