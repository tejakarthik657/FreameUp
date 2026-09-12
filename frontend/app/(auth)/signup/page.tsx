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

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#ef4444", "#f59e0b", "#22c55e"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < score ? colors[score - 1] : "#e5e5e5",
            }}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
              c.pass ? "text-[#22c55e]" : "text-[#6a6a6a]"
            }`}
          >
            {c.pass ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.signup(email, password);
      router.push("/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
            Your website,<br />live in minutes.
          </h2>
          <p className="text-sm text-[#6a6a6a] leading-relaxed max-w-sm">
            Walk through six guided steps and receive a published website, a shareable link, and a QR code.
          </p>

          <div className="space-y-2 pt-6 border-t border-[#e5e5e5]">
            {[
              { n: "01", label: "Select your business sector" },
              { n: "02", label: "Set your brand name and logo" },
              { n: "03", label: "Add contact and location details" },
              { n: "04", label: "Configure operating hours" },
              { n: "05", label: "Add menu items or services" },
              { n: "06", label: "Upload photos and go live" },
            ].map((s) => (
              <div
                key={s.n}
                className="bg-[#fffaf0] border border-[#e5e5e5] p-3 rounded-2xl flex items-center gap-3"
              >
                <span className="font-mono text-xs font-bold text-[#ff4d8b]">
                  {s.n}
                </span>
                <span className="text-xs font-semibold text-[#0a0a0a]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#e5e5e5]">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6a6a]">
            No credit card · Cancel anytime
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-[#faf5e8] border border-[#e5e5e5] p-8 md:p-10 rounded-3xl shadow-sm">
          
          {/* Mobile Logo Header */}
          <div className="lg:hidden mb-8">
            <FrameUpLogo />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-normal text-[#0a0a0a] mb-1">
              Create your account
            </h1>
            <p className="text-xs text-[#6a6a6a]">
              Already registered?{" "}
              <Link href="/login" className="text-[#ff4d8b] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider font-mono text-[#6a6a6a]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-3 bg-[#fffaf0] border border-[#e5e5e5] rounded-xl text-sm text-[#0a0a0a] font-medium outline-none focus:border-[#0a0a0a] transition-all"
              />
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider font-mono text-[#6a6a6a]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-[#e5e5e5] accent-[#0a0a0a] cursor-pointer mt-0.5"
              />
              <span className="text-xs text-[#3a3a3a] font-medium leading-relaxed">
                I agree to the{" "}
                <span className="text-[#ff4d8b] font-bold">Terms of Service</span> and{" "}
                <span className="text-[#ff4d8b] font-bold">Privacy Policy</span>
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
                <span>Creating account...</span>
              ) : (
                <span>Create account</span>
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
