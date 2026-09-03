"use client";
import { FeaturesVariantProps } from "./types";
export default function FeaturesV2({ heading, features }: FeaturesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      {features.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: 20, padding: "18px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
          <div style={{ fontFamily: "var(--font, serif)", fontWeight: 700, color: "var(--primary, #8B4513)", fontSize: "1.3rem", flex: "0 0 auto", width: 40 }}>{String(i + 1).padStart(2, "0")}</div>
          <div>
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{f.title}</h3>
            <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>{f.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}