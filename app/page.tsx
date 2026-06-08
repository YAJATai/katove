"use client";

import HeroSection from "@/components/HeroSection";
import BannerSection from "@/components/BannerSection";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import type { Product, Category } from "@/lib/types";

const fallbackCategories: Category[] = [
  { id: "cat-1", name: "Rolex", slug: "rolex", description: "Swiss precision timepieces", created_at: "" },
  { id: "cat-2", name: "Audemars Piguet", slug: "audemars-piguet", description: "Haute horlogerie", created_at: "" },
  { id: "cat-3", name: "Cartier", slug: "cartier", description: "French luxury", created_at: "" },
  { id: "cat-4", name: "Louis Vuitton", slug: "louis-vuitton", description: "Maison française", created_at: "" },
  { id: "cat-5", name: "Dior", slug: "dior", description: "Couture & accessories", created_at: "" },
  { id: "cat-6", name: "Goyard", slug: "goyard", description: "Trunk-maker since 1792", created_at: "" },
  { id: "cat-7", name: "Frames", slug: "frames", description: "Luxury eyewear", created_at: "" },
];

const fallbackLatestProducts: Product[] = [
  {
    id: "lv-bag",
    name: "louis vuitton Bag",
    slug: "lv-bag",
    description: "Louis Vuitton luxury bag",
    price: 300.00,
    image_url: "https://i.ibb.co/8L6zccv0/1773330962788-20fb4c93.webp",
    category_id: "cat-4",
    categories: { name: "Louis Vuitton", slug: "louis-vuitton" },
    is_top_pick: false,
    created_at: ""
  },
  {
    id: "lv-wallet-1",
    name: "louis vuitton Wallet",
    slug: "lv-wallet-1",
    description: "Louis Vuitton luxury wallet",
    price: 130.00,
    image_url: "https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg",
    category_id: "cat-4",
    categories: { name: "Louis Vuitton", slug: "louis-vuitton" },
    is_top_pick: false,
    created_at: ""
  },
  {
    id: "goyard-1",
    name: "Goyard",
    slug: "goyard-1",
    description: "Goyard exclusive accessory",
    price: 40.00,
    image_url: "https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg",
    category_id: "cat-6",
    categories: { name: "Goyard", slug: "goyard" },
    is_top_pick: false,
    created_at: ""
  },
  {
    id: "goyard-2",
    name: "Goyard",
    slug: "goyard-2",
    description: "Goyard exclusive accessory",
    price: 50.00,
    image_url: "https://i.ibb.co/YBnqxRbH/1773330768070-ac7832d7.jpg",
    category_id: "cat-6",
    categories: { name: "Goyard", slug: "goyard" },
    is_top_pick: false,
    created_at: ""
  }
];

