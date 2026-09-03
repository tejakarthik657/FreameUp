"use client";

import { HeroVariantProps } from "./types";

export default function HeroV4({ headline, description, ctaLabel, ctaHref }: HeroVariantProps) {
  return (
    <div style={{ background: "linear-gradient(135deg, var(--primary, #8B4513), var(--accent, #D4AF37))", color: "#fff", textAlign: "center", padding: "130px 0" }}>
      <div className="container">
        <h1 style={{ fontSize: "3rem", marginBottom: 18, fontFamily: "var(--font, serif)", fontWeight: 700 }}>{headline}</h1>
        <p style={{ fontSize: "1.15rem", maxWidth: 600, margin: "0 auto 28px", opacity: 0.95 }}>{description}</p>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
    </div>
  );
}