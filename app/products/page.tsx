"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

const fallbackProducts: Product[] = [
  { id: "prod-1", name: "Rolex Daytona 116500LN", slug: "rolex-daytona", description: "Ceramic bezel, white dial. The definitive chronograph.", price: 32500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-1", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: true, created_at: "" },
  { id: "prod-2", name: "AP Royal Oak 15500ST", slug: "ap-royal-oak", description: "Blue dial, steel bracelet. Iconic octagonal bezel.", price: 42500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-2", categories: { name: "Audemars Piguet", slug: "audemars-piguet" }, is_top_pick: true, created_at: "" },
  { id: "prod-3", name: "Cartier Love Bracelet SM", slug: "cartier-love-sm", description: "18K yellow gold. The eternal symbol of love.", price: 7500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-3", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: true, created_at: "" },
  { id: "prod-4", name: "Louis Vuitton Neverfull MM", slug: "lv-neverfull-mm", description: "Damier Azur canvas. The iconic tote.", price: 2150, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-4", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: true, created_at: "" },
  { id: "prod-5", name: "Dior Saddle Bag", slug: "dior-saddle", description: "Blue Oblique canvas. A true collector's piece.", price: 4200, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-5", categories: { name: "Dior", slug: "dior" }, is_top_pick: true, created_at: "" },
  { id: "prod-6", name: "Goyard Belvedere PM", slug: "goyard-belvedere", description: "Chevron canvas. Understated Parisian elegance.", price: 3200, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-6", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "prod-7", name: "Cartier Panthere", slug: "cartier-panthere", description: "Medium model, steel & gold. The feline icon.", price: 12400, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-3", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: false, created_at: "" },
  { id: "prod-8", name: "Rolex Submariner Date", slug: "rolex-submariner", description: "Ceramic bezel, black dial. The diver's benchmark.", price: 18500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-1", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: true, created_at: "" },
];

export default function ProductsPage() {
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
        const { data } = await supabase.from("products").select("*, categories!inner(name, slug)").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch {
        setProducts(fallbackProducts);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
              <span className="text-white">ALL </span>
              <span className="text-[var(--color-brand-400)] italic">PRODUCTS</span>
            </h1>
            <div className="flex items-start gap-4 mt-6">
              <div className="w-1 h-10 bg-[var(--color-brand-400)] shrink-0 rounded-full" />
              <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
                Browse our full product catalog.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-full px-4 py-2">
            <span className="text-[var(--color-brand-400)] text-sm font-bold">
              {loading ? "..." : products.length}
            </span>
            <span className="text-[var(--color-text-tertiary)] text-xs">Products</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden skeleton" style={{ height: 380 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] overflow-hidden flex flex-col card-hover hover:border-[var(--color-border-accent)]"
              >
                <Link href={`/collections?product=${product.slug}`} className="absolute inset-0 z-10" />
                {/* Shopping bag icon top-right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-[var(--color-brand-400)]" />
                  </div>
                </div>

                {/* Product image */}
                <Link href={`/collections?product=${product.slug}`} className="block aspect-square bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-overlay)] flex items-center justify-center p-6">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-[var(--color-text-tertiary)]" />
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/collections?product=${product.slug}`}>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[var(--color-text-tertiary)] text-xs mt-1 line-clamp-1">
                    {product.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="text-[var(--color-brand-400)] font-bold text-sm font-mono tracking-wide">
                      ₾{product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                      className={`relative z-20 pointer-events-auto flex items-center gap-1 text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-all duration-200 active:scale-[0.97] ${
                        addedIds.has(product.id)
                          ? "bg-[var(--color-brand-400)] text-black"
                          : "bg-white text-black hover:bg-[var(--color-brand-400)]"
                      }`}
                    >
                      {addedIds.has(product.id) ? (
                        <><Check className="w-3 h-3" /> Added</>
                      ) : (
                        "ADD +"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
