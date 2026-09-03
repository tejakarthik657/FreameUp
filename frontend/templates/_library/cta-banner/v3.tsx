"use client";
import { CtaBannerVariantProps } from "./types";
export default function CtaBannerV3({ heading, primaryCta }: CtaBannerVariantProps) {
  return (
    <div className="container" style={{ padding: "60px 0", background: "var(--secondary, #F5E6D3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <h2 style={{ fontSize: "1.6rem", color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {primaryCta && <a href={primaryCta.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff" }}>{primaryCta.label}</a>}
    </div>
  );
}