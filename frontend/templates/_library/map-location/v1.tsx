"use client";
import { MapLocationVariantProps } from "./types";
export default function MapLocationV1({ heading, address, ctaLabel, ctaHref }: MapLocationVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div style={{ background: "var(--secondary, #F5E6D3)", borderRadius: 14, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #8B4513)" }}>[ Map Embed ]</div>
      <div>
        <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <p style={{ color: "var(--muted, #6b7280)" }}>{address}</p>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
    </div>
  );
}