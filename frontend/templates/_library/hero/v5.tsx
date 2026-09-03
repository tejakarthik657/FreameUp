"use client";

import { HeroVariantProps } from "./types";

export default function HeroV5({ headline, description, ctaLabel, ctaHref, eyebrow }: HeroVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", minHeight: "75vh", display: "flex", alignItems: "center" }}>
      <div className="container">
        {eyebrow && <div style={{ textTransform: "uppercase", letterSpacing: ".08em", fontSize: ".75rem", fontWeight: 700, color: "var(--accent, #D4AF37)", marginBottom: 12 }}>{eyebrow}</div>}
        <h1 style={{ fontSize: "3.2rem", marginBottom: 20, fontFamily: "var(--font, serif)", fontWeight: 700, letterSpacing: "-0.02em" }}>{headline}</h1>
        <p style={{ fontSize: "1.15rem", color: "#bbb", maxWidth: 520, marginBottom: 30 }}>{description}</p>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
    </div>
  );
}