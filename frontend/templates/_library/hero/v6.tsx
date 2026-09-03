"use client";

import { HeroVariantProps } from "./types";

export default function HeroV6({ headline, description, ctaLabel, ctaHref, imageUrl }: HeroVariantProps) {
  return (
    <div style={{ background: imageUrl ? `url(${imageUrl}) center/cover` : "var(--secondary, #f5e6d3)", minHeight: "60vh", position: "relative", display: "flex", alignItems: "flex-end", paddingBottom: 60 }}>
      <div className="container">
        <div style={{ background: "#fff", borderRadius: 18, padding: "36px 40px", boxShadow: "0 24px 50px rgba(0,0,0,.2)", maxWidth: 480 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 12, fontFamily: "var(--font, serif)", fontWeight: 700 }}>{headline}</h1>
          <p style={{ color: "var(--muted, #6b7280)", marginBottom: 20 }}>{description}</p>
          {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
        </div>
      </div>
    </div>
  );
}