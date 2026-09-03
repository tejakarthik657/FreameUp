"use client";
import { AboutVariantProps } from "./types";
export default function AboutV4({ title, description }: AboutVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", textAlign: "center", padding: "90px 0" }}>
      <div className="container">
        <h2 style={{ fontSize: "2rem", color: "var(--accent, #D4AF37)", marginBottom: 18, fontFamily: "var(--font, serif)" }}>{title}</h2>
        <p style={{ color: "#ccc", maxWidth: 600, margin: "0 auto" }}>{description}</p>
      </div>
    </div>
  );
}