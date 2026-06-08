"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const FALLBACK_IMAGE =
  "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg";

interface Slide {
  image_url: string;
  label: string;
  title: string;
  desc: string;
  discount: string;
  cta: string;
}

const defaultSlides: Slide[] = [
  {
    image_url: FALLBACK_IMAGE,
    label: "New Arrival",
      title: "Discover Swiss Timepieces",
    desc: "Curated collection of the world's finest horology. Certified pre-owned and vintage icons.",
    discount: "-12%",
    cta: "Browse",
  },
  {
    image_url: FALLBACK_IMAGE,
    label: "Flagship",
    title: "Haute Horlogerie Selection",
    desc: "Audemars Piguet, Patek Philippe, and Vacheron Constantin — sourced with provenance.",
    discount: "-15%",
    cta: "Browse",
  },
  {
    image_url: FALLBACK_IMAGE,
    label: "Limited",
    title: "Iconic Maisons De Luxe",
    desc: "Hermès, Dior, Louis Vuitton — access to pieces that never reach the open market.",
    discount: "-20%",
    cta: "Browse",
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("products")
        .select("name, image_url, price")
        .not("image_url", "is", null)
        .limit(3);

      if (error) {
        console.log("[HeroSection] Supabase fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const heroSlides: Slide[] = data.map((p, i) => ({
          image_url: p.image_url || FALLBACK_IMAGE,
          label: i === 0 ? "New Arrival" : i === 1 ? "Flagship" : "Limited",
          title: p.name,
          desc: `Curated ${p.name} — authenticated and ready for immediate delivery.`,
          discount: i === 0 ? "-12%" : i === 1 ? "-15%" : "-20%",
          cta: "Browse",
        }));
        setSlides(heroSlides);
        console.log("[HeroSection] Fetched slide data:", heroSlides);
      }
    }
    fetchProducts();
  }, []);

  console.log("[HeroSection] Current slide:", slides[current]);

  const goTo = useCallback(
    (i: number) => {
      setCurrent(i);
    },
    [],
  );

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen pt-16 md:pt-20 overflow-hidden bg-[var(--color-surface-default)]">
      {/* Ambient glow for glass backdrop */}
      <div className="hero-ambient" />

      {/* ── Full-bleed hero card (starts below navbar) ── */}
      <div className="relative w-full h-full elevation-4 glass-hero" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}>
        {/* z-0: full-bleed image */}
        <img
          src={slides[current].image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMAGE) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        {/* z-1: warm charcoal gradient overlay — darkens left edge for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to right, rgba(13,11,9,0.92) 40%, rgba(13,11,9,0.1) 100%)",
          }}
        />

        {/* z-2: text content — vertically centered, left-aligned */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ zIndex: 2 }}
          key={current}
        >
          <div className="pl-8 md:pl-20 max-w-[600px]">
            <span
              className="inline-flex items-center gap-2 font-medium tracking-[0.15em] mb-4 md:mb-6 uppercase text-[11px]"
              style={{ color: "var(--color-brand-400)", animationDelay: "0ms" }}
            >
              <span className="pulse-dot" />
              {slides[current].label}
            </span>

            <h1
              className="text-[clamp(56px,7vw,96px)] font-bold text-[var(--color-text-primary)] leading-[1.0] mb-4 md:mb-6 tracking-tight line-clamp-2 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {slides[current].title}
            </h1>

            <p
              className="text-[var(--color-text-secondary)] text-sm md:text-base mb-6 md:mb-10 max-w-md leading-relaxed animate-fade-in-up"
              style={{ opacity: 0.6, fontWeight: 300, letterSpacing: "0.01em", animationDelay: "200ms" }}
            >
              {slides[current].desc}
            </p>

            <button
              className="btn-primary group/btn inline-flex items-center gap-2 font-bold py-3 px-8 md:py-4 md:px-10 rounded-full w-fit text-sm animate-fade-in-up"
              style={{
                backgroundColor: "#E8E0D0",
                color: "#0d0b09",
                animationDelay: "300ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(232,224,208,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#E8E0D0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {slides[current].cta}
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Discount badge */}
        <div
          className="font-bold text-sm -rotate-2 animate-float"
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            zIndex: 10,
            color: "#E8E0D0",
            padding: "6px 14px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(232,224,208,0.12)",
            border: "1px solid rgba(232,224,208,0.2)",
            borderRadius: "100px",
          }}
        >
          {slides[current].discount}
        </div>
      </div>

      {/* Arrow buttons — positioned at edges of full-width card */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Previous slide"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 text-[#E8E0D0]" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#E8E0D0]" />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={i === current ? "glass-dot-active" : "glass-dot"}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
