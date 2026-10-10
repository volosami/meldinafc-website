import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Topbar } from "./components/layout/Topbar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Páginas Públicas
import { Home } from "./pages/Home";
import { Clube } from "./pages/Clube";
import { Elenco } from "./pages/Elenco";
import { Jogos } from "./pages/Jogos";
import { Noticias } from "./pages/Noticias";
import { NoticiaDetalhe } from "./pages/NoticiaDetalhe";
import { Socio } from "./pages/Socio";
import { Loja } from "./pages/Loja";
import { Tv } from "./pages/Tv";

// Painel Admin: carregado sob demanda, para não pesar no site público.
const lazyNamed = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const AdminLogin = lazyNamed(() => import("./pages/admin/AdminLogin"), "AdminLogin");
const AdminRegister = lazyNamed(() => import("./pages/admin/AdminRegister"), "AdminRegister");
const AdminDashboard = lazyNamed(() => import("./pages/admin/AdminDashboard"), "AdminDashboard");
const AdminNoticias = lazyNamed(() => import("./pages/admin/AdminNoticias"), "AdminNoticias");
const AdminJogos = lazyNamed(() => import("./pages/admin/AdminJogos"), "AdminJogos");
const AdminElenco = lazyNamed(() => import("./pages/admin/AdminElenco"), "AdminElenco");
const AdminClube = lazyNamed(() => import("./pages/admin/AdminClube"), "AdminClube");
const AdminSocios = lazyNamed(() => import("./pages/admin/AdminSocios"), "AdminSocios");
const AdminLayout = lazyNamed(() => import("./components/admin/AdminLayout"), "AdminLayout");
const ProtectedRoute = lazyNamed(() => import("./components/admin/ProtectedRoute"), "ProtectedRoute");

const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Topbar />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
};

export function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Router>
          <ScrollManager />
          <PublicLayout>
            <Suspense fallback={<p className="section wrap text-white/70" role="status">Carregando…</p>}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/clube" element={<Clube />} />
              <Route path="/elenco" element={<Elenco />} />
              <Route path="/jogos" element={<Jogos />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/noticias/:slug" element={<NoticiaDetalhe />} />
              <Route path="/socio" element={<Socio />} />
              <Route path="/loja" element={<Loja />} />
              <Route path="/tv" element={<Tv />} />

              {/* Rotas de Autenticação Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* Rotas Administrativas Protegidas */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="noticias" element={<AdminNoticias />} />
                  <Route path="jogos" element={<AdminJogos />} />
                  <Route path="elenco" element={<AdminElenco />} />
                  <Route path="clube" element={<AdminClube />} />
                  <Route path="socios" element={<AdminSocios />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          </PublicLayout>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
  );
}
