import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Notícias", path: "/admin/noticias", icon: "📰" },
    { label: "Jogos & Placares", path: "/admin/jogos", icon: "⚽" },
    { label: "Elenco", path: "/admin/elenco", icon: "🏃" },
    { label: "Sócios Torcedores", path: "/admin/socios", icon: "👑" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-noite-2 text-white flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-noite border-r border-linha-escura flex flex-col">
        <div className="p-6 border-b border-linha-escura flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img src="/assets/img/escudo.png" alt="Meldina FC" className="h-10 w-auto" />
            <div>
              <span className="font-display text-lg uppercase block leading-none">Meldina FC</span>
              <span className="text-[10px] text-ouro uppercase tracking-widest font-bold">Painel Diretoria</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-grena text-white border-l-4 border-ouro"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-linha-escura space-y-2">
          <div className="text-xs text-gray-400">
            Logado como: <strong className="text-white block">{user?.email}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn btn--sm btn--ghost text-xs text-red-400 hover:text-red-300"
          >
            Sair do Painel
          </button>
          <Link to="/" className="w-full text-center block text-xs text-gray-500 hover:text-ouro mt-2">
            ← Voltar ao Site Público
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
