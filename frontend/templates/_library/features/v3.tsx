"use client";
import { FeaturesVariantProps } from "./types";
export default function FeaturesV3({ features }: FeaturesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      {features.map((f, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", padding: "36px 0", direction: i % 2 === 1 ? "rtl" : "ltr" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {f.imageUrl ? <img src={f.imageUrl} alt={f.title} style={{ width: "100%", display: "block", borderRadius: 12, direction: "ltr" }} /> : <div aria-hidden="true" style={{ aspectRatio: "10 / 7", borderRadius: 12, background: "var(--secondary, #f5e6d3)", direction: "ltr" }} />}
          <div style={{ direction: "ltr" }}>
            <h3 style={{ fontSize: "1.5rem", color: "var(--primary, #8B4513)", marginBottom: 10, fontFamily: "var(--font, serif)" }}>{f.title}</h3>
            <p style={{ color: "var(--muted, #6b7280)" }}>{f.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}