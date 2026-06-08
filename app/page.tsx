"use client";

import HeroSection from "@/components/HeroSection";
import BannerSection from "@/components/BannerSection";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import type { Product, Category } from "@/lib/types";

function SkeletonCard() {
  return (
    <div className="min-w-[260px] sm:min-w-[300px] rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden flex-shrink-0">
      <div className="aspect-square skeleton rounded-none" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full skeleton" />
        <div className="h-4 w-40 rounded-full skeleton" />
        <div className="h-4 w-20 rounded-full skeleton" />
      </div>
    </div>
  );
}

function SkeletonCategory() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] min-h-[200px] skeleton p-6" />
  );
}

const fallbackCategories: Category[] = [
  { id: "cat-1", name: "Rolex", slug: "rolex", description: "Swiss precision timepieces", created_at: "" },
  { id: "cat-2", name: "Audemars Piguet", slug: "audemars-piguet", description: "Haute horlogerie", created_at: "" },
  { id: "cat-3", name: "Cartier", slug: "cartier", description: "French luxury", created_at: "" },
  { id: "cat-4", name: "Louis Vuitton", slug: "louis-vuitton", description: "Maison française", created_at: "" },
  { id: "cat-5", name: "Dior", slug: "dior", description: "Couture & accessories", created_at: "" },
  { id: "cat-6", name: "Goyard", slug: "goyard", description: "Trunk-maker since 1792", created_at: "" },
  { id: "cat-7", name: "Frames", slug: "frames", description: "Luxury eyewear", created_at: "" },
];

const fallbackProducts: Product[] = [
  { id: "prod-1", name: "Rolex Daytona 116500LN", slug: "rolex-daytona", description: "Ceramic bezel, white dial", price: 32500, image_url: "https://i.ibb.co/4mkYqD0/rolex-daytona.jpg", category_id: "cat-1", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: true, created_at: "" },
  { id: "prod-2", name: "AP Royal Oak 15500ST", slug: "ap-royal-oak", description: "Blue dial, steel bracelet", price: 42500, image_url: "https://i.ibb.co/Lp5FkYW/ap-royal-oak.jpg", category_id: "cat-2", categories: { name: "Audemars Piguet", slug: "audemars-piguet" }, is_top_pick: true, created_at: "" },
  { id: "prod-3", name: "Cartier Love Bracelet SM", slug: "cartier-love-sm", description: "18K yellow gold", price: 7500, image_url: "https://i.ibb.co/HC3q0sj/cartier-love.jpg", category_id: "cat-3", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: true, created_at: "" },
  { id: "prod-4", name: "Louis Vuitton Neverfull MM", slug: "lv-neverfull-mm", description: "Damier Azur canvas", price: 2150, image_url: "https://i.ibb.co/jGHMFY9/lv-neverfull.jpg", category_id: "cat-4", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: true, created_at: "" },
  { id: "prod-5", name: "Dior Saddle Bag", slug: "dior-saddle", description: "Blue Oblique canvas", price: 4200, image_url: "https://i.ibb.co/7NMyxXj/dior-saddle.jpg", category_id: "cat-5", categories: { name: "Dior", slug: "dior" }, is_top_pick: true, created_at: "" },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingProd, setLoadingProd] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const productsScrollRef = useRef<HTMLDivElement>(null);
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
        const [{ data: cats }, { data: prods }] = await Promise.all([
          supabase.from("categories").select("*").order("name"),
          supabase.from("products").select("*, categories!inner(name, slug)").eq("is_top_pick", true),
        ]);
        if (cats && cats.length > 0) setCategories(cats);
        if (prods && prods.length > 0) setProducts(prods);
      } catch {}
      setLoadingCat(false);
      setLoadingProd(false);
    }
    load();
  }, []);

  const scrollProducts = (dir: number) => {
    if (!productsScrollRef.current) return;
    productsScrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <>
      <HeroSection />

      {/* Banner */}
      <BannerSection />

      {/* Categories */}
      <section className="py-20 bg-[var(--color-surface-raised)]" id="categories">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-12 stagger-children">
            <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
              PRODUCT CATEGORIES
            </span>
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mt-2">
              Browse Our Collection
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-3 max-w-2xl text-sm leading-relaxed">
              Browse our product categories. Find exactly what you&apos;re looking for across our full collection.
            </p>
          </div>
          {loadingCat ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonCategory key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-[var(--color-border-default)] bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] hover:border-[var(--color-border-accent)] transition-all duration-300 p-6 min-h-[200px] flex flex-col justify-end card-hover"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-400)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  <h3 className="text-[var(--color-text-primary)] font-bold text-lg group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[var(--color-text-tertiary)] text-sm mt-1">{cat.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-[var(--color-brand-400)] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-[-4px] group-hover:translate-x-0">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Products */}
      <section className="py-14 sm:py-20 bg-[var(--color-surface-raised)]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="stagger-children">
              <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
                Featured
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mt-2">
                Most Requested Pieces
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl">
                The items in highest demand from our private client network.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollProducts(-1)}
                className="w-12 h-12 rounded-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-[var(--color-text-on-primary)] hover:border-[var(--color-brand-400)] transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollProducts(1)}
                className="w-12 h-12 rounded-full bg-[var(--color-surface-overlay)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-[var(--color-text-on-primary)] hover:border-[var(--color-brand-400)] transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollProducts(-1)}
              className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-[var(--color-text-on-primary)] transition-all duration-150 active:scale-[0.97]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollProducts(1)}
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-[var(--color-text-on-primary)] transition-all duration-150 active:scale-[0.97]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div
              ref={productsScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {loadingProd ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                products.slice(0, 10).map((product) => (
                  <div
                    key={product.id}
                    className="card-hover min-w-[260px] sm:min-w-[300px] rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden hover:border-[var(--color-border-accent)] hover:shadow-glow-primary group/product flex-shrink-0"
                  >
                    <div className="aspect-square bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-overlay)] relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/product:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-[var(--color-text-tertiary)]" />
                        </div>
                      )}
                      {product.is_top_pick && (
                        <div className="absolute top-3 left-3 backdrop-blur-sm bg-[var(--color-brand-400)]/20 border border-[var(--color-border-accent)] text-[var(--color-brand-400)] text-[9px] font-bold px-2 py-0.5 rounded-full">
                          ★ Top Pick
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover/product:bg-black/20 transition-all duration-300" />
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-medium">
                        {product.categories?.name || "General"}
                      </p>
                      <h3 className="text-[var(--color-text-primary)] font-bold text-sm leading-tight line-clamp-1 group-hover/product:text-[var(--color-brand-400)] transition-colors duration-200">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-brand-400)] font-bold text-base">
                          ₾{product.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`btn-primary w-full mt-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border active:scale-[0.97] ${
                          addedIds.has(product.id)
                            ? "bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] border-[var(--color-brand-400)]"
                            : "border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-400)] hover:text-[var(--color-text-on-primary)] hover:border-[var(--color-brand-400)]"
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
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
