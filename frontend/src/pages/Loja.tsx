import React, { useState } from "react";
import { STATIC_PRODUCTS } from "../data/staticData";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

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

  return (
    <div>
      <section className="page-hero">
        <img className="page-hero__mark" src="/assets/img/monograma-outline.png" alt="" />
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Início</a> <span>/</span> <span>Loja Oficial</span>
          </div>
          <p className="eyebrow">Mantos & Acessórios</p>
          <h1 className="display">
            A armadura<br />
            <em>da realeza</em>
          </h1>
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
              <p className="eyebrow" style={{ color: "var(--grena)" }}>Uniformes de Jogo</p>
              <h2 className="display">Camisas Oficiais 2026</h2>
            </div>
          </div>

          <div className="products mb-16">
            {STATIC_PRODUCTS.slice(0, 2).map((prod) => (
              <div key={prod.id} className="product">
                <div className="product__img">
                  <img src={prod.image} alt={prod.name} className="photo" />
                  {prod.badge && <span className="product__badge">{prod.badge}</span>}
                </div>
                <div className="product__body">
                  <span className="product__cat">{prod.category}</span>
                  <h3 className="product__name">{prod.name}</h3>
                  <p className="text-xs text-gray-500">{prod.desc}</p>

                  {prod.sizes && (
                    <div className="sizes">
                      {prod.sizes.map((sz) => (
                        <button
                          key={sz}
                          className={selectedSizes[prod.id] === sz ? "is-active" : ""}
                          onClick={() => handleSelectSize(prod.id, sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="product__price">
                    R$ {prod.price.toFixed(2).replace(".", ",")}
                    <small>Em até 3x sem juros</small>
                  </div>

                  <button
                    className="btn btn--sm btn--block"
                    onClick={() => handleAddToCart(prod)}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACESSÓRIOS E COLECIONÁVEIS */}
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ color: "var(--grena)" }}>Acessórios</p>
              <h2 className="display">Colecionáveis Oficiais</h2>
            </div>
          </div>

          <div className="products">
            {STATIC_PRODUCTS.slice(2).map((prod) => (
              <div key={prod.id} className="product">
                <div className="product__img">
                  <img src={prod.image} alt={prod.name} className="photo" />
                  {prod.badge && <span className="product__badge">{prod.badge}</span>}
                </div>
                <div className="product__body">
                  <span className="product__cat">{prod.category}</span>
                  <h3 className="product__name">{prod.name}</h3>
                  <p className="text-xs text-gray-500">{prod.desc}</p>

                  <div className="product__price">
                    R$ {prod.price.toFixed(2).replace(".", ",")}
                  </div>

                  <button
                    className="btn btn--sm btn--block btn--dark"
                    onClick={() => handleAddToCart(prod)}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
