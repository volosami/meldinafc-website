import React from "react";
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

// Painel Admin
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminRegister } from "./pages/admin/AdminRegister";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminNoticias } from "./pages/admin/AdminNoticias";
import { AdminJogos } from "./pages/admin/AdminJogos";
import { AdminElenco } from "./pages/admin/AdminElenco";
import { AdminClube } from "./pages/admin/AdminClube";
import { AdminSocios } from "./pages/admin/AdminSocios";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Topbar />
      <Header />
      <main>{children}</main>
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
          <PublicLayout>
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
          </PublicLayout>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
  );
}
