"use client";
import { FeaturesVariantProps } from "./types";
export default function FeaturesV4({ heading, features }: FeaturesVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "80px 0" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: 40, color: "var(--accent, #D4AF37)", fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ border: "1px solid #333", background: "transparent", color: "#fff", borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontFamily: "var(--font, serif)" }}>{f.title}</h3>
              <p style={{ color: "#aaa", fontSize: ".9rem" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}