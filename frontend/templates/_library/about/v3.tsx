"use client";
import { AboutVariantProps } from "./types";
export default function AboutV3({ title, description, stats }: AboutVariantProps) {
  const items = stats || [];
  return (
    <div className="container" style={{ padding: "80px 0", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48 }}>
      <div>
        <h2 style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{title}</h2>
        <p style={{ color: "var(--muted, #6b7280)" }}>{description}</p>
      </div>
      <div style={{ display: "grid", gap: 20 }}>
        {items.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <b style={{ fontSize: "1.8rem", color: "var(--primary, #8B4513)", display: "block", fontFamily: "var(--font, serif)" }}>{s.value}</b>
            <span style={{ fontSize: ".85rem", color: "var(--muted, #6b7280)" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}