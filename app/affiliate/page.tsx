"use client";

import { useState } from "react";
import { Copy, Link as LinkIcon, TrendingUp, DollarSign, Zap } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "High Commission",
    desc: "Earn up to 15% on every sale you refer.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Tracking",
    desc: "Monitor your clicks, conversions, and earnings.",
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    desc: "Get paid weekly with no minimum threshold.",
  },
];

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const refLink = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=YOUR_CODE`
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
            Partner Program
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mt-3">
            Affiliate Program
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl text-base leading-relaxed">
            Join the Katove affiliate network and earn commissions by referring customers
            to our exclusive marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 stagger-children">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 hover:border-[var(--color-border-strong)] card-hover group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand-400)]/10 flex items-center justify-center text-[var(--color-brand-400)] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[var(--color-text-primary)] font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon className="w-5 h-5 text-[var(--color-brand-400)]" />
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Your Referral Link</h3>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-5">
              Share this link with your audience to start earning commissions.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={refLink}
                className="flex-1 bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm font-mono transition-all"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copyLink}
                className="btn-primary flex items-center gap-2 bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold px-6 py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] text-sm whitespace-nowrap"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
