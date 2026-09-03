"use client";
import { PricingVariantProps } from "./types";
export default function PricingV1({ heading, tiers }: PricingVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 36, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)", textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{t.name}</h3>
            <div style={{ fontSize: "2rem", fontFamily: "var(--font, serif)", color: "var(--primary, #8B4513)", margin: "12px 0" }}>{t.amount}</div>
            {t.duration && <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>{t.duration}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}