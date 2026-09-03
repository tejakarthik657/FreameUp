"use client";
import { FaqVariantProps } from "./types";
export default function FaqV2({ heading, items }: FaqVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {items.map((it, i) => (
          <div key={i}>
            <h3 style={{ fontSize: "1rem", fontFamily: "var(--font, serif)" }}>{it.question}</h3>
            <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>{it.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}