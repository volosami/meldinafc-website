import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Users,
  Shield,
  Crown,
  KeyRound,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { api } from "../../services/api";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Notícias", path: "/admin/noticias", icon: Newspaper },
    { label: "Jogos & Placares", path: "/admin/jogos", icon: Trophy },
    { label: "Elenco", path: "/admin/elenco", icon: Users },
    { label: "Clube & Estádio", path: "/admin/clube", icon: Shield },
    { label: "Sócios Torcedores", path: "/admin/socios", icon: Crown },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwdError("");
    setPwdSuccess("");
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (newPassword.length < 8) {
      setPwdError("A nova senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("A confirmação da nova senha não confere.");
      return;
    }

    setPwdLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPwdSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao alterar a senha.";
      setPwdError(msg);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar" aria-label="Menu da Diretoria">
        <div className="p-6 border-b border-linha-escura">
          <Link to="/admin/dashboard" className="brand">
            <img src="/assets/img/escudo-sm.png" alt="Meldina FC" className="h-12 w-auto" />
            <div className="brand__txt">
              <span className="brand__name">Meldina FC</span>
              <span className="brand__tag">Painel Diretoria</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5" aria-label="Seções do painel">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin/dashboard" && location.pathname === "/admin");
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`admin-nav-link ${isActive ? "is-active" : ""}`}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-linha-escura space-y-3 bg-black/20">
          <div className="text-xs text-white/60">
            <span className="uppercase tracking-widest text-[10px] text-ouro font-bold block mb-0.5">
              Credencial Ativa
            </span>
            <strong className="text-white block truncate" title={user?.email}>
              {user?.email || "admin@meldinafc.com"}
            </strong>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openPasswordModal}
              className="btn btn--sm btn--ghost text-[11px] px-2 py-2 flex items-center justify-center gap-1.5"
            >
              <KeyRound size={13} aria-hidden="true" />
              Senha
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn--sm btn--grena text-[11px] px-2 py-2 flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} aria-hidden="true" />
              Sair
            </button>
          </div>

          <Link
            to="/"
            className="w-full pt-1 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-white/65 hover:text-ouro transition-colors"
          >
            <ExternalLink size={13} aria-hidden="true" />
            Ver Site Público
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="admin-main">
        <Outlet />
      </main>

      {/* MODAL DE ALTERAR SENHA */}
      {showPasswordModal && (
        <div
          className="modal modal--sm is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-change-password-title"
        >
          <div
            className="modal__backdrop"
            onClick={() => setShowPasswordModal(false)}
            aria-hidden="true"
          />
          <div className="modal__box">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="modal__close"
              aria-label="Fechar modal"
            >
              <X aria-hidden="true" />
            </button>

            <p className="eyebrow">Segurança</p>
            <h2
              id="modal-change-password-title"
              className="display text-3xl mb-6"
            >
              Alterar Senha
            </h2>

            {pwdError && (
              <div className="form-alert" role="alert">
                {pwdError}
              </div>
            )}

            {pwdSuccess && (
              <div className="mb-6 p-3.5 rounded bg-vitoria/20 border border-vitoria text-white text-sm font-medium">
                {pwdSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="field">
                <label htmlFor="current-password">Senha Atual</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="new-password">Nova Senha</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="confirm-password">Confirmar Nova Senha</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                  minLength={8}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn--sm btn--ghost"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="btn btn--sm"
                  disabled={pwdLoading}
                >
                  {pwdLoading ? "Salvando..." : "Salvar Nova Senha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
