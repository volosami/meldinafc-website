import React from "react";
import { useCart } from "../../context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
  } = useCart();

  return (
    <div className={`drawer ${isOpen ? "is-open" : ""}`}>
      <div className="drawer__backdrop" onClick={closeCart}></div>
      <div className="drawer__panel">
        <div className="drawer__head">
          <h3 className="display">Seu Carrinho</h3>
          <button onClick={closeCart} aria-label="Fechar carrinho">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer__items">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <img src="/assets/img/escudo.png" alt="" />
              <p className="font-semibold text-lg">Seu carrinho está vazio</p>
              <p className="text-sm mt-1">Explore os produtos oficiais na loja do clube.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.size}-${idx}`} className="line">
                <div className="line__img">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={item.product.isArt ? "art" : ""}
                  />
                </div>
                <div>
                  <div className="line__name">{item.product.name}</div>
                  {item.size && (
                    <div className="line__sub">Tamanho: {item.size}</div>
                  )}
                  <div className="qty">
                    <button
                      onClick={() => updateQuantity(idx, -1)}
                      aria-label="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idx, 1)}
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <div className="line__price">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                  </div>
                  <button
                    className="line__rm"
                    onClick={() => removeItem(idx)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__row">
              <span>Subtotal</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="drawer__row">
              <span>Frete</span>
              <span className="text-green-700 font-semibold">Grátis para Sócios</span>
            </div>
            <div className="drawer__row total">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <button
              className="btn btn--grena btn--block"
              onClick={() => {
                alert(
                  `Pedido simulado com sucesso no valor de R$ ${totalPrice
                    .toFixed(2)
                    .replace(".", ",")}! Chave Pix gerada.`
                );
                closeCart();
              }}
            >
              Finalizar Compra via Pix
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
