"use client";

import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Headphones, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";

function FeatureCard({ icon: Icon, title, desc }: { icon: typeof Zap; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-[var(--color-border-default)] hover:bg-white/[0.07] transition-all duration-200">
      <div className="w-12 h-12 rounded-full bg-[var(--color-brand-400)]/10 flex items-center justify-center text-[var(--color-brand-400)] shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{title}</h4>
        <p className="text-[var(--color-text-tertiary)] text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("subscriptions").insert({ email }).select().single();
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      if (err?.code === "23505") {
        setSubscribed(true);
        setEmail("");
      }
    }
    setSubscribing(false);
  };

  return (
    <footer className="w-full bg-[var(--color-surface-raised)] border-t border-[var(--color-border-weak)] pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <FeatureCard icon={Zap} title="24/7 Instant Delivery" desc="Delivered to you anytime, anywhere" />
          <FeatureCard icon={ShieldCheck} title="1 Year Warranty" desc="Comprehensive coverage included" />
          <FeatureCard icon={Headphones} title="24/7 Support" desc="Expert assistance anytime" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10 pt-10 border-t border-[var(--color-border-weak)]">
          {/* Logo + tagline */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-wider italic text-white hover:text-[var(--color-brand-400)] transition-colors duration-200 uppercase"
            >
              KATOVE
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-sm">
              Georgia&apos;s black market for exclusive products.
            </p>
          </div>

          {/* Subscribe */}
          <div className="lg:col-span-7">
            <h3 className="text-white font-bold mb-5 tracking-wide text-sm uppercase">
              STAY UPDATED
            </h3>
            <div className="bg-white/[0.03] backdrop-blur-sm p-6 rounded-2xl border border-[var(--color-border-default)]">
              <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed">
                Subscribe for exclusive deals, new product drops, and updates.
              </p>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] pr-12 focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                    disabled={subscribed}
                  />
                  <button
                    type="submit"
                    disabled={subscribing || subscribed}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-brand-400)] rounded-lg text-black hover:bg-white transition-colors duration-200 disabled:opacity-50"
                  >
                    {subscribed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {subscribed && (
                  <p className="text-[var(--color-brand-400)] text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Subscribed successfully!
                  </p>
                )}
                <p className="text-[10px] text-[var(--color-text-tertiary)]">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--color-border-weak)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--color-text-tertiary)] text-xs">
            &copy; 2026 Katove. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/affiliate"
              className="text-xs text-[var(--color-brand-400)] hover:text-white transition-colors duration-200 font-bold uppercase tracking-widest"
            >
              Partner Program
            </Link>
            <Link href="/" className="text-xs text-[var(--color-text-tertiary)] hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link href="/" className="text-xs text-[var(--color-text-tertiary)] hover:text-white transition-colors duration-200">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
