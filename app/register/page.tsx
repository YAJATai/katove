"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push("/account");
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signUp(email, password, name);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      setDone(true);
      setSubmitting(false);
    }
  };

  if (loading) return null;

  if (done) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-accent)] rounded-2xl p-12 animate-scale-in">
            <UserPlus className="w-16 h-16 text-[var(--color-brand-400)] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Check Your Email</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We sent a confirmation link to <strong className="text-[var(--color-text-primary)]">{email}</strong>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="btn-primary inline-flex items-center gap-2 bg-[var(--color-brand-400)] text-[var(--color-text-on-primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98]"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[var(--color-surface-default)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[var(--color-surface-overlay)] to-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-2xl p-8 card-hover space-y-5 stagger-children">
          <div className="text-center mb-2">
            <UserPlus className="w-10 h-10 text-[var(--color-brand-400)] mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create Account</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Join the private marketplace</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-[var(--color-text-secondary)] text-xs font-medium block mb-1.5">
              <User className="w-3 h-3 inline mr-1" /> Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm transition-all placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-400)] focus:ring-1 focus:ring-[var(--color-brand-400)]/20 outline-none"
              required
            />
          </div>

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
                minLength={6}
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
            {submitting ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-tertiary)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-brand-400)] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
