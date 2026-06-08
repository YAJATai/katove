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

  const prevIndex = (current - 1 + slides.length) % slides.length;
  const nextIndex = (current + 1) % slides.length;

  return (
    <section className="relative w-full min-h-screen pt-24 pb-8 flex flex-col justify-center bg-[var(--color-surface-default)] overflow-hidden">
      {/* Ambient glow for glass backdrop */}
      <div className="hero-ambient" />

      {/* Cards container */}
      <div className="relative w-full flex items-center justify-center gap-4 px-4 md:px-10">
        
        {/* Left slide preview */}
        <div 
          onClick={prev}
          className="hidden sm:block w-[8%] lg:w-[10%] h-[55vh] md:h-[70vh] rounded-[32px] overflow-hidden relative opacity-25 cursor-pointer hover:opacity-40 transition-all duration-500 scale-95 border border-white/5 shrink-0"
        >
          <img 
            src={slides[prevIndex].image_url} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          {/* Discount badge */}
          <div className="absolute top-4 right-4 bg-red-600/30 border border-red-500/20 text-red-400 font-bold text-[9px] px-2 py-0.5 rounded-full scale-90">
            {slides[prevIndex].discount_text}
          </div>
        </div>

        {/* Center active slide */}
        <div className="flex-1 max-w-[1200px] h-[60vh] md:h-[75vh] rounded-[40px] overflow-hidden relative border border-[var(--color-border-default)] shrink-0 elevation-4 glass-hero transition-all duration-500">
          <img
            src={slide.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
          />

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background: "linear-gradient(to right, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0.2) 100%)",
            }}
          />

          {/* Text content */}
          <div
            className="absolute inset-0 flex items-center z-2 px-8 md:px-20"
            key={current}
          >
            <div className="max-w-[550px] animate-fade-in-up">
              {/* Badge with dynamic accent color */}
              <span
                className="inline-flex items-center gap-2 font-medium tracking-[0.15em] mb-4 uppercase text-[11px]"
                style={{ color: accent }}
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

              <h1 className="text-[clamp(36px,5vw,72px)] font-bold text-white leading-[1.05] mb-4 md:mb-6 tracking-tight">
                {slide.title}
              </h1>

              <p className="text-[var(--color-text-secondary)] text-sm md:text-base mb-6 md:mb-8 max-w-md leading-relaxed opacity-80 font-light">
                {slide.subtitle}
              </p>

              {/* CTA button — dynamic accent */}
              <button
                className="group/btn inline-flex items-center gap-2 font-bold py-3 px-8 md:py-3.5 md:px-9 rounded-full text-sm text-black transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: btnColor,
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

          {/* Discount badge */}
          <div
            className="font-bold text-xs animate-float z-10"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "#FF0000",
              boxShadow: "0 8px 24px rgba(255,0,0,0.3)",
              color: "#ffffff",
            }}
          >
            {slide.discount_text}
          </div>
        </div>

        {/* Right slide preview */}
        <div 
          onClick={next}
          className="hidden sm:block w-[8%] lg:w-[10%] h-[55vh] md:h-[70vh] rounded-[32px] overflow-hidden relative opacity-25 cursor-pointer hover:opacity-40 transition-all duration-500 scale-95 border border-white/5 shrink-0"
        >
          <img 
            src={slides[nextIndex].image_url} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          {/* Discount badge */}
          <div className="absolute top-4 right-4 bg-red-600/30 border border-red-500/20 text-red-400 font-bold text-[9px] px-2 py-0.5 rounded-full scale-90">
            {slides[nextIndex].discount_text}
          </div>
        </div>

      </div>

      {/* Navigation Arrows overlaying the preview card slices */}
      <button
        onClick={prev}
        className="absolute left-6 md:left-[8%] lg:left-[11%] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 md:right-[8%] lg:right-[11%] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-30 glass-arrow"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Slide indicators at the bottom */}
      <div className="flex items-center justify-center gap-3 mt-6 z-30">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 border-none cursor-pointer p-0 ${
              i === current ? "w-10" : "w-6 bg-white/20"
            }`}
            style={
              i === current
                ? {
                    background: accent,
                    boxShadow: `0 0 12px ${accent}66`,
                  }
                : undefined
            }
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
