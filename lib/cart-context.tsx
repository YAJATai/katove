"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "./types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem: (item, qty = 1) => {
          setItems((prev) =>
            prev.find((i) => i.id === item.id)
              ? prev.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
                )
              : [...prev, { ...item, quantity: qty }]
          );
        },
        removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
        updateQuantity: (id, qty) => {
          if (qty < 1) return;
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
          );
        },
        clearCart: () => setItems([]),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
