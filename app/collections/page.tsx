"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, SlidersHorizontal, Grid3x3, List, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const handleAdd = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(product.id); return next; }), 1500);
  };

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import("@/lib/supabase");
        let query = supabase.from("products").select("*, categories!inner(name, slug)");
        if (categorySlug) {
          query = query.eq("categories.slug", categorySlug);
        }
        const { data } = await query;
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }
    load();
  }, [categorySlug]);

  const filteredProducts = categorySlug
    ? products.filter((p) => p.categories?.slug === categorySlug)
    : products;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Page header */}
        <div className="flex items-end justify-between mb-8">
          <div className="stagger-children">
            <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
              {categorySlug || "ALL PRODUCTS"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mt-2">
              {categorySlug ? categorySlug.replace(/-/g, " ") : "Products"}
            </h1>
            <p className="text-[var(--color-text-tertiary)] mt-2 text-sm">
              {loading ? "Loading..." : `${filteredProducts.length} products available`}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-tertiary)] hover:text-white hover:border-white/20 transition-all duration-150 text-sm active:scale-[0.97]">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex border border-[var(--color-border-strong)] rounded-xl overflow-hidden">
              <button className="p-2.5 bg-white/5 text-white"><Grid3x3 className="w-4 h-4" /></button>
              <button className="p-2.5 text-[var(--color-text-tertiary)] hover:text-white transition-colors"><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden">
                <div className="aspect-square skeleton rounded-none" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-20 rounded-full skeleton" />
                  <div className="h-4 w-40 rounded-full skeleton" />
                  <div className="h-4 w-16 rounded-full skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-32 stagger-children">
            <ShoppingBag className="w-16 h-16 mx-auto text-[var(--color-text-tertiary)] mb-4 opacity-50" />
            <p className="text-[var(--color-text-secondary)] text-lg">No products found in this category.</p>
            <p className="text-[var(--color-text-tertiary)] text-sm mt-2">Try a different category or browse all products.</p>
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative card-hover rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden hover:border-[var(--color-border-accent)] hover:shadow-glow-primary group flex flex-col"
              >
                <Link href={`/collections?product=${product.slug}`} className="absolute inset-0 z-10"></Link>
                <div className="aspect-square bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-overlay)] relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-[var(--color-text-tertiary)]" />
                    </div>
                  )}
                  {product.is_top_pick && (
                    <div className="absolute top-3 left-3 backdrop-blur-sm bg-[var(--color-brand-400)]/20 border border-[var(--color-border-accent)] text-[var(--color-brand-400)] text-[9px] font-bold px-2 py-0.5 rounded-full">
                      ★ Top Pick
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-medium">
                    {product.categories?.name || "General"}
                  </p>
                  <h3 className="text-[var(--color-text-primary)] font-bold text-sm leading-tight line-clamp-1 group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[var(--color-brand-400)] font-bold text-base">
                      ₾{product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                    className={`relative z-20 pointer-events-auto btn-primary w-full mt-auto pt-2 pb-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border active:scale-[0.97] ${
                      addedIds.has(product.id)
                        ? "bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] border-[var(--color-brand-400)]"
                        : "bg-transparent text-white border-white/20 hover:border-[var(--color-brand-400)] hover:text-[var(--color-brand-400)]"
                    }`}
                  >
                    {addedIds.has(product.id) ? (
                      <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Added</span>
                    ) : (
                      "ADD"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center py-32 text-[var(--color-text-tertiary)]">Loading...</div>
        </div>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
