"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function DevFramesLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" fill="#6366F1" />
        <path d="M7 9h7c2.761 0 5 2.239 5 5s-2.239 5-5 5H7V9z" stroke="white" strokeWidth="1.75" strokeLinejoin="round" fill="none"/>
        <path d="M16 9h5M16 14h5M16 19h5" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)" }}>
        DevFrames
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
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
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--background)" }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "42%",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "3rem",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <DevFramesLogo />

        <div>
          <h2
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: "2.2rem", fontWeight: 400,
              lineHeight: 1.05, letterSpacing: "-0.02em",
              color: "var(--text-primary)", marginBottom: "1rem",
            }}
          >
            Your business,<br />online in minutes.
          </h2>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Welcome back. Continue building your online presence — no code, no hosting required.
          </p>

          {/* Sector list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Restaurant", tag: "MENU + MAPS",   color: "var(--sector-restaurant)" },
              { label: "Salon & Spa", tag: "BOOKING + TEAM", color: "var(--sector-salon)" },
              { label: "Local Services", tag: "LEADS + TRUST", color: "var(--sector-local)" },
              { label: "Others",      tag: "FLEXIBLE",     color: "var(--sector-others)" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-high)",
                }}
              >
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.84rem", color: "var(--text-primary)", fontWeight: 500 }}>
                  {s.label}
                </span>
                <span
                  className="badge"
                  style={{ color: s.color, background: `${s.color}12`, borderColor: `${s.color}30` }}
                >
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            Free to start · No credit card required
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div
        style={{
          flex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }} className="animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden mb-8">
            <DevFramesLogo />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-instrument-serif)",
                fontSize: "1.9rem", fontWeight: 400,
                letterSpacing: "-0.02em", color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No account?{" "}
              <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label className="input-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="input-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent)", cursor: "pointer" }}>
                  Forgot?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  className="input-field"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "50px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                id="login-remember"
                type="checkbox"
                style={{ width: "14px", height: "14px", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Keep me signed in for 7 days
              </span>
            </label>

            {error && (
              <div
                style={{
                  background: "#FEF2F2", border: "1px solid #FCA5A5",
                  borderRadius: "6px", padding: "10px 14px",
                  fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "#DC2626",
                }}
              >
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              className="btn-base btn-primary"
              disabled={loading}
              style={{ padding: "12px", fontSize: "0.72rem", width: "100%" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "13px", height: "13px",
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
                    borderRadius: "50%", display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Signing in
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
