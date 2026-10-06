import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("admin@meldinafc.com");
  const [password, setPassword] = useState("meldina2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen bg-noite flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-noite-2 border border-linha-escura p-8 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <img src="/assets/img/escudo.png" alt="Meldina FC" className="h-16 w-auto mx-auto mb-3" />
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Meldina FC</h1>
          <p className="font-regal text-xs text-ouro uppercase tracking-widest font-bold mt-1">
            Acesso Restrito da Diretoria
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-xs mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="field">
            <label>E-mail Administrativo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--block btn--grena py-3 mt-4 text-sm font-bold tracking-wider"
            disabled={loading}
          >
            {loading ? "Autenticando..." : "Entrar no Painel →"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-gray-500 hover:text-ouro">
            ← Voltar ao site oficial
          </a>
        </div>
      </div>
    </div>
  );
};
