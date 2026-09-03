"use client";
import { MenuServicesVariantProps } from "./types";
export default function MenuServicesV3({ heading, categories }: MenuServicesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 20, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {categories.map((cat, ci) => (
          <div key={ci}>
            <h3 style={{ fontSize: "1rem", color: "var(--primary, #8B4513)", marginBottom: 12, fontFamily: "var(--font, serif)" }}>{cat.name}</h3>
            {cat.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed var(--border, #e5e7eb)" }}>
                <span>{it.name}</span>
                <b>{it.price}</b>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}