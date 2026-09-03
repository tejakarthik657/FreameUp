"use client";
import { MenuServicesVariantProps } from "./types";
export default function MenuServicesV1({ heading, categories }: MenuServicesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ color: "var(--primary, #8B4513)", marginBottom: 24, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: "1.1rem", color: "var(--primary, #8B4513)", marginBottom: 16, fontFamily: "var(--font, serif)" }}>{cat.name}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {cat.items.map((it, i) => (
              <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff" }}>
                <h3 style={{ fontSize: "1rem", fontFamily: "var(--font, serif)" }}>{it.name}</h3>
                <p style={{ color: "var(--primary, #8B4513)", fontWeight: 700 }}>{it.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}