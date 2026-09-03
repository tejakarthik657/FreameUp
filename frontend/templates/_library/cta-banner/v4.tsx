"use client";
import { CtaBannerVariantProps } from "./types";
export default function CtaBannerV4({ heading, primaryCta }: CtaBannerVariantProps) {
  return (
    <div className="container">
      <div style={{ border: "2px solid var(--dark, #111)", borderRadius: 18, textAlign: "center", padding: "60px 32px", margin: "40px auto", maxWidth: 900 }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        {primaryCta && <a href={primaryCta.href || "#"} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 999, fontWeight: 600, background: "var(--primary, #8B4513)", color: "#fff" }}>{primaryCta.label}</a>}
      </div>
    </div>
  );
}