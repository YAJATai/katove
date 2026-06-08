"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[var(--color-surface-raised)] border-l border-[var(--color-border-default)] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--color-brand-400)]" />
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Cart</h2>
            {totalItems > 0 && (
              <span className="text-xs text-[var(--color-text-tertiary)]">({totalItems})</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-interactive-hover)] transition-colors active:scale-[0.95]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="w-16 h-16 text-[var(--color-text-tertiary)] mb-4 opacity-50" />
            <p className="text-[var(--color-text-secondary)] font-medium">Your cart is empty</p>
            <p className="text-[var(--color-text-tertiary)] text-sm mt-1">Add items to get started.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)]"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-overlay)] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-[var(--color-text-tertiary)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[var(--color-brand-400)] text-sm font-medium mt-0.5">
                      ₾{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-interactive-hover)] transition-colors active:scale-[0.95]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-[var(--color-text-primary)] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-interactive-hover)] transition-colors active:scale-[0.95]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--color-border-default)] px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)] text-sm">Total</span>
                <span className="text-xl font-bold text-[var(--color-brand-400)]">
                  ₾{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  router.push("/checkout");
                }}
                className="btn-primary w-full bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all duration-200 active:scale-[0.98]"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
