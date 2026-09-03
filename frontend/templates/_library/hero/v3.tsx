"use client";

import { HeroVariantProps } from "./types";

export default function HeroV3({ headline, description, ctaLabel, ctaHref }: HeroVariantProps) {
  return (
    <div className="container" style={{ textAlign: "center", padding: "120px 0" }}>
      <h1 style={{ fontSize: "2.8rem", marginBottom: 20, fontFamily: "var(--font, serif)", fontWeight: 700, color: "var(--primary, #8B4513)" }}>{headline}</h1>
      <p style={{ color: "var(--muted, #6b7280)", maxWidth: 560, margin: "0 auto 30px", fontSize: "1.1rem" }}>{description}</p>
      {ctaLabel && ctaHref && <a href={ctaHref} className="btn btn-outline">{ctaLabel}</a>}
    </div>
  );
}