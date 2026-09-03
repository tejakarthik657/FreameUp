"use client";
import { FeaturesVariantProps } from "./types";
export default function FeaturesV1({ heading, features }: FeaturesVariantProps) {
  return (
    <div className="container" style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--primary, #8B4513)", marginBottom: 40, fontFamily: "var(--font, serif)" }}>{heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 14, padding: 24, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--secondary, #F5E6D3)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #8B4513)", fontWeight: 700 }}>{i + 1}</div>
            <h3 style={{ fontFamily: "var(--font, serif)" }}>{f.title}</h3>
            <p style={{ color: "var(--muted, #6b7280)", fontSize: ".9rem" }}>{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}