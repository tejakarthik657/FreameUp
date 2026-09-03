"use client";
import { CtaBannerVariantProps } from "./types";
export default function CtaBannerV2({ heading, primaryCta, secondaryCta }: CtaBannerVariantProps) {
  return (
    <div style={{ background: "linear-gradient(135deg, var(--primary, #8B4513), var(--accent, #D4AF37))", color: "#fff", textAlign: "center", padding: "80px 0" }}>
      <div className="container">
        <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {primaryCta && <a href={primaryCta.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "#fff", color: "var(--primary, #8B4513)" }}>{primaryCta.label}</a>}
          {secondaryCta && <a href={secondaryCta.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "transparent", color: "#fff", border: "2px solid #fff" }}>{secondaryCta.label}</a>}
        </div>
      </div>
    </div>
  );
}