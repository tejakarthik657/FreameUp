"use client";
import { MapLocationVariantProps } from "./types";
export default function MapLocationV2({ address, ctaLabel, ctaHref }: MapLocationVariantProps) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ background: "var(--secondary, #F5E6D3)", height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #8B4513)" }}>[ Map Embed ]</div>
      <div style={{ position: "absolute", bottom: 24, left: 24, background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 10px 30px rgba(0,0,0,.15)" }}>
        <h3 style={{ fontFamily: "var(--font, serif)" }}>{address}</h3>
        {ctaLabel && ctaHref && <a href={ctaHref} className="btn">{ctaLabel}</a>}
      </div>
    </div>
  );
}