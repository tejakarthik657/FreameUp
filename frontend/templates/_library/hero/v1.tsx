"use client";

import { HeroVariantProps } from "./types";

export default function HeroV1({ headline, description, ctaLabel, ctaHref, imageUrl }: HeroVariantProps) {
  return (
    <div style={{ background: imageUrl ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url(${imageUrl}) center/cover` : "var(--dark, #181614)", color: "#fff", minHeight: "70vh", display: "flex", alignItems: "center", textAlign: "center" }}>
      <div className="container">
        <h1 style={{ fontSize: "3rem", marginBottom: 18, fontFamily: "var(--font, serif)", fontWeight: 700 }}>{headline}</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: 600, margin: "0 auto 28px", opacity: 0.95 }}>{description}</p>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
    </div>
  );
}