"use client";

import { FormEvent, useState } from "react";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setSent(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16 stagger-children">
          <span className="text-[var(--color-brand-400)] text-sm font-bold tracking-widest uppercase">
            Client Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mt-3">
            GET IN TOUCH
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl text-base leading-relaxed">
            Reach out to our private client team. We respond to all inquiries within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 stagger-children">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover">
            <Mail className="w-6 h-6 text-[var(--color-brand-400)] mb-4" />
            <h3 className="text-[var(--color-text-primary)] font-bold mb-1">Email</h3>
            <p className="text-[var(--color-brand-400)] text-sm font-medium">
              concierge@katove.example.com
            </p>
            <p className="text-[var(--color-text-tertiary)] text-xs mt-2">Available 24/7</p>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover">
            <MapPin className="w-6 h-6 text-[var(--color-brand-400)] mb-4" />
            <h3 className="text-[var(--color-text-primary)] font-bold mb-1">Location</h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              By appointment only. Private viewing for qualifying clients.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 flex items-center gap-3">
            Send a Message
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-400)] animate-pulse" />
          </h2>

          {sent ? (
            <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-accent)] rounded-2xl p-12 text-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-[var(--color-brand-400)] mx-auto mb-4 animate-success-pop" />
              <p className="text-[var(--color-brand-400)] font-bold text-xl">
                Message sent successfully.
              </p>
              <p className="text-[var(--color-text-secondary)] mt-2">
                Our team will respond within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", orderId: "", message: "" }); }}
                className="mt-6 text-[var(--color-text-tertiary)] text-sm hover:text-white transition-colors underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)]"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)]"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Order Reference (Optional)"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)]"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] resize-none"
                required
              />
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2 bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
