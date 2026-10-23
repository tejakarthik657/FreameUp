"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function FrameUpLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpeg"
        alt="FrameUp Logo"
        className="w-7 h-7 rounded-full object-cover"
      />
      <span className="font-semibold text-base tracking-tight text-[#1d1d1f]">
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      const msg = params.get("msg");
      if (err) {
        setError(msg ? `Google authentication failed: ${msg}` : "Google authentication was cancelled or failed. Please try again.");
      }
    }
  }, []);

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
    <div className="min-h-screen flex bg-[#f5f5f7] font-sans antialiased text-[#1d1d1f]">
      
      {/* ── LEFT SHOWCASE STAGE: Apple Editorial Canvas (Calm, Pure Parchment, Mature) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#fafafc] border-r border-[#e0e0e0] p-14 xl:p-20 flex-col justify-between relative overflow-hidden select-none">
        
        {/* Subtle Ambient Depth (Hairline circular geometry) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#e5e5ea] pointer-events-none opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#f0f0f4] pointer-events-none opacity-30" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Logo"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="font-semibold text-base tracking-tight text-[#1d1d1f]">
              FrameUp
            </span>
          </Link>

          <span className="text-[11px] font-mono text-[#86868b] bg-white border border-[#e0e0e0] px-3 py-1 rounded-full">
            Enterprise OS
          </span>
        </div>

        {/* Central Editorial Narrative (Calm, Matured, Confident) */}
        <div className="relative z-10 my-auto py-10 max-w-md space-y-8">
          
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0066cc] font-semibold block">
              Continuous Intelligence
            </span>
            
            <h2 className="text-3xl xl:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-[1.18]">
              Precision commerce for modern enterprise.
            </h2>
            
            <p className="text-sm xl:text-base text-[#86868b] font-normal leading-relaxed tracking-[-0.015em]">
              A unified operating architecture powering live local market intelligence, GST workflows, and verifiable DPDP compliance.
            </p>
          </div>

          {/* Minimalist Key Metric Pills */}
          <div className="pt-2 border-t border-[#e0e0e0] grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f] font-mono">
                100%
              </div>
              <div className="text-xs text-[#86868b] mt-0.5">
                Real Live Engine
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f] font-mono">
                ₹0
              </div>
              <div className="text-xs text-[#86868b] mt-0.5">
                Mock Data · Live APIs
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Editorial Caption */}
        <div className="relative z-10 pt-6 flex items-center justify-between text-xs text-[#86868b]">
          <span>Designed with Apple system principles</span>
          <span className="font-mono text-[11px]">v2.4.0</span>
        </div>

      </div>

      {/* ── RIGHT PANEL: Sign In Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] bg-white border border-[#e0e0e0] rounded-[24px] p-8 sm:p-10 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2 lg:hidden">
              <FrameUpLogo />
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Sign in to FrameUp
            </h1>
            <p className="text-xs text-[#86868b]">
              Manage your digital storefronts and enterprise workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#1d1d1f]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@business.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-white border border-[#e0e0e0] rounded-xl text-xs text-[#1d1d1f] outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-semibold text-[#1d1d1f]">
                  Password
                </label>
                <span className="text-[10px] text-[#0066cc] hover:underline cursor-pointer">
                  Forgot password?
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
                  className="w-full px-4 py-2.5 bg-white border border-[#e0e0e0] rounded-xl text-xs text-[#1d1d1f] outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0071e3]/20 transition-all pr-12 placeholder:text-[#86868b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#86868b] hover:text-[#1d1d1f]"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Submit Button (Apple Action Blue Pill) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-medium rounded-full transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-xs"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#e0e0e0]" />
              <span className="text-[10px] text-[#86868b] uppercase font-mono">or</span>
              <div className="flex-1 h-px bg-[#e0e0e0]" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const frontendOrigin = typeof window !== "undefined" ? window.location.origin : "";
                window.location.href = `${apiBase}/auth/google/login?frontend=${encodeURIComponent(frontendOrigin)}`;
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-xs font-medium text-[#1d1d1f] flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xs"
            >
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-3.1 2.07v2.54h5.02c2.94-2.71 4.64-6.7 4.64-11.46z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-5.02-2.54c-1.39.93-3.17 1.5-4.94 1.5-3.8 0-7.02-2.57-8.17-6.02H1.36v2.64C3.35 20.08 7.39 24 12 24z"/>
                <path fill="#FBBC05" d="M3.83 14.03a7.22 7.22 0 0 1 0-4.06V7.33H1.36a11.96 11.96 0 0 0 0 9.34l2.47-2.64z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.07 15.24 0 12 0 7.39 0 3.35 3.92 1.36 7.33l2.47 2.64c1.15-3.45 4.37-6.22 8.17-6.22z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-[#86868b] border-t border-[#e0e0e0]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#0066cc] font-medium hover:underline">
              Create yours now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
