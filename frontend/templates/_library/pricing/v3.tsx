"use client";
import { PricingVariantProps } from "./types";
export default function PricingV3({ heading, tiers }: PricingVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 36, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", alignItems: "center", gap: 24 }}>
        {tiers.map((t, i) => (
          <div key={i} style={t.featured ? { background: "var(--primary, #8B4513)", color: "#fff", transform: "scale(1.08)", textAlign: "center", borderRadius: 14, padding: 28 } : { textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{t.name}</h3>
            <p style={t.featured ? { fontSize: "1.6rem", fontFamily: "var(--font, serif)" } : undefined}>{t.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}