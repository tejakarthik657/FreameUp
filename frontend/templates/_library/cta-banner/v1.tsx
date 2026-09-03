"use client";
import { CtaBannerVariantProps } from "./types";
export default function CtaBannerV1({ heading, primaryCta }: CtaBannerVariantProps) {
  return (
    <div style={{ background: "var(--primary, #8B4513)", color: "#fff", textAlign: "center", padding: "70px 0" }}>
      <div className="container">
        <h2 style={{ color: "#fff", fontSize: "1.8rem", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        {primaryCta && <a href={primaryCta.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "#fff", color: "var(--primary, #8B4513)" }}>{primaryCta.label}</a>}
      </div>
    </div>
  );
}