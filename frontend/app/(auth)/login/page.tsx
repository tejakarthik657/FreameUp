"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function FrameUpLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpeg"
        alt="FrameUp Logo"
        className="w-8 h-8 rounded-full object-cover shadow-xs border border-[#e5e5e5]"
      />
      <span className="font-bold text-base tracking-tight text-[#0a0a0a]">
        FrameUp
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#fffaf0] font-sans antialiased text-[#0a0a0a]">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-5/12 bg-[#faf5e8] border-r border-[#e5e5e5] p-12 flex-col justify-between shrink-0">
        <FrameUpLogo />

        <div className="space-y-4">
          <h2 className="text-4xl font-serif font-normal text-[#0a0a0a] leading-tight">
            Your business,<br />online in minutes.
          </h2>
          <p className="text-sm text-[#6a6a6a] leading-relaxed max-w-sm">
            Welcome back. Continue building your online presence — no code, no hosting required.
          </p>

          <div className="space-y-3 pt-6 border-t border-[#e5e5e5]">
            {[
              { label: "Restaurant & Cafe", tag: "MENU + MAPS", color: "bg-[#e8b94a] text-[#0a0a0a]" },
              { label: "Salon & Spa", tag: "BOOKING + TEAM", color: "bg-[#ff4d8b] text-white" },
              { label: "Local Services", tag: "LEADS + TRUST", color: "bg-[#ffb084] text-[#0a0a0a]" },
              { label: "Custom Business", tag: "FLEXIBLE", color: "bg-[#b8a4ed] text-[#0a0a0a]" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between p-3.5 bg-[#fffaf0] border border-[#e5e5e5] rounded-2xl"
              >
                <span className="text-xs font-semibold text-[#0a0a0a]">
                  {s.label}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${s.color}`}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#e5e5e5]">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6a6a]">
            Free to start · No credit card required
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-[#faf5e8] border border-[#e5e5e5] p-8 md:p-10 rounded-3xl shadow-sm">
          
          {/* Mobile Logo Header */}
          <div className="lg:hidden mb-8">
            <FrameUpLogo />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-normal text-[#0a0a0a] mb-1">
              Welcome back
            </h1>
            <p className="text-xs text-[#6a6a6a]">
              No account?{" "}
              <Link href="/signup" className="text-[#ff4d8b] font-bold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider font-mono text-[#6a6a6a]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl text-sm text-[#0a0a0a] font-medium outline-none focus:border-[#0a0a0a] transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider font-mono text-[#6a6a6a]">
                  Password
                </label>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#ff4d8b] cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl text-sm text-[#0a0a0a] font-medium outline-none focus:border-[#0a0a0a] transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6a6a6a] hover:text-[#0a0a0a] bg-transparent border-none cursor-pointer"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[#e5e5e5] accent-[#0a0a0a] cursor-pointer"
              />
              <span className="text-xs text-[#3a3a3a] font-medium">
                Keep me signed in for 7 days
              </span>
            </label>

            {/* Error banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign in</span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#e5e5e5]" />
              <span className="text-[10px] font-bold text-[#6a6a6a] uppercase font-mono">or</span>
              <div className="flex-1 h-px bg-[#e5e5e5]" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/google/login`;
              }}
              className="w-full py-3 px-4 bg-[#fffaf0] hover:bg-white border border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#0a0a0a] flex items-center justify-center gap-3 transition-all shadow-2xs"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-3.1 2.07v2.54h5.02c2.94-2.71 4.64-6.7 4.64-11.46z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-5.02-2.54c-1.39.93-3.17 1.5-4.94 1.5-3.8 0-7.02-2.57-8.17-6.02H1.36v2.64C3.35 20.08 7.39 24 12 24z"/>
                <path fill="#FBBC05" d="M3.83 14.03a7.22 7.22 0 0 1 0-4.06V7.33H1.36a11.96 11.96 0 0 0 0 9.34l2.47-2.64z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.07 15.24 0 12 0 7.39 0 3.35 3.92 1.36 7.33l2.47 2.64c1.15-3.45 4.37-6.22 8.17-6.22z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
