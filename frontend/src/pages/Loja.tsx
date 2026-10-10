import React, { useState } from "react";
import { Link } from "react-router-dom";
import { STATIC_PRODUCTS } from "../data/staticData";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { FallbackImage } from "../components/ui/FallbackImage";
import { formatBRL } from "../lib/format";

/*
 * Loja Oficial: vitrine e carrinho funcionam como numa loja de verdade, mas
 * nada é vendido (regra "ninguém paga" em PRODUCT.md). Sem parcelamento,
 * meios de pagamento ou checkout.
 */
export const Loja: React.FC = () => {
  const { addItem } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "camisa-1": "M",
    "camisa-2": "M",
  });

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const size = product.sizes ? selectedSizes[product.id] || product.sizes[0] : undefined;
    addItem(product, size);
  };

  const renderProduct = (prod: Product, buttonClass: string) => {
    const selected = prod.sizes ? selectedSizes[prod.id] || prod.sizes[0] : undefined;
    return (
      <article key={prod.id} className="product">
        <div className="product__img">
          <FallbackImage src={prod.image} alt="" className="photo" loading="lazy" />
          {prod.badge && <span className="product__badge">{prod.badge}</span>}
        </div>
        <div className="product__body">
          <span className="product__cat">{prod.category}</span>
          <h3 className="product__name">{prod.name}</h3>
          {prod.desc && <p className="text-xs text-tinta/70">{prod.desc}</p>}

          {prod.sizes && (
            <div className="sizes" role="group" aria-label={`Tamanho de ${prod.name}`}>
              {prod.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={selected === sz ? "is-active" : ""}
                  aria-pressed={selected === sz}
                  onClick={() => handleSelectSize(prod.id, sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          <div className="product__price">{formatBRL(prod.price)}</div>

          <button
            type="button"
            className={`btn btn--sm btn--block ${buttonClass}`}
            onClick={() => handleAddToCart(prod)}
            aria-label={`Adicionar ${prod.name}${selected ? `, tamanho ${selected},` : ""} ao carrinho`}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </article>
    );
  };

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Trilha">
            <Link to="/">Início</Link> <span aria-hidden="true">/</span> <span aria-current="page">Loja Oficial</span>
          </nav>
          <p className="eyebrow">Mantos & Acessórios</p>
          <h1 className="display">Loja Oficial</h1>
          <p>
            Vista as cores da nossa história. Camisas oficiais da temporada 2026, bonés, canecas e produtos exclusivos com entrega para todo o Brasil.
          </p>
        </div>
      </section>

      {/* VITRINE PRINCIPAL */}
      <section className="section section--creme">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Uniformes de Jogo</p>
              <h2 className="display">Camisas Oficiais 2026</h2>
            </div>
          </div>

          <div className="products mb-16">
            {STATIC_PRODUCTS.slice(0, 2).map((prod) => renderProduct(prod, ""))}
          </div>

          {/* ACESSÓRIOS E COLECIONÁVEIS */}
          <div className="section-head">
            <div>
              <p className="eyebrow">Acessórios</p>
              <h2 className="display">Colecionáveis Oficiais</h2>
            </div>
          </div>

          <div className="products">
            {STATIC_PRODUCTS.slice(2).map((prod) => renderProduct(prod, "btn--dark"))}
          </div>
        </div>
      </section>
    </div>
  );
};
