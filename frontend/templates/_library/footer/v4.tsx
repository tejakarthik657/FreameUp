"use client";
import { FooterVariantProps } from "./types";
export default function FooterV4({ copyright, tagline }: FooterVariantProps) {
  return (
    <div style={{ background: "var(--secondary, #F5E6D3)", padding: "56px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h4 style={{ marginBottom: 6, fontFamily: "var(--font, serif)" }}>{tagline}</h4>
            <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>Get updates on new dishes and offers.</p>
          </div>
          <div>
            <input type="email" placeholder="Your email" style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", width: 240 }} />
            <button style={{ marginLeft: 8, display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff", border: "none", cursor: "pointer" }}>Subscribe</button>
          </div>
        </div>
        <div style={{ fontSize: ".85rem", color: "var(--muted, #6b7280)", borderTop: "1px solid rgba(0,0,0,.08)", paddingTop: 20 }}>{copyright}</div>
      </div>
    </div>
  );
}