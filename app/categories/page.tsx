"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

const fallbackCategories: Category[] = [
  { id: "1", name: "Cartier", slug: "cartier", description: "French luxury jewelry and watches since 1847.", created_at: "" },
  { id: "2", name: "Rolex", slug: "rolex", description: "Swiss prestige timepieces — icons of horology.", created_at: "" },
  { id: "3", name: "Audemars Piguet", slug: "audemars-piguet", description: "Swiss haute horlogerie since 1875.", created_at: "" },
  { id: "4", name: "Dior", slug: "dior", description: "French couture, accessories, and fragrance.", created_at: "" },
  { id: "5", name: "Goyard", slug: "goyard", description: "Parisian trunk-maker since 1792.", created_at: "" },
  { id: "6", name: "Louis Vuitton", slug: "louis-vuitton", description: "French maison since 1854.", created_at: "" },
  { id: "7", name: "Frames", slug: "frames", description: "Luxury eyewear from the world's finest houses.", created_at: "" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("categories").select("*").order("name");
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch {
        setCategories(fallbackCategories);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
            <span className="text-white">PRODUCT </span>
            <span className="text-[var(--color-brand-400)] italic">CATEGORIES</span>
          </h1>
          <div className="flex items-start gap-4 mt-6">
            <div className="w-1 h-10 bg-[var(--color-brand-400)] shrink-0 rounded-full" />
            <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
              Browse our product categories. Find exactly what you&apos;re looking for across our full collection.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] min-h-[320px] skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections?category=${cat.slug}`}
                className="group relative rounded-xl overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] p-8 min-h-[320px] flex flex-col justify-between card-hover hover:border-[var(--color-border-accent)]"
              >
                {/* Faded icon top-right */}
                <div className="absolute top-4 right-4 w-24 h-24 opacity-[0.04]">
                  <svg viewBox="0 0 100 100" fill="#CCFF00" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" />
                    <path d="M30 50 L45 65 L70 35" stroke="#CCFF00" strokeWidth="6" fill="none" />
                  </svg>
                </div>

                <div>
                  <span className="text-[var(--color-brand-400)] text-[10px] font-bold tracking-[0.15em] uppercase">
                    CATEGORY: {cat.slug?.toUpperCase() || "/"}
                  </span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold italic mt-3 leading-tight">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[var(--color-text-secondary)] text-sm mt-3 max-w-xs leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div>
                  <div className="w-full h-px bg-[var(--color-border-default)] mb-5" />
                  <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all duration-200">
                    Browse Category <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
