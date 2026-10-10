import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const Header: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const { totalCount, openCart } = useCart();

  // Fecha o menu ao trocar de página e com Esc.
  useEffect(() => setNavOpen(false), [location.pathname]);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const navLinks = [
    { label: "Início", path: "/" },
    { label: "O Clube", path: "/clube" },
    { label: "Elenco", path: "/elenco" },
    { label: "Jogos & Tabela", path: "/jogos" },
    { label: "Notícias", path: "/noticias" },
    { label: "Meldina TV", path: "/tv" },
    { label: "Loja Oficial", path: "/loja" },
  ];

  return (
    <header className={`header ${navOpen ? "nav-open" : ""}`}>
      <div className="wrap">
        <Link to="/" className="brand" onClick={() => setNavOpen(false)}>
          <img src="/assets/img/escudo-sm.png" alt="Escudo do Meldina FC" />
          <div className="brand__txt">
            <span className="brand__name">Meldina FC</span>
            <span className="brand__tag">Muito além do jogo</span>
          </div>
        </Link>

        <nav className="nav" id="nav-principal" aria-label="Navegação principal">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setNavOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="header__cta">
          <button
            className="cart-btn"
            aria-label={
              totalCount > 0
                ? `Abrir carrinho, ${totalCount} ${totalCount === 1 ? "item" : "itens"}`
                : "Abrir carrinho, vazio"
            }
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={`cart-btn__count ${totalCount > 0 ? "is-on" : ""}`} aria-hidden="true">
              {totalCount}
            </span>
          </button>

          <Link to="/socio" className="btn btn--sm hidden lg:inline-flex">
            Seja Sócio
          </Link>

          <button
            className="burger"
            aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={navOpen}
            aria-controls="nav-principal"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
