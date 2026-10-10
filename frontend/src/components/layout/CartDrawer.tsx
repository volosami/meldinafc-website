import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useModalFocus } from "../../hooks/useModalFocus";
import { formatBRL } from "../../lib/format";

/*
 * Carrinho da Loja Oficial. Pela regra "ninguém paga" (PRODUCT.md), o pedido
 * termina numa confirmação: não há etapa de pagamento, Pix, cartão ou boleto.
 */
export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useModalFocus(isOpen, panelRef, closeCart, closeRef);

  // Ao reabrir o carrinho depois de um pedido, volta à lista.
  useEffect(() => {
    if (!isOpen) setConfirmed(false);
  }, [isOpen]);

  const finishOrder = () => {
    clearCart();
    setConfirmed(true);
    closeRef.current?.focus();
  };

  return (
    <div className={`drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer__backdrop" onClick={closeCart}></div>
      <div
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="drawer__head">
          <h2 className="display" id="cart-title">Seu Carrinho</h2>
          <button ref={closeRef} type="button" onClick={closeCart} aria-label="Fechar carrinho">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="drawer__items" aria-live="polite">
          {confirmed ? (
            <div className="drawer__done">
              <div className="form-success__icon" aria-hidden="true">
                <Check />
              </div>
              <h3 className="display">Pedido registrado</h3>
              <p>Obrigado, torcedor. Seu pedido foi registrado na Loja Oficial do Meldina.</p>
              <Link className="btn btn--dark" to="/loja" onClick={closeCart}>
                Continuar na loja
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="drawer__empty">
              <img src="/assets/img/escudo-sm.png" alt="" />
              <p className="font-semibold text-lg">Seu carrinho está vazio</p>
              <p className="text-sm mt-1">Explore os produtos oficiais na loja do clube.</p>
            </div>
          ) : (
            <ul className="drawer__list">
              {items.map((item, idx) => (
                <li key={`${item.product.id}-${item.size ?? ""}`} className="line">
                  <div className="line__img">
                    <img
                      src={item.product.image}
                      alt=""
                      className={item.product.isArt ? "art" : ""}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="line__name">{item.product.name}</div>
                    {item.size && <div className="line__sub">Tamanho: {item.size}</div>}
                    <div className="qty" role="group" aria-label={`Quantidade de ${item.product.name}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -1)}
                        aria-label={item.quantity === 1 ? `Remover ${item.product.name}` : "Diminuir quantidade"}
                      >
                        <Minus aria-hidden="true" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, 1)}
                        aria-label="Aumentar quantidade"
                        disabled={item.quantity >= 20}
                      >
                        <Plus aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="line__price">{formatBRL(item.product.price * item.quantity)}</div>
                    <button
                      type="button"
                      className="line__rm"
                      onClick={() => removeItem(idx)}
                      aria-label={`Remover ${item.product.name} do carrinho`}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!confirmed && items.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__row">
              <span>Subtotal</span>
              <span>{formatBRL(totalPrice)}</span>
            </div>
            <div className="drawer__row">
              <span>Frete</span>
              <span className="text-green-800 font-semibold">Grátis para Sócios</span>
            </div>
            <div className="drawer__row total">
              <span>Total</span>
              <span>{formatBRL(totalPrice)}</span>
            </div>
            <button type="button" className="btn btn--grena btn--block" onClick={finishOrder}>
              Finalizar pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
