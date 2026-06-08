"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface HeroSlide {
  id: string;
  badge_label: string;
  title: string;
  subtitle: string;
  accent_color: string;
  button_color: string;
  image_url: string;
  discount_text: string;
}

const FALLBACK_IMAGE =
  "https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg";

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    badge_label: "IMMERSIVE AUDIO",
    title: "Hear Every Footstep Clearly",
    subtitle:
      "Precision spatial audio that puts you right in the center of the action.",
    accent_color: "#FF2ECC",
    button_color: "#FF2ECC",
    image_url: FALLBACK_IMAGE,
    discount_text: "-10%",
  },
  {
    id: "2",
    badge_label: "ERGONOMIC DESIGN",
    title: "Level Up Your Comfort Zone",
    subtitle:
      "Experience the ultimate in gaming comfort with our new futuristic ergonomic chairs.",
    accent_color: "#00E5FF",
    button_color: "#00E5FF",
    image_url: "https://i.ibb.co/jvXXcBMF/1773329250588-c2937090.jpg",
    discount_text: "-15%",
  },
  {
    id: "3",
    badge_label: "NEW ARRIVAL",
    title: "Discover Swiss Timepieces",
    subtitle:
      "Curated collection of the world's finest horology. Certified pre-owned and vintage icons.",
    accent_color: "#CCFF00",
    button_color: "#CCFF00",
    image_url: "https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg",
    discount_text: "-12%",
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const accent = slide?.accent_color || "#CCFF00";
  const btnColor = slide?.button_color || accent;

  useEffect(() => {
    async function fetchSlides() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.log("[HeroSection] fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setSlides(data);
      }
    }
    fetchSlides();
  }, []);

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen pt-16 md:pt-20 overflow-hidden bg-[var(--color-surface-default)]">
      {/* Ambient glow for glass backdrop */}
      <div className="hero-ambient" />

      {/* ── Full-bleed hero card ── */}
      <div
        className="relative w-full h-full elevation-4 glass-hero"
        style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}
      >
        {/* z-0: full-bleed image */}
        <img
          src={slide.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMAGE) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        {/* z-1: dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to right, rgba(13,11,9,0.92) 40%, rgba(13,11,9,0.1) 100%)",
          }}
        />

        {/* z-2: text content */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ zIndex: 2 }}
          key={current}
        >
          <div className="pl-8 md:pl-20 max-w-[600px]">
            {/* Badge with dynamic accent color */}
            <span
              className="inline-flex items-center gap-2 font-medium tracking-[0.15em] mb-4 md:mb-6 uppercase text-[11px]"
              style={{ color: accent, animationDelay: "0ms" }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: accent,
                  boxShadow: `0 0 6px ${accent}99`,
                }}
              />
              {slide.badge_label}
            </span>

            <h1
              className="text-[clamp(56px,7vw,96px)] font-bold text-[var(--color-text-primary)] leading-[1.0] mb-4 md:mb-6 tracking-tight line-clamp-2 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {slide.title}
            </h1>

            <p
              className="text-[var(--color-text-secondary)] text-sm md:text-base mb-6 md:mb-10 max-w-md leading-relaxed animate-fade-in-up"
              style={{
                opacity: 0.6,
                fontWeight: 300,
                letterSpacing: "0.01em",
                animationDelay: "200ms",
              }}
            >
              {slide.subtitle}
            </p>

            {/* CTA button — dynamic accent */}
            <button
              className="group/btn inline-flex items-center gap-2 font-bold py-3 px-8 md:py-4 md:px-10 rounded-full w-fit text-sm animate-fade-in-up text-black"
              style={{
                backgroundColor: btnColor,
                animationDelay: "300ms",
                boxShadow: `0 0 20px ${btnColor}4D`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${btnColor}CC`;
                e.currentTarget.style.boxShadow = `0 0 28px ${btnColor}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = btnColor;
                e.currentTarget.style.boxShadow = `0 0 20px ${btnColor}4D`;
              }}
            >
              Shop Now
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Discount badge — coral/red per reference */}
        <div
          className="font-bold text-sm -rotate-2 animate-float"
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            zIndex: 10,
            padding: "6px 14px",
            borderRadius: "100px",
            background: "rgba(255, 70, 70, 0.18)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 70, 70, 0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            color: "#FF6B6B",
          }}
        >
          {slide.discount_text}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Previous slide"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </button>

      {/* Progress dots — active dot uses accent color */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-30">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={i === current ? "glass-dot-active" : "glass-dot"}
            aria-label={`Go to slide ${i + 1}`}
            style={
              i === current
                ? {
                    background: accent,
                    boxShadow: `0 0 12px ${accent}66`,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
