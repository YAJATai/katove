"use client";

import { useAuth } from "@/lib/auth-context";
import { FormEvent, useState } from "react";
import { X, LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;
  if (user) { onClose(); return null; }

  const reset = () => { setEmail(""); setPassword(""); setName(""); setError(""); setShowPw(false); setSubmitting(false); setDone(false); };

  const handleClose = () => { reset(); onClose(); };

  const handleGoogle = async () => {
    setError("");
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    if (tab === "login") {
      const result = await signIn(email, password);
      if (result.error) { setError(result.error); setSubmitting(false); }
      else { handleClose(); }
    } else {
      const result = await signUp(email, password, name);
      if (result.error) { setError(result.error); setSubmitting(false); }
      else { setDone(true); setSubmitting(false); }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-[var(--color-surface-overlay)]/95 backdrop-blur-xl border border-[var(--color-border-strong)] rounded-2xl p-8 shadow-2xl animate-scale-in">
        <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-white hover:bg-white/10 transition-all duration-150">
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-6">
            <UserPlus className="w-14 h-14 text-[var(--color-brand-400)] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
              We sent a confirmation link to <strong className="text-white">{email}</strong>.
            </p>
            <button onClick={handleClose} className="w-full py-3 rounded-xl bg-[var(--color-brand-400)] text-black font-bold hover:bg-white transition-all duration-200 active:scale-[0.98]">
              Got it
            </button>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="text-center mb-6">
              {tab === "login" ? (
                <LogIn className="w-9 h-9 text-[var(--color-brand-400)] mx-auto mb-2" />
              ) : (
                <UserPlus className="w-9 h-9 text-[var(--color-brand-400)] mx-auto mb-2" />
              )}
              <h2 className="text-xl font-bold text-white">
                {tab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-[var(--color-text-tertiary)] text-sm mt-1">
                {tab === "login" ? "Sign in to your account" : "Join the private marketplace"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
                {error}
              </div>
            )}

            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--color-border-strong)] bg-white/5 hover:bg-white/10 transition-all duration-200 active:scale-[0.98] mb-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white text-sm font-medium">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[var(--color-border-strong)]" />
              <span className="text-[var(--color-text-tertiary)] text-xs">OR</span>
              <div className="flex-1 h-px bg-[var(--color-border-strong)]" />
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 mb-5">
              <button
                onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  tab === "login" ? "bg-[var(--color-brand-400)] text-black" : "text-[var(--color-text-tertiary)] hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab("register"); setError(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  tab === "register" ? "bg-[var(--color-brand-400)] text-black" : "text-[var(--color-text-tertiary)] hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
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
                className="w-full bg-[var(--color-brand-400)] text-black font-bold py-3 rounded-xl hover:bg-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting
                  ? tab === "login" ? "Signing In..." : "Creating..."
                  : tab === "login" ? "Sign In" : "Create Account"
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
