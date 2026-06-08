"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

const fallbackCategories: Category[] = [
  { id: "1", name: "Cartier", slug: "cartier", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "2", name: "Rolex", slug: "rolex", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "3", name: "Audemars Piguet", slug: "audemars-piguet", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "4", name: "Dior", slug: "dior", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "5", name: "Goyard", slug: "goyard", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "6", name: "Louis Vuitton", slug: "louis-vuitton", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
  { id: "7", name: "Frames", slug: "frames", description: "Explore our carefully sourced selection.", created_at: new Date().toISOString() },
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
        <div className="mb-12 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
            PRODUCT CATEGORIES
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mt-2">
            Browse Our Collection
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl text-sm leading-relaxed">
            Browse our product categories. Find exactly what you&apos;re looking for across our full collection.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-default)] min-h-[220px] skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger-children">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections?category=${cat.slug}`}
                className="card-hover group relative rounded-2xl overflow-hidden border border-[var(--color-border-default)] bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] hover:border-[var(--color-border-accent)] transition-all duration-300 p-8 min-h-[220px] flex flex-col justify-end"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-400)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:blur-[60px] transition-all duration-500" />
                <h3 className="text-[var(--color-text-primary)] font-bold text-xl group-hover:text-[var(--color-brand-400)] transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-[var(--color-text-tertiary)] text-sm mt-1.5">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-[var(--color-brand-400)] text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0">
                  Browse Category <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
