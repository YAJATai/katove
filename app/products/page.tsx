"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

const fallbackProducts: Product[] = [
  { id: "p1", name: "louis vuitton Wallet", slug: "lv-wallet-1", description: "Louis Vuitton luxury wallet", price: 130.00, image_url: "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p2", name: "louis vuitton Bag", slug: "lv-bag", description: "Louis Vuitton luxury bag", price: 300.00, image_url: "https://i.ibb.co/8L6zccv0/1773330962788-20fb4c93.webp", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p3", name: "louis vuitton Wallet", slug: "lv-wallet-2", description: "Louis Vuitton luxury wallet", price: 120.00, image_url: "https://i.ibb.co/VY4qr24Q/1773329940314-84fe1786.jpg", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p4", name: "louis vuitton Wallet", slug: "lv-wallet-3", description: "Louis Vuitton luxury wallet", price: 120.00, image_url: "https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p5", name: "louis vuitton Wallet", slug: "lv-wallet-4", description: "Louis Vuitton luxury wallet", price: 110.00, image_url: "https://i.ibb.co/C56tHDh4/1773329791250-94cca5df.jpg", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p6", name: "louis vuitton Wallet", slug: "lv-wallet-5", description: "Louis Vuitton luxury wallet", price: 109.98, image_url: "https://i.ibb.co/nGZW0xT/1773329739583-44d7ad12.jpg", category_id: "cat-lv", categories: { name: "Louis Vuitton", slug: "louis-vuitton" }, is_top_pick: false, created_at: "" },
  { id: "p7", name: "Goyard", slug: "goyard-1", description: "Goyard exclusive card holder", price: 40.00, image_url: "https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p8", name: "Goyard", slug: "goyard-2", description: "Goyard exclusive card holder", price: 50.00, image_url: "https://i.ibb.co/YBnqxRbH/1773330768070-ac7832d7.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p9", name: "Goyard Wallet", slug: "goyard-wallet-1", description: "Classic Goyard compact wallet", price: 90.00, image_url: "https://i.ibb.co/C5Qfr4Qt/1773330697740-7a217cc9.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p10", name: "Goyard Wallet", slug: "goyard-wallet-2", description: "Classic Goyard bi-fold wallet", price: 130.00, image_url: "https://i.ibb.co/WWMzpC3K/1773330653497-8e02497e.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p11", name: "Goyard Wallet", slug: "goyard-wallet-3", description: "Classic Goyard zip wallet", price: 120.00, image_url: "https://i.ibb.co/zWJDgzmZ/1773330623390-6091333f.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p12", name: "Goyard Wallet", slug: "goyard-wallet-4", description: "Classic Goyard long wallet", price: 140.00, image_url: "https://i.ibb.co/93kF3Bnz/1773330601858-f8d18d1d.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p13", name: "Goyard Wallet", slug: "goyard-wallet-5", description: "Classic Goyard travel organizer", price: 140.00, image_url: "https://i.ibb.co/35N4Yh6F/1773330579707-428fd7e5.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p14", name: "Goyard", slug: "goyard-3", description: "Goyard luxury pouch", price: 170.00, image_url: "https://i.ibb.co/tp0p6TwJ/1773330346720-3fe315ed.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p15", name: "Goyard Wallet", slug: "goyard-wallet-6", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/JjjDbY7Q/1773329670082-6b1ea86a.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p16", name: "Goyard Wallet", slug: "goyard-wallet-7", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/JRD03Y6G/1773329656101-7077c833.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p17", name: "Goyard Wallet", slug: "goyard-wallet-8", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/TMb6B7st/1773329638591-9ebf9500.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p18", name: "Goyard Wallet", slug: "goyard-wallet-9", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/Q7ZYyB56/1773329622157-7eaf2fc6.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p19", name: "Goyard Wallet", slug: "goyard-wallet-10", description: "Goyard wallet", price: 119.98, image_url: "https://i.ibb.co/1YTRzvLp/1773329604534-923bd881.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p20", name: "Goyard Wallet", slug: "goyard-wallet-11", description: "Goyard wallet", price: 90.00, image_url: "https://i.ibb.co/v70P6ZV/1773329582050-0271626a.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p21", name: "Goyard Wallet", slug: "goyard-wallet-12", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/2mgvfx3/1773329543922-315c75ac.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p22", name: "Goyard Wallet", slug: "goyard-wallet-13", description: "Goyard wallet", price: 129.96, image_url: "https://i.ibb.co/SDT733fr/1773329523583-6c815109.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p23", name: "Goyard Wallet", slug: "goyard-wallet-14", description: "Goyard wallet", price: 130.00, image_url: "https://i.ibb.co/dwgZcM94/1773329509861-e30fa42a.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p24", name: "Goyard Wallet", slug: "goyard-wallet-15", description: "Goyard wallet", price: 120.00, image_url: "https://i.ibb.co/NXmbTD8/1773329485522-70a4e269.jpg", category_id: "cat-goyard", categories: { name: "Goyard", slug: "goyard" }, is_top_pick: false, created_at: "" },
  { id: "p25", name: "Juste un Clou ring, small model", slug: "cartier-juste-un-clou-ring", description: "Cartier ring", price: 130.00, image_url: "https://i.ibb.co/qSp0DyW/1773327072893-6e439327.jpg", category_id: "cat-cartier", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: false, created_at: "" },
  { id: "p26", name: "Panthère de Cartier watch", slug: "cartier-panthere-watch", description: "Cartier watch", price: 230.00, image_url: "https://i.ibb.co/ycB3KTgQ/1773326935125-ba5be620.jpg", category_id: "cat-cartier", categories: { name: "Cartier", slug: "cartier" }, is_top_pick: false, created_at: "" },
  { id: "p27", name: "Rolex Day-Date", slug: "rolex-day-date-1", description: "Rolex luxury watch", price: 435.00, image_url: "https://i.ibb.co/zTb29spM/1773329275501-88dfcefe.jpg", category_id: "cat-rolex", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: false, created_at: "" },
  { id: "p28", name: "Rolex Day-Date", slug: "rolex-day-date-2", description: "Rolex luxury watch", price: 444.00, image_url: "https://i.ibb.co/jvXXcBMF/1773329250588-c2937090.jpg", category_id: "cat-rolex", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: false, created_at: "" },
  { id: "p29", name: "Rolex Day-Date", slug: "rolex-day-date-3", description: "Rolex luxury watch", price: 555.00, image_url: "https://i.ibb.co/8gJTfmHH/1773329230916-b892a1be.jpg", category_id: "cat-rolex", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: false, created_at: "" },
  { id: "p30", name: "Rolex Day-Date", slug: "rolex-day-date-4", description: "Rolex luxury watch", price: 555.00, image_url: "https://i.ibb.co/S4GTpLK2/1773329210413-463e1809.jpg", category_id: "cat-rolex", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: false, created_at: "" },
  { id: "p31", name: "Rolex Day-Date", slug: "rolex-day-date-5", description: "Rolex luxury watch", price: 500.00, image_url: "https://i.ibb.co/9kh4t0V1/1773327720819-e0e3b05b.jpg", category_id: "cat-rolex", categories: { name: "Rolex", slug: "rolex" }, is_top_pick: false, created_at: "" },
  { id: "p32", name: "Dior", slug: "dior-1", description: "Dior accessory", price: 150.00, image_url: "https://i.ibb.co/XZb7ZR0H/1773329770381-4e79bf32.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
  { id: "p33", name: "Dior wallet", slug: "dior-wallet-1", description: "Dior luxury wallet", price: 120.00, image_url: "https://i.ibb.co/WNRmtqrm/1773329447416-6d1ae41d.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
  { id: "p34", name: "Dior wallet", slug: "dior-wallet-2", description: "Dior luxury wallet", price: 119.98, image_url: "https://i.ibb.co/6R2SV2Sy/1773329424707-529b985c.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
  { id: "p35", name: "Dior wallet", slug: "dior-wallet-3", description: "Dior luxury wallet", price: 140.00, image_url: "https://i.ibb.co/cpM8jq5/1773329403101-d38f63a8.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
  { id: "p36", name: "Dior wallet", slug: "dior-wallet-4", description: "Dior luxury wallet", price: 100.00, image_url: "https://i.ibb.co/XZWL5r49/1773329383555-965e4e19.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
  { id: "p37", name: "Dior wallet", slug: "dior-wallet-5", description: "Dior luxury wallet", price: 120.00, image_url: "https://i.ibb.co/8pc8fQw/1773329350740-6e27ae39.jpg", category_id: "cat-dior", categories: { name: "Dior", slug: "dior" }, is_top_pick: false, created_at: "" },
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