const fallbackProducts: Product[] = [
  { id: "prod-1", name: "Rolex Daytona 116500LN", slug: "rolex-daytona", description: "Ceramic bezel, white dial. The definitive chronograph.", price: 32500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-1", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: true, created_at: "" },
  { id: "prod-2", name: "AP Royal Oak 15500ST", slug: "ap-royal-oak", description: "Blue dial, steel bracelet. Iconic octagonal bezel.", price: 42500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-2", categories: { name: "Audemars Piguet", slug: "audemars-piguet" }, is_top_pick: true, created_at: "" },
  { id: "prod-3", name: "Cartier Love Bracelet SM", slug: "cartier-love-sm", description: "18K yellow gold. The eternal symbol of love.", price: 7500, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-3", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: true, created_at: "" },
  { id: "prod-4", name: "Louis Vuitton Neverfull MM", slug: "lv-neverfull-mm", description: "Damier Azur canvas. The iconic tote.", price: 2150, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-4", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: true, created_at: "" },
  { id: "prod-5", name: "Dior Saddle Bag", slug: "dior-saddle", description: "Blue Oblique canvas. A true collector's piece.", price: 4200, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-5", categories: { name: "Dior", slug: "dior" }, is_top_pick: true, created_at: "" },
];

function SkeletonCard() {
  return (
    <div className="min-w-[280px] md:min-w-[320px] rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden flex-shrink-0">
      <div className="aspect-[3/4] skeleton rounded-none" />
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [latestProducts, setLatestProducts] = useState<Product[]>(fallbackLatestProducts);
  const [topProducts, setTopProducts] = useState<Product[]>(fallbackProducts);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const latestScrollRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
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
        const [{ data: cats }, { data: latest }, { data: top }] = await Promise.all([
          supabase.from("categories").select("*").order("name"),
          supabase.from("products").select("*, categories!inner(name, slug)").order("created_at", { ascending: false }),
          supabase.from("products").select("*, categories!inner(name, slug)").eq("is_top_pick", true).limit(10),
        ]);
        if (cats && cats.length > 0) setCategories(cats);
        
        // Use DB latest products but override incorrect images if necessary
        if (latest && latest.length > 0) {
          const mappedLatest = latest.map((p: any) => {
            if (p.image_url === "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg" && p.name.toLowerCase().includes("louis vuitton")) {
              return { ...p, image_url: "https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg" };
            }
            return p;
          });
          
          // Re-order to match screen: Bag, Wallet, Goyard 40, Goyard 50
          const orderedLatest: Product[] = [];
          const bag = mappedLatest.find((p: any) => p.slug === "lv-bag");
          const wallet = mappedLatest.find((p: any) => p.slug === "lv-wallet-1");
          const goyard1 = mappedLatest.find((p: any) => p.slug === "goyard-1");
          const goyard2 = mappedLatest.find((p: any) => p.slug === "goyard-2");
          
          if (bag) orderedLatest.push(bag);
          if (wallet) orderedLatest.push(wallet);
          if (goyard1) orderedLatest.push(goyard1);
          if (goyard2) orderedLatest.push(goyard2);
          
          // Add remaining products
          mappedLatest.forEach((p: any) => {
            if (!orderedLatest.some(ol => ol.id === p.id)) {
              orderedLatest.push(p);
            }
          });
          
          setLatestProducts(orderedLatest);
        }
        if (top && top.length > 0) setTopProducts(top);
      } catch {}
      setLoadingLatest(false);
      setLoadingTop(false);
    }
    load();
  }, []);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: -340, behavior: "smooth" });
  };
  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <>
      <HeroSection />
      <BannerSection />

      {/* ═══ SECTION 2 — What's New ═══ */}
      <section className="py-16 bg-[var(--color-surface-default)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[var(--color-brand-400)] text-xs font-bold tracking-[0.15em] uppercase">
                Collections
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                What&apos;s New
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollLeft(latestScrollRef)}
                className="w-10 h-10 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRight(latestScrollRef)}
                className="w-10 h-10 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={latestScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {loadingLatest ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                latestProducts.slice(0, 8).map((product, idx) => (
                  <div
                    key={product.id}
                    className="group min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] flex-shrink-0 card-hover hover:border-[var(--color-border-accent)] aspect-[3/4] relative"
                  >
                    <Link href={`/collections?product=${product.slug}`} className="block w-full h-full relative overflow-hidden bg-[var(--color-surface-overlay)]">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-[var(--color-text-tertiary)]" />
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      {/* New Arrival Badge on first item */}
                      {idx === 0 && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-[#22c55e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            New Arrival
                          </span>
                        </div>
                      )}
                      
                      {/* Product Info */}
                      <div className="absolute bottom-5 left-5 right-5 z-10">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white text-base font-bold leading-tight tracking-tight">{product.name}</p>
                            <p className="text-[#ccff00] text-sm font-bold mt-1.5">₾{product.price.toFixed(2)}</p>
                          </div>
                          <span className="text-xs text-white font-bold uppercase tracking-wider underline hover:text-[#ccff00] transition-colors duration-150 shrink-0">
                            Shop Now
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => scrollLeft(latestScrollRef)}
              className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRight(latestScrollRef)}
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — Top 10 ═══ */}
      <section className="py-16 bg-[var(--color-surface-raised)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[var(--color-brand-400)] text-xs font-bold tracking-[0.15em] uppercase">
                Top Items
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                Top 10 Products Of The Month
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm mt-2 max-w-xl leading-relaxed">
                Only the best made the list — products that deliver real value.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollLeft(topScrollRef)}
                className="w-10 h-10 rounded-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRight(topScrollRef)}
                className="w-10 h-10 rounded-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={topScrollRef}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {loadingTop ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="min-w-[260px] rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] overflow-hidden flex-shrink-0 skeleton" style={{ height: 340 }} />
                ))
              ) : (
                topProducts.slice(0, 10).map((product, idx) => (
                  <div
                    key={product.id}
                    className="group min-w-[260px] rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden flex-shrink-0 flex flex-col card-hover hover:border-[var(--color-border-accent)]"
                  >
                    {/* Rank badge */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                      <span className="text-[var(--color-brand-400)] text-[10px] font-bold bg-[var(--color-brand-400)]/10 rounded-full px-2.5 py-0.5">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Product image */}
                    <Link href={`/collections?product=${product.slug}`} className="block aspect-square bg-[var(--color-surface-overlay)] flex items-center justify-center p-6 mx-4 rounded-lg">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ShoppingBag className="w-10 h-10 text-[var(--color-text-tertiary)]" />
                      )}
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[var(--color-text-tertiary)] text-[10px] uppercase tracking-wider font-medium">
                        Exclusive Product
                      </p>
                      <Link href={`/collections?product=${product.slug}`}>
                        <h3 className="text-white font-bold text-sm leading-tight mt-1 group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-auto pt-3">
                        <span className="text-[var(--color-brand-400)] font-bold text-sm">
                          ₾{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAdd(product)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-[0.93] ${
                            addedIds.has(product.id)
                              ? "bg-[var(--color-brand-400)] text-black"
                              : "bg-[var(--color-brand-400)] text-black hover:scale-110"
                          }`}
                        >
                          {addedIds.has(product.id) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => scrollLeft(topScrollRef)}
              className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRight(topScrollRef)}
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
