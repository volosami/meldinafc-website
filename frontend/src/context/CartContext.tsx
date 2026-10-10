import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "../types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size?: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const MAX_QTY = 20;

// Descarta itens corrompidos ou de versões antigas salvos no navegador.
function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (it): it is CartItem =>
      !!it &&
      typeof it === "object" &&
      typeof it.product?.id === "string" &&
      typeof it.product?.name === "string" &&
      typeof it.product?.price === "number" &&
      Number.isInteger(it.quantity) &&
      it.quantity > 0
  );
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("meldina_cart");
      return saved ? sanitizeCart(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("meldina_cart", JSON.stringify(items));
    } catch {
      // Modo privado ou cota cheia: o carrinho segue funcionando só nesta aba.
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product: Product, size?: string) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.size === size
      );
      if (existingIdx > -1) {
        return prev.map((it, i) =>
          i === existingIdx ? { ...it, quantity: Math.min(it.quantity + 1, MAX_QTY) } : it
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const current = prev[index];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((it, i) => (i === index ? { ...it, quantity: Math.min(newQty, MAX_QTY) } : it));
    });
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
