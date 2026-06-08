"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push("/account");
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    if (result.error) setError(result.error);
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover space-y-5 stagger-children">
          <div className="text-center mb-2">
            <LogIn className="w-10 h-10 text-[var(--color-brand-400)] mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Welcome Back</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
              <Mail className="w-3 h-3 inline mr-1" /> Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
              <Lock className="w-3 h-3 inline mr-1" /> Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 pr-11 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-tertiary)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[var(--color-brand-400)] hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
