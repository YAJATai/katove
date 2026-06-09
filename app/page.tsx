"use client";

import HeroSection from "@/components/HeroSection";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
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

const FALLBACK_IMG = "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg";

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
        if (latest && latest.length > 0) {
          const mappedLatest = latest.map((p: any) => {
            if (p.image_url === FALLBACK_IMG && p.name.toLowerCase().includes("louis vuitton")) {
              return { ...p, image_url: "https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg" };
            }
            return p;
          });
          const orderedLatest: Product[] = [];
          const bag = mappedLatest.find((p: any) => p.slug === "lv-bag");
          const wallet = mappedLatest.find((p: any) => p.slug === "lv-wallet-1");
          const goyard1 = mappedLatest.find((p: any) => p.slug === "goyard-1");
          const goyard2 = mappedLatest.find((p: any) => p.slug === "goyard-2");
          if (bag) orderedLatest.push(bag);
          if (wallet) orderedLatest.push(wallet);
          if (goyard1) orderedLatest.push(goyard1);
          if (goyard2) orderedLatest.push(goyard2);
          mappedLatest.forEach((p: any) => { if (!orderedLatest.some(ol => ol.id === p.id)) orderedLatest.push(p); });
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
              <button onClick={() => scrollLeft(latestScrollRef)} className="w-10 h-10 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollRight(latestScrollRef)} className="w-10 h-10 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div ref={latestScrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
              {loadingLatest ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                latestProducts.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className="group relative min-w-[280px] md:min-w-[320px] rounded-xl overflow-hidden bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] flex-shrink-0 card-hover hover:border-[var(--color-border-accent)] flex flex-col"
                  >
                    {/* Image area */}
                    <Link href={`/collections?product=${product.slug}`} className="block aspect-[3/4] relative overflow-hidden bg-[var(--color-surface-overlay)]">
                      <img
                        src={product.image_url || FALLBACK_IMG}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    </Link>

                    {/* Info overlay at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pointer-events-none">
                      <Link href={`/collections?product=${product.slug}`} className="pointer-events-auto hover:text-[var(--color-brand-400)] transition-colors inline-block">
                        <h3 className="text-white font-bold text-lg leading-tight">{product.name}</h3>
                      </Link>
                      <p className="text-[var(--color-text-tertiary)] text-xs mt-0.5 pointer-events-auto">
                        {product.categories?.name || "Product"}
                      </p>
                      <div className="flex items-center justify-between mt-2 pointer-events-auto">
                        <span className="text-[var(--color-brand-400)] font-bold text-base">
                          ₾{product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* ADD button — slides up on hover */}
                    <div className="absolute inset-0 z-20 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                        className={`pointer-events-auto w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] ${
                          addedIds.has(product.id)
                            ? "bg-[var(--color-brand-400)] text-black"
                            : "bg-white/90 backdrop-blur-sm text-black hover:bg-[var(--color-brand-400)]"
                        }`}
                      >
                        {addedIds.has(product.id) ? (
                          <span className="flex items-center justify-center gap-1.5"><Check className="w-3 h-3" /> Added</span>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => scrollLeft(latestScrollRef)} className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollRight(latestScrollRef)} className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2.5 — Promo Banner ═══ */}
      <section className="py-8 bg-[var(--color-surface-default)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative rounded-[40px] overflow-hidden bg-black aspect-[4/3] md:aspect-[21/9] flex items-center justify-center text-center px-4 border border-[var(--color-border-default)]">
            <img 
              src="/katove_banner.png" 
              alt="Exclusive Technology Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-5 md:space-y-6 px-4">
              <span className="text-[var(--color-text-tertiary)] text-xs md:text-sm font-medium tracking-widest uppercase">
                Scale without limits.
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-400)]/30 bg-[var(--color-brand-400)]/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-400)] shadow-[0_0_8px_var(--color-brand-400)]" />
                <span className="text-[var(--color-brand-400)] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Exclusive Technology
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-black text-white leading-[1.05] tracking-tight">
                Engineered For The Modern Gaming World With Unmatched Power
              </h2>
              <Link href="/products" className="mt-8 px-8 py-4 rounded-full bg-[var(--color-brand-400)] text-black font-bold text-sm md:text-base hover:scale-105 hover:shadow-[0_0_30px_var(--color-brand-400)] transition-all duration-300 active:scale-95">
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2.6 — Shop Across Categories ═══ */}
      <section className="py-14 sm:py-20 bg-[var(--color-surface-default)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-12">
            <span className="text-[var(--color-brand-400)] text-xs sm:text-sm font-bold tracking-widest uppercase">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Shop Across Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
            {/* Cartier Card */}
            <Link
              href="/collections?category=cartier"
              className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/5 group bg-[#111] h-[430px] sm:h-[500px] md:h-auto cursor-pointer block transition-all duration-300 hover:border-[var(--color-brand-400)]/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.05)]"
            >
              <div className="absolute inset-x-0 top-0 p-6 sm:p-10 z-10 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Cartier</h3>
                <p className="text-gray-400 mb-6 font-medium text-sm sm:text-base">Explore Cartier</p>
                <div className="inline-block px-6 py-2 rounded-full border border-white/20 text-white font-bold text-sm group-hover:bg-[var(--color-brand-400)] group-hover:text-black group-hover:border-[var(--color-brand-400)] transition-all duration-300">
                  Shop Now
                </div>
              </div>
              <div className="absolute inset-0 pt-28 sm:pt-32 flex items-center justify-center">
                <img
                  alt="Cartier"
                  className="object-contain w-[86%] h-[86%] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 ease-out"
                  src="/cable_car_watches.png"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
            </Link>

            {/* Right Column Container */}
            <div className="flex flex-col gap-6 md:grid md:grid-rows-2">
              {/* Row 1: Rolex and Audemars Piguet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto md:h-auto">
                {/* Rolex Card */}
                <Link
                  href="/collections?category=rolex"
                  className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/5 group bg-[#111] p-5 sm:p-6 flex flex-col items-center text-center cursor-pointer min-h-[260px] transition-all duration-300 hover:border-[var(--color-brand-400)]/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.05)]"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Rolex</h3>
                  <p className="text-xs text-gray-500 mb-4">Browse Rolex</p>
                  <div className="px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold group-hover:bg-[var(--color-brand-400)] group-hover:text-black group-hover:border-[var(--color-brand-400)] transition-all duration-300 mb-4">
                    Shop Now
                  </div>
                  <div className="flex-1 w-full relative min-h-[120px]">
                    <img
                      alt="Rolex"
                      className="object-contain p-2 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-700 ease-out absolute inset-0 w-full h-full"
                      src="/cable_car_watches.png"
                    />
                  </div>
                </Link>

                {/* Audemars Piguet Card */}
                <Link
                  href="/collections?category=audemars-piguet"
                  className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/5 group bg-[#111] p-5 sm:p-6 flex flex-col items-center text-center cursor-pointer min-h-[260px] transition-all duration-300 hover:border-[var(--color-brand-400)]/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.05)]"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Audemars Piguet</h3>
                  <p className="text-xs text-gray-500 mb-4">Browse Audemars Piguet</p>
                  <div className="px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold group-hover:bg-[var(--color-brand-400)] group-hover:text-black group-hover:border-[var(--color-brand-400)] transition-all duration-300 mb-4">
                    Shop Now
                  </div>
                  <div className="flex-1 w-full relative min-h-[120px]">
                    <img
                      alt="Audemars Piguet"
                      className="object-contain p-2 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-700 ease-out absolute inset-0 w-full h-full"
                      src="/cable_car_watches.png"
                    />
                  </div>
                </Link>
              </div>

              {/* Row 2: Dior Card */}
              <Link
                href="/collections?category=dior"
                className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/5 group bg-[#111] flex items-center justify-between p-5 sm:p-10 h-[260px] sm:h-[280px] md:h-auto cursor-pointer transition-all duration-300 hover:border-[var(--color-brand-400)]/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.05)]"
              >
                <div className="z-10 relative max-w-[52%] sm:max-w-[50%]">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Dior</h3>
                  <p className="text-gray-400 mb-6 text-xs sm:text-sm">Explore Dior</p>
                  <div className="inline-block px-6 py-2 rounded-full border border-white/20 text-white font-bold text-sm group-hover:bg-[var(--color-brand-400)] group-hover:text-black group-hover:border-[var(--color-brand-400)] transition-all duration-300">
                    Shop Now
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-[60%] h-[90%]">
                  <img
                    alt="Dior"
                    className="object-contain w-full h-full group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-700 ease-out absolute inset-0"
                    src="/cable_car_watches.png"
                  />
                </div>
              </Link>
            </div>
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
              <button onClick={() => scrollLeft(topScrollRef)} className="w-10 h-10 rounded-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollRight(topScrollRef)} className="w-10 h-10 rounded-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150 active:scale-[0.97]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div ref={topScrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
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

                    <Link href={`/collections?product=${product.slug}`} className="block aspect-square bg-[var(--color-surface-overlay)] flex items-center justify-center p-6 mx-4 rounded-lg">
                      <img
                        src={product.image_url || FALLBACK_IMG}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG; }}
                      />
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[var(--color-text-tertiary)] text-[10px] uppercase tracking-wider font-medium">
                        {product.categories?.name || "Exclusive Product"}
                      </p>
                      <Link href={`/collections?product=${product.slug}`}>
                        <h3 className="text-white font-bold text-sm leading-tight mt-0.5 group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-auto pt-3">
                        <span className="text-[var(--color-brand-400)] font-bold text-sm">
                          ₾{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                          className={`pointer-events-auto text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 transition-all duration-200 active:scale-[0.97] ${
                            addedIds.has(product.id)
                              ? "bg-[var(--color-brand-400)] text-black"
                              : "bg-white text-black hover:bg-[var(--color-brand-400)]"
                          }`}
                        >
                          {addedIds.has(product.id) ? (
                            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Added</span>
                          ) : (
                            "ADD +"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => scrollLeft(topScrollRef)} className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollRight(topScrollRef)} className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-[var(--color-brand-400)] hover:text-black transition-all duration-150">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
