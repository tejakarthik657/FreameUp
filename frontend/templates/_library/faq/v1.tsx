"use client";
import { FaqVariantProps } from "./types";
export default function FaqV1({ heading, items }: FaqVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {items.map((it, i) => (
        <details key={i} style={{ borderBottom: "1px solid var(--border, #e5e7eb)", padding: "16px 0" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>{it.question}</summary>
          <p style={{ color: "var(--muted, #6b7280)", marginTop: 8 }}>{it.answer}</p>
        </details>
      ))}
    </div>
  );
}