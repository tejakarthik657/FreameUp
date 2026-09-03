"use client";
import { PricingVariantProps } from "./types";
export default function PricingV2({ heading, tiers }: PricingVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 28, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {tiers.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px dashed var(--border, #e5e7eb)" }}>
          <span>{t.name}</span>
          <b style={{ color: "var(--primary, #8B4513)" }}>{t.amount}</b>
        </div>
      ))}
    </div>
  );
}