"use client";

import { HeroVariantProps } from "./types";

export default function HeroV2({ headline, description, ctaLabel, ctaHref, imageUrl, eyebrow }: HeroVariantProps) {
  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", padding: "80px 0" }}>
      <div>
        {eyebrow && <div style={{ textTransform: "uppercase", letterSpacing: ".08em", fontSize: ".75rem", fontWeight: 700, color: "var(--primary, #8B4513)", marginBottom: 12 }}>{eyebrow}</div>}
        <h1 style={{ fontSize: "2.6rem", marginBottom: 16, fontFamily: "var(--font, serif)", fontWeight: 700 }}>{headline}</h1>
        <p style={{ color: "var(--muted, #6b7280)", marginBottom: 24, fontSize: "1.1rem" }}>{description}</p>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl ? <img src={imageUrl} alt={headline} style={{ borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,.15)", width: "100%", display: "block" }} /> : <div aria-hidden="true" style={{ aspectRatio: "7 / 5", borderRadius: 16, background: "var(--secondary, #f5e6d3)" }} />}
    </div>
  );
}