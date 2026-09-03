"use client";
import { MenuServicesVariantProps } from "./types";
export default function MenuServicesV2({ heading, categories }: MenuServicesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {categories.map((cat, ci) => (
        <details key={ci} open={ci === 0} style={{ marginBottom: 16 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{cat.name} ({cat.items.length} items)</summary>
          {cat.items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
              <span>{it.name}</span>
              <b>{it.price}</b>
            </div>
          ))}
        </details>
      ))}
    </div>
  );
}