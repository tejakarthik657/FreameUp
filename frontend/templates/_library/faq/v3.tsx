"use client";
import { FaqVariantProps } from "./types";
export default function FaqV3({ heading, items }: FaqVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", maxWidth: 600, margin: "0 auto", gap: 16 }}>
        {items.map((it, i) => (
          <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff" }}>
            <h3 style={{ fontSize: "1rem", fontFamily: "var(--font, serif)" }}>{it.question}</h3>
            <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>{it.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}