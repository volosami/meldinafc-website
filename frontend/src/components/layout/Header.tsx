import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const Header: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const { totalCount, openCart } = useCart();

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
          <img src="/assets/img/escudo.png" alt="Escudo do Meldina FC" />
          <div className="brand__txt">
            <span className="brand__name">Meldina FC</span>
            <span className="brand__tag">Muito além do jogo</span>
          </div>
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
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
            aria-label="Abrir carrinho"
            onClick={openCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={`cart-btn__count ${totalCount > 0 ? "is-on" : ""}`}>
              {totalCount}
            </span>
          </button>

          <Link to="/socio" className="btn btn--sm hidden lg:inline-flex">
            Seja Sócio
          </Link>

          <button
            className="burger"
            aria-label="Abrir menu"
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
