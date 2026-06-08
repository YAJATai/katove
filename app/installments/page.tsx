"use client";

import { ShieldCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { step: "Select Item", desc: "Choose an eligible luxury product from our collection." },
  { step: "Submit Application", desc: "Provide proof of income and identification." },
  { step: "Review Period", desc: "Our team reviews your application within 24 hours." },
  { step: "Finalize", desc: "Pay the deposit and take delivery of your piece." },
];

export default function InstallmentsPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
            Katove Finance
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mt-3">
            FLEXIBLE FINANCING
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl text-base leading-relaxed">
            Secure your luxury piece today. Pay over time with our zero-interest
            financing options up to 12 months.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 hover:border-[var(--color-border-strong)] transition-all duration-300 card-hover">
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand-400)]/10 flex items-center justify-center text-[var(--color-brand-400)] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">0% Interest Standard</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              No hidden fees, no interest jumps. What you see is exactly what you pay
              spread across your selected term.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">How It Works</h3>
            <div className="space-y-0">
              {steps.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 py-4 border-b border-[var(--color-border-default)] last:border-0 cursor-pointer group"
                  onClick={() => setStep(i)}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200 ${
                      step === i
                        ? "bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)]"
                        : "bg-white/5 text-[var(--color-text-tertiary)] group-hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h4 className={`font-bold text-sm transition-colors duration-200 ${step === i ? "text-[var(--color-brand-400)]" : "text-[var(--color-text-primary)]"}`}>
                      {item.step}
                    </h4>
                    <p className="text-[var(--color-text-tertiary)] text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Configure Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-2 uppercase tracking-wider">
                  Select Item
                </label>
                <div className="relative">
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[var(--color-surface-raised)]">Select an item...</option>
                    <option value="Rolex Daytona" className="bg-[var(--color-surface-raised)]">Rolex Daytona 116500LN</option>
                    <option value="AP Royal Oak" className="bg-[var(--color-surface-raised)]">AP Royal Oak 15500ST</option>
                    <option value="Cartier Love Bracelet" className="bg-[var(--color-surface-raised)]">Cartier Love Bracelet SM</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] rotate-90 pointer-events-none" />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!selected) return;
                  router.push(`/checkout?finance=${encodeURIComponent(selected)}`);
                }}
                className={`btn-primary w-full font-bold py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] ${
                  selected
                    ? "bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)]"
                    : "bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                }`}
              >
                Proceed to Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
