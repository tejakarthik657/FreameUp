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

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number",    pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#EF4444", "#F59E0B", "#10B981"];

  if (!password) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: "2px",
              background: i < score ? colors[score - 1] : "var(--border-strong)",
              transition: "background 0.25s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              color: c.pass ? "#10B981" : "var(--text-muted)",
              transition: "color 0.2s",
            }}
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
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service to continue."); return; }
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
            Your website,<br />live in minutes.
          </h2>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Walk through six guided steps and receive a published website, a shareable link, and a QR code.
          </p>

          {/* Step list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--border)", background: "var(--border)" }}>
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
                style={{
                  background: "var(--surface)",
                  padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                  {s.n}
                </span>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            No credit card · Cancel anytime
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div
        style={{
          flex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem", overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }} className="animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden mb-8">
            <DevFramesLogo />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-instrument-serif)",
                fontSize: "1.9rem", fontWeight: 400,
                letterSpacing: "-0.02em", color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              Create your account
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Already registered?{" "}
              <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label className="input-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                className="input-field"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
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
              <label className="input-label" htmlFor="signup-password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="signup-password"
                  className="input-field"
                  type={showPw ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
              <input
                id="signup-terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: "14px", height: "14px", accentColor: "var(--accent)", cursor: "pointer", marginTop: "2px", flexShrink: 0 }}
              />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                I agree to the{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Privacy Policy</span>
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
              id="signup-submit"
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
                  Creating account
                </span>
              ) : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
